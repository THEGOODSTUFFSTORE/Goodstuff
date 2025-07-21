import { NextRequest, NextResponse } from 'next/server';
import { pesapalApi } from '@/lib/pesapal';
import { updateOrderServer } from '@/lib/server/firebaseAdmin';
import { adminDb } from '@/lib/firebase-admin';

async function handleIPN(OrderTrackingId: string, OrderMerchantReference: string) {
  if (!OrderTrackingId || !OrderMerchantReference) {
    throw new Error('Missing required parameters');
  }

  console.log('Processing IPN:', { OrderTrackingId, OrderMerchantReference });

  // Verify the payment status with Pesapal
  const paymentStatus = await pesapalApi.getTransactionStatus(OrderTrackingId);
  console.log('Payment status from Pesapal:', paymentStatus);

  // Update the order status in Firebase using Admin SDK
  await updateOrderServer(OrderMerchantReference, {
    pesapalPaymentStatus: paymentStatus,
    paymentStatus: paymentStatus.payment_status === 'COMPLETED' ? 'paid' : 
                  paymentStatus.payment_status === 'FAILED' ? 'failed' : 'pending',
    status: paymentStatus.payment_status === 'COMPLETED' ? 'processing' : 'pending'
  });

  return { status: 'success' };
}

export async function GET(request: NextRequest) {
  try {
    // Get the IPN notification data from URL parameters (GET style)
    const searchParams = request.nextUrl.searchParams;
    const OrderTrackingId = searchParams.get('OrderTrackingId');
    const OrderMerchantReference = searchParams.get('OrderMerchantReference');

    if (!OrderTrackingId || !OrderMerchantReference) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const result = await handleIPN(OrderTrackingId, OrderMerchantReference);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing GET IPN notification:', error);
    return NextResponse.json(
      { error: 'Failed to process IPN notification' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the IPN notification data from request body (POST style)
    const body = await request.json();
    const { OrderTrackingId, OrderMerchantReference } = body;

    const result = await handleIPN(OrderTrackingId, OrderMerchantReference);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing POST IPN notification:', error);
    return NextResponse.json(
      { error: 'Failed to process IPN notification' },
      { status: 500 }
    );
  }
} 