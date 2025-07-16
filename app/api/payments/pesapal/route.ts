import { NextRequest, NextResponse } from 'next/server';
import { pesapalApi } from '@/lib/pesapal';
import { auth } from '@/lib/firebase';
import { createOrder, updateOrder } from '@/lib/firebaseApi';
import { PesapalPaymentRequest, Order } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    const { items, totalAmount, shippingAddress, userId, userEmail } = body;

    if (!items || !totalAmount || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a unique tracking ID
    const trackingId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Create the order in Firebase first
    const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: userId || 'guest',
      userEmail: userEmail || shippingAddress.email,
      items,
      totalItems: items.reduce((acc: number, item: any) => acc + item.quantity, 0),
      totalAmount,
      status: 'pending',
      shippingAddress,
      paymentMethod: 'pesapal',
      paymentStatus: 'pending'
    };

    const order = await createOrder(orderData);

    // Prepare the Pesapal payment request
    const paymentRequest: PesapalPaymentRequest = {
      amount: totalAmount,
      currency: 'KES',
      description: `Order ${order.id}`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/pesapal/callback`,
      notification_id: order.id,
      tracking_id: trackingId,
      billing_address: {
        email_address: shippingAddress.email || userEmail || '',
        phone_number: shippingAddress.phone,
        first_name: shippingAddress.name?.split(' ')[0] || '',
        last_name: shippingAddress.name?.split(' ').slice(1).join(' ') || '',
        country_code: 'KE'
      }
    };

    // Submit the order to Pesapal
    const pesapalResponse = await pesapalApi.submitOrder(paymentRequest);

    // Update the order with Pesapal tracking ID
    await updateOrder(order.id, {
      pesapalOrderTrackingId: pesapalResponse.order_tracking_id
    });

    return NextResponse.json({
      orderId: order.id,
      redirectUrl: pesapalResponse.redirect_url
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
} 