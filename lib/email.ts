import nodemailer from 'nodemailer';
import { Order, OrderItem } from './types';

// Email configuration
const emailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email templates
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Admin email configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'tgsliquorstore@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@thegoodstuff.com';
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
      <title>Order Confirmation - ${order.id}</title>
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
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.id}</p>
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
          <p style="margin: 5px 0;"><strong>Address:</strong> ${order.shippingAddress.street || ''}</p>
          <p style="margin: 5px 0;"><strong>City:</strong> ${order.shippingAddress.city || ''}</p>
          <p style="margin: 5px 0;"><strong>State:</strong> ${order.shippingAddress.state || ''}</p>
          <p style="margin: 5px 0;"><strong>Postal Code:</strong> ${order.shippingAddress.postalCode || ''}</p>
          <p style="margin: 5px 0;"><strong>Country:</strong> ${order.shippingAddress.country || 'Kenya'}</p>
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
- Order ID: ${order.id}
- Order Date: ${new Date(order.createdAt).toLocaleDateString()}
- Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
- Payment Status: ${order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'}

Items Ordered:
${itemsText}

Order Total: KES ${order.totalAmount.toLocaleString()}
Total Items: ${order.totalItems}

${order.shippingAddress ? `
Delivery Address:
${order.shippingAddress.name}
${order.shippingAddress.street || ''}
${order.shippingAddress.city || ''}
${order.shippingAddress.state || ''}
${order.shippingAddress.postalCode || ''}
${order.shippingAddress.country || 'Kenya'}
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
    subject: `Order Confirmation - ${order.id} | ${COMPANY_NAME}`,
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
      <title>New Order Alert - ${order.id}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="margin: 0; text-align: center;">🚨 NEW ORDER ALERT</h1>
        <h2 style="margin: 10px 0; text-align: center;">Order #${order.id}</h2>
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
          <p style="margin: 5px 0;"><strong>Address:</strong> ${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}</p>
          <p style="margin: 5px 0;"><strong>State:</strong> ${order.shippingAddress.state || ''}</p>
          <p style="margin: 5px 0;"><strong>Postal Code:</strong> ${order.shippingAddress.postalCode || ''}</p>
          <p style="margin: 5px 0;"><strong>Country:</strong> ${order.shippingAddress.country || 'Kenya'}</p>
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

Order #${order.id}

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
- Address: ${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}
- State: ${order.shippingAddress.state || ''}
- Postal Code: ${order.shippingAddress.postalCode || ''}
- Country: ${order.shippingAddress.country || 'Kenya'}
` : ''}

Items Ordered:
${itemsText}

Action Required:
Please review this order in the admin panel and update the status once processed.
Admin Panel: ${COMPANY_WEBSITE}/admin

This is an automated notification from ${COMPANY_NAME} Order Management System
  `;

  return {
    subject: `🚨 New Order Alert: #${order.id} - KES ${order.totalAmount.toLocaleString()} | ${COMPANY_NAME}`,
    html,
    text
  };
};

export const generateOrderShippedEmail = (order: Order, trackingNumber?: string): EmailTemplate => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Shipped - ${order.id}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #065f46; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="margin: 0; text-align: center;">📦 ORDER SHIPPED</h1>
        <h2 style="margin: 10px 0; text-align: center;">Order #${order.id}</h2>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
        <p>Dear ${order.shippingAddress?.name || 'Valued Customer'},</p>
        
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 10px 0; color: #065f46;">Shipping Details</h3>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.id}</p>
          <p style="margin: 5px 0;"><strong>Shipping Date:</strong> ${new Date().toLocaleDateString()}</p>
          ${trackingNumber ? `<p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
        </div>

        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af;">Delivery Information</h3>
          <p style="margin: 0; color: #1e3a8a;">
            Your order will be delivered to the address you provided during checkout.
            Expected delivery time is typically 1-3 business days within Nairobi and 2-5 business days for other locations.
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
- Order ID: ${order.id}
- Shipping Date: ${new Date().toLocaleDateString()}
${trackingNumber ? `- Tracking Number: ${trackingNumber}` : ''}

Delivery Information:
Your order will be delivered to the address you provided during checkout.
Expected delivery time is typically 1-3 business days within Nairobi and 2-5 business days for other locations.

You can track your order status in your dashboard: ${COMPANY_WEBSITE}/dashboard

Thank you for your business!

© ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.
${COMPANY_WEBSITE}
  `;

  return {
    subject: `📦 Your Order Has Been Shipped - ${order.id} | ${COMPANY_NAME}`,
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
      <title>Order Delivered - ${order.id}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #059669; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="margin: 0; text-align: center;">✅ ORDER DELIVERED</h1>
        <h2 style="margin: 10px 0; text-align: center;">Order #${order.id}</h2>
      </div>
      
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb;">
        <p>Dear ${order.shippingAddress?.name || 'Valued Customer'},</p>
        
        <p>Your order has been successfully delivered! We hope you enjoy your purchase.</p>
        
        <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <h3 style="margin: 0 0 10px 0; color: #065f46;">Delivery Confirmation</h3>
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${order.id}</p>
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
- Order ID: ${order.id}
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
    subject: `✅ Order Delivered Successfully - ${order.id} | ${COMPANY_NAME}`,
    html,
    text
  };
};

// Email sending functions
export const sendEmail = async (to: string, template: EmailTemplate): Promise<boolean> => {
  try {
    const mailOptions = {
      from: `"${COMPANY_NAME}" <${FROM_EMAIL}>`,
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    };

    await transporter.sendMail(mailOptions);
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

export const sendOrderShippedEmail = async (order: Order, trackingNumber?: string): Promise<boolean> => {
  const template = generateOrderShippedEmail(order, trackingNumber);
  return await sendEmail(order.userEmail, template);
};

export const sendOrderDeliveredEmail = async (order: Order): Promise<boolean> => {
  const template = generateOrderDeliveredEmail(order);
  return await sendEmail(order.userEmail, template);
};

// Utility function to send multiple emails
export const sendOrderNotifications = async (order: Order, type: 'created' | 'shipped' | 'delivered', trackingNumber?: string): Promise<void> => {
  try {
    switch (type) {
      case 'created':
        await Promise.all([
          sendOrderConfirmationEmail(order),
          sendAdminNewOrderEmail(order)
        ]);
        break;
      case 'shipped':
        await sendOrderShippedEmail(order, trackingNumber);
        break;
      case 'delivered':
        await sendOrderDeliveredEmail(order);
        break;
    }
  } catch (error) {
    console.error(`Error sending ${type} notifications:`, error);
  }
}; 