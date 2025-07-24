import { NextRequest, NextResponse } from 'next/server';
import { pesapalApi } from '@/lib/pesapal';
import { updateOrderServer } from '@/lib/server/firebaseAdmin';
import { sendOrderNotifications } from '@/lib/email';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Get the order tracking ID from the URL
    const searchParams = request.nextUrl.searchParams;
    const orderTrackingId = searchParams.get('OrderTrackingId');
    const orderId = searchParams.get('OrderMerchantReference');

    console.log('Payment callback received:', { orderTrackingId, orderId });

    if (!orderTrackingId || !orderId) {
      console.error('Missing required parameters in callback');
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get the transaction status from Pesapal
    console.log('Fetching transaction status from Pesapal...');
    const paymentStatus = await pesapalApi.getTransactionStatus(orderTrackingId);
    console.log('Payment status from Pesapal:', paymentStatus);

    // Get current order data for email notifications
    const orderDoc = await adminDb.collection('orders').doc(orderId).get();
    const orderData = orderDoc.exists ? { id: orderDoc.id, ...orderDoc.data() } : null;

    // Update the order status in Firebase using Admin SDK
    const updateData: any = {
      pesapalPaymentStatus: paymentStatus,
      paymentStatus: paymentStatus.payment_status === 'COMPLETED' ? 'paid' : 
                    paymentStatus.payment_status === 'FAILED' ? 'failed' : 'pending',
      status: paymentStatus.payment_status === 'COMPLETED' ? 'processing' : 'pending',
      updatedAt: new Date().toISOString()
    };

    console.log('Updating order with status:', updateData);
    await updateOrderServer(orderId, updateData);
    console.log('Order updated successfully');

    // Send email notifications for successful payments
    if (paymentStatus.payment_status === 'COMPLETED' && orderData) {
      try {
        await sendOrderNotifications(orderData as any, 'paid');
        console.log('Payment confirmation emails sent');
      } catch (emailError) {
        console.error('Failed to send payment confirmation emails:', emailError);
        // Don't fail the callback for email issues
      }
    }

    // Redirect to the appropriate page based on payment status
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const redirectUrl = paymentStatus.payment_status === 'COMPLETED' 
      ? `${baseUrl}/dashboard?payment=success&orderId=${orderId}`
      : paymentStatus.payment_status === 'FAILED'
      ? `${baseUrl}/dashboard?payment=failed&orderId=${orderId}`
      : `${baseUrl}/dashboard?payment=pending&orderId=${orderId}`;

    console.log('Redirecting to:', redirectUrl);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error processing payment callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=error`
    );
  }
} 