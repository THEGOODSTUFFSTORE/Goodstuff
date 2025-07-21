import { NextRequest, NextResponse } from 'next/server';
import { pesapalApi } from '@/lib/pesapal';
import { updateOrderServer } from '@/lib/server/firebaseAdmin';

export async function GET(request: NextRequest) {
  try {
    // Get the order tracking ID from the URL
    const searchParams = request.nextUrl.searchParams;
    const orderTrackingId = searchParams.get('OrderTrackingId');
    const orderId = searchParams.get('OrderMerchantReference');

    if (!orderTrackingId || !orderId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get the transaction status from Pesapal
    const paymentStatus = await pesapalApi.getTransactionStatus(orderTrackingId);

    // Update the order status in Firebase using Admin SDK
    await updateOrderServer(orderId, {
      pesapalPaymentStatus: paymentStatus,
      paymentStatus: paymentStatus.payment_status === 'COMPLETED' ? 'paid' : 
                    paymentStatus.payment_status === 'FAILED' ? 'failed' : 'pending',
      status: paymentStatus.payment_status === 'COMPLETED' ? 'processing' : 'pending'
    });

    // Redirect to the appropriate page based on payment status
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const redirectUrl = paymentStatus.payment_status === 'COMPLETED' 
      ? `${baseUrl}/dashboard?payment=success&orderId=${orderId}`
      : paymentStatus.payment_status === 'FAILED'
      ? `${baseUrl}/dashboard?payment=failed&orderId=${orderId}`
      : `${baseUrl}/dashboard?payment=pending&orderId=${orderId}`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Error processing payment callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=error`
    );
  }
} 