import nodemailer from 'nodemailer';
import { Order, OrderItem } from './types';
import { formatShippingAddress } from './utils';

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER;
const emailConfig = {
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
  // Conservative timeouts to prevent long-hangs on Gmail
  connectionTimeout: 10000, // 10s
  greetingTimeout: 10000,   // 10s
  socketTimeout: 20000,     // 20s
} as const;

// Allow disabling all order emails via env
const DISABLE_ORDER_EMAILS = (process.env.DISABLE_ORDER_EMAILS || '').toLowerCase() === 'true';

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Retry + timeout helpers
const EMAIL_SEND_MAX_ATTEMPTS = Number.parseInt(process.env.EMAIL_SEND_MAX_ATTEMPTS || '2');
const EMAIL_SEND_BASE_BACKOFF_MS = Number.parseInt(process.env.EMAIL_SEND_BASE_BACKOFF_MS || '600');
const EMAIL_SEND_TIMEOUT_MS = Number.parseInt(process.env.EMAIL_SEND_TIMEOUT_MS || '8000');

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendMailWithRetry(mailOptions: any): Promise<void> {
  let attempt = 0;
  // Always attempt at least once
  const maxAttempts = Math.max(1, EMAIL_SEND_MAX_ATTEMPTS);
  // Per-attempt timeout wrapper
  const sendWithTimeout = async (): Promise<void> => {
    const timeout = new Promise<never>((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error(`Email send timed out after ${EMAIL_SEND_TIMEOUT_MS}ms`));
      }, EMAIL_SEND_TIMEOUT_MS);
    });
    await Promise.race([
      transporter.sendMail(mailOptions),
      timeout,
    ]);
  };

  for (;;) {
    attempt += 1;
    try {
      await sendWithTimeout();
      return; // success
    } catch (err) {
      const isLast = attempt >= maxAttempts;
      console.error(`Email send attempt ${attempt}/${maxAttempts} failed:`, err);
      if (isLast) throw err;
      const backoffMs = EMAIL_SEND_BASE_BACKOFF_MS * attempt;
      await delay(backoffMs);
    }
  }
}

// Email templates
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Admin email configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'tgsliquorstore@gmail.com';
// Use the authenticated Gmail as the default From to avoid delivery delays
const FROM_EMAIL = EMAIL_USER || process.env.FROM_EMAIL || 'tgsliquorstore@gmail.com';
const COMPANY_NAME = 'The Goodstuff';
const COMPANY_WEBSITE = process.env.NEXT_PUBLIC_APP_URL || 'https://thegoodstuffdrinks.delivery';

// Email template generators
export const generateOrderConfirmationEmail = (order: Order): EmailTemplate => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.productName}</strong><br>
        <small>Category: ${item.category}${item.subcategory ? ` - ${item.subcategory}` : ''}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">KES ${item.priceAtOrder.toLocaleString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">KES ${(item.priceAtOrder * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  const itemsText = order.items.map(item => 
    `${item.productName} (${item.category}${item.subcategory ? ` - ${item.subcategory}` : ''}) - Qty: ${item.quantity} - KES ${item.priceAtOrder.toLocaleString()} each - Total: KES ${(item.priceAtOrder * item.quantity).toLocaleString()}`
  ).join('\n');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - ${order.orderNumber || order.id}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: #dc2626; margin: 0; text-align: center;">${COMPANY_NAME}</h1>
        <h2 style="color: #374151; margin: 10px 0; text-align: center;">Order Confirmation</h2>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
        <p>Dear ${order.shippingAddress?.name || 'Valued Customer'},</p>
        
        <p>Thank you for your order! We've received your order and it's being processed. Here are the details:</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #374151;">Order Details</h3>
          <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.orderNumber || order.id}</p>
          <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
          <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}</p>
        </div>

        <h3 style="color: #374151; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">Product</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Unit Price</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background-color: #fef3f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="margin: 0 0 10px 0; color: #dc2626;">Order Total: KES ${order.totalAmount.toLocaleString()}</h3>
          <p style="margin: 0; color: #7f1d1d;"><strong>Total Items:</strong> ${order.totalItems}</p>
        </div>

        ${order.shippingAddress ? `
        <h3 style="color: #374151; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Delivery Address</h3>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${order.shippingAddress.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${order.shippingAddress.email}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
          <p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${formatShippingAddress(order.shippingAddress)}</p>
        </div>
        ` : ''}

        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">What's Next?</h3>
          <ul style="margin: 0; padding-left: 20px; color: #1e3a8a;">
            <li>We'll process your order within 24 hours</li>
            <li>You'll receive a shipping notification when your order is dispatched</li>
            <li>Track your order status in your <a href="${COMPANY_WEBSITE}/dashboard" style="color: #dc2626;">dashboard</a></li>
          </ul>
        </div>

        <p>If you have any questions about your order, please don't hesitate to contact us.</p>
        
        <p>Thank you for choosing ${COMPANY_NAME}!</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.<br>
          <a href="${COMPANY_WEBSITE}" style="color: #dc2626;">${COMPANY_WEBSITE}</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
Order Confirmation - ${COMPANY_NAME}

Dear ${order.shippingAddress?.name || 'Valued Customer'},

Thank you for your order! We've received your order and it's being processed.

Order Details:
- Order Number: ${order.orderNumber || order.id}
- Order Date: ${new Date(order.createdAt).toLocaleDateString()}
- Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
- Payment Status: ${order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}

Items Ordered:
${itemsText}

Order Total: KES ${order.totalAmount.toLocaleString()}
Total Items: ${order.totalItems}

${order.shippingAddress ? `
Delivery Address:
Name: ${order.shippingAddress.name}
Email: ${order.shippingAddress.email}
Phone: ${order.shippingAddress.phone}
Delivery Address: ${formatShippingAddress(order.shippingAddress)}
` : ''}

What's Next?
- We'll process your order within 24 hours
- You'll receive a shipping notification when your order is dispatched
- Track your order status in your dashboard: ${COMPANY_WEBSITE}/dashboard

If you have any questions about your order, please don't hesitate to contact us.

Thank you for choosing ${COMPANY_NAME}!

© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
${COMPANY_WEBSITE}
  `;

  return {
    subject: `Order Confirmation - ${order.orderNumber || order.id} | ${COMPANY_NAME}`,
    html,
    text
  };
};

export const generateAdminNewOrderEmail = (order: Order): EmailTemplate => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">KES ${item.priceAtOrder.toLocaleString()}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">KES ${(item.priceAtOrder * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  const itemsText = order.items.map(item => 
    `${item.productName} - Qty: ${item.quantity} - KES ${item.priceAtOrder.toLocaleString()} each`
  ).join('\n');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Alert - ${order.orderNumber || order.id}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="margin: 0; text-align: center;">🚨 NEW ORDER ALERT</h1>
        <h2 style="margin: 10px 0; text-align: center;">Order #${order.orderNumber || order.id}</h2>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
        <div style="background-color: #fef3f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="margin: 0 0 10px 0; color: #dc2626;">Order Summary</h3>
          <p style="margin: 5px 0;"><strong>Order Value:</strong> KES ${order.totalAmount.toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Total Items:</strong> ${order.totalItems}</p>
          <p style="margin: 5px 0;"><strong>Customer:</strong> ${order.shippingAddress?.name || order.userEmail}</p>
          <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()} ${new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>

        <h3 style="color: #374151; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Customer Information</h3>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${order.userEmail}</p>
          <p style="margin: 5px 0;"><strong>User ID:</strong> ${order.userId}</p>
          ${order.shippingAddress ? `
          <p style="margin: 5px 0;"><strong>Name:</strong> ${order.shippingAddress.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${order.shippingAddress.email}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
          <p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${formatShippingAddress(order.shippingAddress)}</p>
          ` : ''}
        </div>

        <h3 style="color: #374151; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Product</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Unit Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">Action Required</h3>
          <p style="margin: 0; color: #1e3a8a;">
            Please review this order in the admin panel and update the status once processed.
            <br><a href="${COMPANY_WEBSITE}/admin" style="color: #dc2626;">Go to Admin Panel</a>
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          This is an automated notification from ${COMPANY_NAME} Order Management System
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
NEW ORDER ALERT - ${COMPANY_NAME}

Order #${order.orderNumber || order.id}

Order Summary:
- Order Value: KES ${order.totalAmount.toLocaleString()}
- Total Items: ${order.totalItems}
- Customer: ${order.shippingAddress?.name || order.userEmail}
- Order Date: ${new Date(order.createdAt).toLocaleDateString()} ${new Date(order.createdAt).toLocaleTimeString()}

Customer Information:
- Email: ${order.userEmail}
- User ID: ${order.userId}
${order.shippingAddress ? `
- Name: ${order.shippingAddress.name}
- Email: ${order.shippingAddress.email}
- Phone: ${order.shippingAddress.phone}
- Delivery Address: ${formatShippingAddress(order.shippingAddress)}
` : ''}

Items Ordered:
${itemsText}

Action Required:
Please review this order in the admin panel and update the status once processed.
Admin Panel: ${COMPANY_WEBSITE}/admin

This is an automated notification from ${COMPANY_NAME} Order Management System
  `;

  return {
    subject: `🚨 New Order Alert: #${order.orderNumber || order.id} - KES ${order.totalAmount.toLocaleString()} | ${COMPANY_NAME}`,
    html,
    text
  };
};

export const generateOrderShippedEmail = (order: Order, driverNumber?: string): EmailTemplate => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Shipped - ${order.orderNumber || order.id}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #065f46; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="margin: 0; text-align: center;">📦 ORDER SHIPPED</h1>
        <h2 style="margin: 10px 0; text-align: center;">Order #${order.orderNumber || order.id}</h2>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
        <p>Dear ${order.shippingAddress?.name || 'Valued Customer'},</p>
        
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 10px 0; color: #065f46;">Shipping Details</h3>
          <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.orderNumber || order.id}</p>
          <p style="margin: 5px 0;"><strong>Shipping Date:</strong> ${new Date().toLocaleDateString()}</p>
          ${driverNumber ? `<p style="margin: 5px 0;"><strong>Driver Number:</strong> ${driverNumber}</p>` : ''}
        </div>

        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">Delivery Information</h3>
          <p style="margin: 0; color: #1e3a8a;">
            Your order will be delivered to the address you provided during checkout.
            Expected delivery time is typically 30-40 minutes within Nairobi and 2-5 business days for other locations.
          </p>
        </div>

        <p>You can track your order status in your <a href="${COMPANY_WEBSITE}/dashboard" style="color: #dc2626;">dashboard</a>.</p>
        
        <p>Thank you for your business!</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.<br>
          <a href="${COMPANY_WEBSITE}" style="color: #dc2626;">${COMPANY_WEBSITE}</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
ORDER SHIPPED - ${COMPANY_NAME}

Dear ${order.shippingAddress?.name || 'Valued Customer'},

Great news! Your order has been shipped and is on its way to you.

Shipping Details:
- Order Number: ${order.orderNumber || order.id}
- Shipping Date: ${new Date().toLocaleDateString()}
${driverNumber ? `- Driver Number: ${driverNumber}` : ''}

Delivery Information:
Your order will be delivered to the address you provided during checkout.
Expected delivery time is typically 30-40 minutes within Nairobi and 2-5 business days for other locations.

You can track your order status in your dashboard: ${COMPANY_WEBSITE}/dashboard

Thank you for your business!

© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
${COMPANY_WEBSITE}
  `;

  return {
    subject: `📦 Your Order Has Been Shipped - ${order.orderNumber || order.id} | ${COMPANY_NAME}`,
    html,
    text
  };
};

export const generateOrderDeliveredEmail = (order: Order): EmailTemplate => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Delivered - ${order.orderNumber || order.id}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #059669; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="margin: 0; text-align: center;">✅ ORDER DELIVERED</h1>
        <h2 style="margin: 10px 0; text-align: center;">Order #${order.orderNumber || order.id}</h2>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
        <p>Dear ${order.shippingAddress?.name || 'Valued Customer'},</p>
        
        <p>Your order has been successfully delivered! We hope you enjoy your purchase.</p>
        
        <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 10px 0; color: #065f46;">Delivery Confirmation</h3>
          <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.orderNumber || order.id}</p>
          <p style="margin: 5px 0;"><strong>Delivery Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Order Total:</strong> KES ${order.totalAmount.toLocaleString()}</p>
        </div>

        <div style="background-color: #fef3f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="margin: 0 0 10px 0; color: #dc2626;">We Value Your Feedback</h3>
          <p style="margin: 0; color: #7f1d1d;">
            How was your experience? We'd love to hear from you!
            Your feedback helps us improve our service for all customers.
          </p>
        </div>

        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">Continue Shopping</h3>
          <p style="margin: 0; color: #1e3a8a;">
            Browse our latest collection and discover more amazing products.
            <br><a href="${COMPANY_WEBSITE}" style="color: #dc2626;">Visit Our Store</a>
          </p>
        </div>

        <p>Thank you for choosing ${COMPANY_NAME}. We look forward to serving you again!</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.<br>
          <a href="${COMPANY_WEBSITE}" style="color: #dc2626;">${COMPANY_WEBSITE}</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
ORDER DELIVERED - ${COMPANY_NAME}

Dear ${order.shippingAddress?.name || 'Valued Customer'},

Your order has been successfully delivered! We hope you enjoy your purchase.

Delivery Confirmation:
- Order Number: ${order.orderNumber || order.id}
- Delivery Date: ${new Date().toLocaleDateString()}
- Order Total: KES ${order.totalAmount.toLocaleString()}

We Value Your Feedback:
How was your experience? We'd love to hear from you!
Your feedback helps us improve our service for all customers.

Continue Shopping:
Browse our latest collection and discover more amazing products.
Visit Our Store: ${COMPANY_WEBSITE}

Thank you for choosing ${COMPANY_NAME}. We look forward to serving you again!

© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
${COMPANY_WEBSITE}
  `;

  return {
    subject: `✅ Order Delivered Successfully - ${order.orderNumber || order.id} | ${COMPANY_NAME}`,
    html,
    text
  };
};

export const generatePaymentConfirmationEmail = (order: Order): EmailTemplate => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Payment Confirmed - ${order.orderNumber || order.id}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #059669; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="margin: 0; text-align: center;">✅ PAYMENT CONFIRMED</h1>
        <h2 style="margin: 10px 0; text-align: center;">Order #${order.orderNumber || order.id}</h2>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
        <p>Dear ${order.shippingAddress?.name || 'Valued Customer'},</p>
        
        <p>Great news! Your payment has been successfully processed and confirmed.</p>
        
        <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 10px 0; color: #065f46;">Payment Details</h3>
          <p style="margin: 5px 0;"><strong>Order Number:</strong> ${order.orderNumber || order.id}</p>
          <p style="margin: 5px 0;"><strong>Payment Amount:</strong> KES ${order.totalAmount.toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #059669;">Paid & Confirmed</span></p>
        </div>

        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">What's Next?</h3>
          <p style="margin: 0; color: #1e3a8a;">
            Your order is now being processed and will be shipped within 1-2 business days.
            You'll receive a shipping confirmation email with tracking details once your order is dispatched.
          </p>
        </div>

        <p>You can track your order status in your <a href="${COMPANY_WEBSITE}/dashboard" style="color: #dc2626;">dashboard</a>.</p>
        
        <p>Thank you for your business!</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          © ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.<br>
          <a href="${COMPANY_WEBSITE}" style="color: #dc2626;">${COMPANY_WEBSITE}</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
PAYMENT CONFIRMED - ${COMPANY_NAME}

Dear ${order.shippingAddress?.name || 'Valued Customer'},

Great news! Your payment has been successfully processed and confirmed.

Payment Details:
- Order Number: ${order.orderNumber || order.id}
- Payment Amount: KES ${order.totalAmount.toLocaleString()}
- Payment Date: ${new Date().toLocaleDateString()}
- Status: Paid & Confirmed

What's Next?
Your order is now being processed and will be shipped within 1-2 business days.
You'll receive a shipping confirmation email with tracking details once your order is dispatched.

You can track your order status in your dashboard: ${COMPANY_WEBSITE}/dashboard

Thank you for your business!

© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
${COMPANY_WEBSITE}
  `;

  return {
    subject: `✅ Payment Confirmed - Order #${order.orderNumber || order.id} | ${COMPANY_NAME}`,
    html,
    text
  };
};

// Email sending functions
export const sendEmail = async (to: string, template: EmailTemplate): Promise<boolean> => {
  try {
    if (DISABLE_ORDER_EMAILS) {
      console.log(`Email disabled by DISABLE_ORDER_EMAILS. Skipping send to ${to} with subject: ${template.subject}`);
      return true;
    }

    const mailOptions = {
      from: `"${COMPANY_NAME}" <${FROM_EMAIL}>`,
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
      replyTo: ADMIN_EMAIL,
      priority: 'high',
    } as const;

    await sendMailWithRetry(mailOptions);
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendOrderConfirmationEmail = async (order: Order): Promise<boolean> => {
  const template = generateOrderConfirmationEmail(order);
  return await sendEmail(order.userEmail, template);
};

export const sendAdminNewOrderEmail = async (order: Order): Promise<boolean> => {
  const template = generateAdminNewOrderEmail(order);
  return await sendEmail(ADMIN_EMAIL, template);
};

export const sendOrderShippedEmail = async (order: Order, driverNumber?: string): Promise<boolean> => {
  const template = generateOrderShippedEmail(order, driverNumber);
  return await sendEmail(order.userEmail, template);
};

export const sendOrderDeliveredEmail = async (order: Order): Promise<boolean> => {
  const template = generateOrderDeliveredEmail(order);
  return await sendEmail(order.userEmail, template);
};

export const sendPaymentConfirmationEmail = async (order: Order): Promise<boolean> => {
  const template = generatePaymentConfirmationEmail(order);
  return await sendEmail(order.userEmail, template);
};

// Utility function to send multiple emails
export const sendOrderNotifications = async (order: Order, type: 'created' | 'paid' | 'shipped' | 'delivered', driverNumber?: string): Promise<void> => {
  try {
    console.log(`Attempting to send ${type} notifications for order ${order.orderNumber || order.id} to ${order.userEmail}`);
    
    if (DISABLE_ORDER_EMAILS) {
      console.log(`Emails disabled by DISABLE_ORDER_EMAILS. Skipping ${type} email notifications for order ${order.orderNumber || order.id}`);
      return;
    }

    if (!order.userEmail) {
      console.error(`No user email found for order ${order.orderNumber || order.id}`);
      return;
    }

    switch (type) {
      case 'created':
        console.log('Sending order confirmation emails...');
        await Promise.all([
          sendOrderConfirmationEmail(order),
          sendAdminNewOrderEmail(order)
        ]);
        break;
      case 'paid':
        console.log('Sending payment confirmation email...');
        await sendPaymentConfirmationEmail(order);
        break;
      case 'shipped':
        console.log('Sending shipping notification email...');
        await sendOrderShippedEmail(order, driverNumber);
        break;
      case 'delivered':
        console.log('Sending delivery notification email...');
        await sendOrderDeliveredEmail(order);
        break;
    }
    console.log(`${type} notifications sent successfully for order ${order.orderNumber || order.id}`);
  } catch (error) {
    console.error(`Error sending ${type} notifications for order ${order.orderNumber || order.id}:`, error);
    throw error; // Re-throw to help with debugging
  }
}; 