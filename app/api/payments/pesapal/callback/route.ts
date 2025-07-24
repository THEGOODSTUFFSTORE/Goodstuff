import { NextRequest, NextResponse } from 'next/server';
import { pesapalApi } from '@/lib/pesapal';
import { updateOrderServer } from '@/lib/server/firebaseAdmin';
import { sendOrderNotifications } from '@/lib/email';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  console.log('=== PESAPAL CALLBACK START ===');
  console.log('Request URL:', request.url);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Get the order tracking ID from the URL
    const searchParams = request.nextUrl.searchParams;
    const orderTrackingId = searchParams.get('OrderTrackingId');
    const orderId = searchParams.get('OrderMerchantReference');

    console.log('Payment callback received:', { orderTrackingId, orderId });
    console.log('All URL parameters:', Object.fromEntries(searchParams.entries()));

    if (!orderTrackingId || !orderId) {
      console.error('Missing required parameters in callback');
      console.log('Available parameters:', Object.fromEntries(searchParams.entries()));
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get the transaction status from Pesapal
    console.log('Fetching transaction status from Pesapal...');
    const paymentStatus = await pesapalApi.getTransactionStatus(orderTrackingId);
    console.log('Payment status from Pesapal:', JSON.stringify(paymentStatus, null, 2));

    // Get current order data for email notifications
    console.log('Fetching order from database...');
    const orderDoc = await adminDb.collection('orders').doc(orderId).get();
    console.log('Order exists in database:', orderDoc.exists);
    
    const orderData = orderDoc.exists ? { id: orderDoc.id, ...orderDoc.data() } : null;
    if (orderData) {
      const order = orderData as any;
      console.log('Current order data:', {
        id: order.id,
        userId: order.userId,
        userEmail: order.userEmail,
        paymentStatus: order.paymentStatus,
        status: order.status,
        orderNumber: order.orderNumber
      });
    }

    // Update the order status in Firebase using Admin SDK
    const updateData: any = {
      pesapalPaymentStatus: paymentStatus,
      paymentStatus: (paymentStatus.payment_status_description === 'Completed' || paymentStatus.payment_status === 'COMPLETED') ? 'paid' : 
                    (paymentStatus.payment_status_description === 'Failed' || paymentStatus.payment_status === 'FAILED') ? 'failed' : 'pending',
      status: (paymentStatus.payment_status_description === 'Completed' || paymentStatus.payment_status === 'COMPLETED') ? 'processing' : 'pending',
      updatedAt: new Date().toISOString(),
      callbackProcessedAt: new Date().toISOString()
    };

    console.log('Updating order with status:', JSON.stringify(updateData, null, 2));
    await updateOrderServer(orderId, updateData);
    console.log('Order updated successfully');

    // Verify the update worked
    const updatedOrderDoc = await adminDb.collection('orders').doc(orderId).get();
    if (updatedOrderDoc.exists) {
      const updatedData = updatedOrderDoc.data();
      console.log('Verified updated order data:', {
        paymentStatus: updatedData?.paymentStatus,
        status: updatedData?.status,
        callbackProcessedAt: updatedData?.callbackProcessedAt
      });
    }

    // Send email notifications for successful payments
    if ((paymentStatus.payment_status_description === 'Completed' || paymentStatus.payment_status === 'COMPLETED') && orderData) {
      try {
        console.log('Sending payment confirmation emails...');
        await sendOrderNotifications(orderData as any, 'paid');
        console.log('Payment confirmation emails sent');
      } catch (emailError) {
        console.error('Failed to send payment confirmation emails:', emailError);
        // Don't fail the callback for email issues
      }
    }

    // Redirect to the appropriate page based on payment status
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const redirectUrl = (paymentStatus.payment_status_description === 'Completed' || paymentStatus.payment_status === 'COMPLETED')
      ? `${baseUrl}/dashboard?payment=success&orderId=${orderId}&timestamp=${Date.now()}`
      : (paymentStatus.payment_status_description === 'Failed' || paymentStatus.payment_status === 'FAILED')
      ? `${baseUrl}/dashboard?payment=failed&orderId=${orderId}&timestamp=${Date.now()}`
      : `${baseUrl}/dashboard?payment=pending&orderId=${orderId}&timestamp=${Date.now()}`;

    console.log('Redirecting to:', redirectUrl);
    console.log('=== PESAPAL CALLBACK END ===');
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('=== PESAPAL CALLBACK ERROR ===');
    console.error('Error processing payment callback:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    console.log('=== PESAPAL CALLBACK ERROR END ===');
    
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=error&timestamp=${Date.now()}`
    );
  }
} 