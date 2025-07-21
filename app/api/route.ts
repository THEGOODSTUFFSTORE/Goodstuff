import { NextRequest, NextResponse } from 'next/server';
import { pesapalApi } from '@/lib/pesapal';
import { updateOrderServer } from '@/lib/server/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    // Get the IPN notification data
    const body = await request.json();
    const { OrderTrackingId, OrderMerchantReference } = body;

    console.log('Received IPN notification:', body);

    if (!OrderTrackingId || !OrderMerchantReference) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify the payment status with Pesapal
    const paymentStatus = await pesapalApi.getTransactionStatus(OrderTrackingId);
    console.log('Payment status:', paymentStatus);

    // Update the order status in Firebase using Admin SDK
    await updateOrderServer(OrderMerchantReference, {
      pesapalPaymentStatus: paymentStatus,
      paymentStatus: paymentStatus.payment_status === 'COMPLETED' ? 'paid' : 
                    paymentStatus.payment_status === 'FAILED' ? 'failed' : 'pending',
      status: paymentStatus.payment_status === 'COMPLETED' ? 'processing' : 'pending'
    });

    // Return success response to Pesapal
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing IPN notification:', error);
    return NextResponse.json(
      { error: 'Failed to process IPN notification' },
      { status: 500 }
    );
  }
}

// Also handle GET requests for IPN verification
export async function GET(request: NextRequest) {
  console.log('Received GET request for IPN verification');
  return NextResponse.json({ status: 'success' });
} 