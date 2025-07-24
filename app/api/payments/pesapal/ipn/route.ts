import { NextRequest, NextResponse } from 'next/server';
import { pesapalApi } from '@/lib/pesapal';
import { updateOrderServer, reduceProductInventory } from '@/lib/server/firebaseAdmin';
import { adminDb } from '@/lib/firebase-admin';
import { sendOrderNotifications } from '@/lib/email';

async function handleIPN(OrderTrackingId: string, OrderMerchantReference: string) {
  if (!OrderTrackingId || !OrderMerchantReference) {
    throw new Error('Missing required parameters');
  }

  console.log('Processing IPN:', { OrderTrackingId, OrderMerchantReference });

  // Verify the payment status with Pesapal
  const paymentStatus = await pesapalApi.getTransactionStatus(OrderTrackingId);
  console.log('Payment status from Pesapal:', paymentStatus);

  // Get current order data for email notifications
  const orderDoc = await adminDb.collection('orders').doc(OrderMerchantReference).get();
  const orderData = orderDoc.exists ? { id: orderDoc.id, ...orderDoc.data() } : null;

  // Update the order status in Firebase using Admin SDK
  const updateData: any = {
    pesapalPaymentStatus: paymentStatus,
    paymentStatus: (paymentStatus.payment_status_description === 'Completed' || paymentStatus.payment_status === 'COMPLETED') ? 'paid' : 
                  (paymentStatus.payment_status_description === 'Failed' || paymentStatus.payment_status === 'FAILED') ? 'failed' : 'pending',
    status: (paymentStatus.payment_status_description === 'Completed' || paymentStatus.payment_status === 'COMPLETED') ? 'processing' : 'pending',
    updatedAt: new Date().toISOString()
  };

  console.log('Updating order via IPN with status:', updateData);
  await updateOrderServer(OrderMerchantReference, updateData);
  console.log('Order updated successfully via IPN');

  // Reduce inventory if payment is completed and we haven't already processed this payment
  if ((paymentStatus.payment_status_description === 'Completed' || paymentStatus.payment_status === 'COMPLETED') && orderData) {
    try {
      const order = orderData as any;
      // Check if inventory has already been reduced for this order to prevent double reduction
      if (!order.inventoryReduced) {
        console.log('IPN: Reducing inventory for completed payment');
        await reduceProductInventory(order.items);
        
        // Mark that inventory has been reduced for this order
        await updateOrderServer(OrderMerchantReference, {
          inventoryReduced: true,
          inventoryReducedAt: new Date().toISOString()
        });
        
        console.log('IPN: Inventory reduction completed');
      } else {
        console.log('IPN: Inventory already reduced for this order, skipping');
      }
    } catch (inventoryError) {
      console.error('IPN: Failed to reduce inventory:', inventoryError);
      // Don't fail the IPN for inventory issues, but log it
    }
  }

  // Send email notifications for status changes
  if (orderData) {
    try {
      if (paymentStatus.payment_status_description === 'Completed' || paymentStatus.payment_status === 'COMPLETED') {
        await sendOrderNotifications(orderData as any, 'paid');
        console.log('Payment confirmation emails sent via IPN');
      }
    } catch (emailError) {
      console.error('Failed to send emails via IPN:', emailError);
      // Don't fail the IPN for email issues
    }
  }

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