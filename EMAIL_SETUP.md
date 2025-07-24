# Email Notification System Setup

This document explains how to set up the email notification system for order updates.

## Overview

The email system sends automated notifications for:
1. **Order Confirmation** - Customer receives confirmation when order is placed
2. **Admin New Order Alert** - Admin receives notification of new orders
3. **Order Shipped** - Customer receives notification when order is shipped
4. **Order Delivered** - Customer receives confirmation when order is delivered

## Environment Variables Required

Add the following environment variables to your `.env.local` file:

```env
# Email Configuration (Gmail SMTP)
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_APP_PASSWORD=your-app-password
FROM_EMAIL=noreply@thegoodstuff.co.ke
ADMIN_EMAIL=admin@thegoodstuff.co.ke
```

## Gmail Setup Instructions

### 1. Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Turn on 2-Step Verification

### 2. Generate App Password
1. In your Google Account settings, go to Security
2. Under "2-Step Verification", select App passwords
3. Generate a new app password for "Mail"
4. Use this 16-character password as `EMAIL_APP_PASSWORD`

### 3. Alternative Email Services

If you prefer to use other email services, update the transporter configuration in `lib/email.ts`:

#### SendGrid
```typescript
const transporter = nodemailer.createTransporter({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

#### Outlook/Hotmail
```typescript
const transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});
```

#### Custom SMTP
```typescript
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Email Templates

The system includes beautifully designed HTML email templates for:

- **Order Confirmation**: Professional order summary with itemized list
- **Admin Alert**: Detailed new order notification for administrators
- **Shipping Notification**: Tracking information and delivery expectations
- **Delivery Confirmation**: Order completion and feedback request

## How It Works

### Order Creation Flow
1. Customer places order in checkout
2. Order is created in Firebase
3. System automatically sends:
   - Order confirmation email to customer
   - New order alert to admin

### Order Status Updates
1. Admin updates order status in admin panel
2. System automatically sends appropriate email:
   - **Status: Shipped** → Shipping notification to customer
   - **Status: Delivered/Completed** → Delivery confirmation to customer

### Admin Interface
- View all orders in organized table
- Filter by status (pending, processing, shipped, delivered, etc.)
- Update order status with dropdown
- Add tracking numbers for shipped orders
- Real-time email notifications

## Error Handling

- Email sending is non-blocking (won't fail order creation)
- Errors are logged to console for debugging
- Failed emails don't affect order processing
- System gracefully handles missing email configuration

## Testing

To test the email system:

1. Set up environment variables
2. Place a test order
3. Check both customer and admin emails
4. Update order status in admin panel
5. Verify appropriate emails are sent

## Troubleshooting

### Common Issues

1. **Gmail authentication errors**
   - Ensure 2FA is enabled
   - Use app password, not regular password
   - Check that "Less secure app access" is disabled

2. **Emails not sending**
   - Verify environment variables are set
   - Check console logs for error messages
   - Ensure Gmail account is not locked

3. **Emails going to spam**
   - Set up proper SPF/DKIM records for custom domain
   - Use a verified sending domain
   - Consider using SendGrid or similar service

### Debug Mode

To enable detailed logging, set:
```env
DEBUG_EMAIL=true
```

This will log all email attempts and responses.

## Security Considerations

- Never commit email credentials to version control
- Use environment variables for all sensitive data
- Consider using OAuth2 for production Gmail integration
- Implement rate limiting for email sending
- Use a dedicated email service for high volume

## Production Recommendations

For production deployment:

1. **Use a dedicated email service** (SendGrid, Mailgun, AWS SES)
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Monitor email delivery rates**
4. **Implement email templates versioning**
5. **Add unsubscribe functionality**
6. **Set up email bounce handling**

## Support
If you encounter issues with the email system, check:
1. Environment variables are correctly set
2. Network connectivity
3. Email service provider status
4. Console logs for detailed error messages 