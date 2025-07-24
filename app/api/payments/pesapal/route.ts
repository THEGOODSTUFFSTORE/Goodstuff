import { NextRequest, NextResponse } from 'next/server';
import { pesapalApi } from '@/lib/pesapal';
import { createOrderServer, updateOrderServer } from '@/lib/server/firebaseAdmin';
import { PesapalPaymentRequest, Order } from '@/lib/types';
import { sendOrderNotifications } from '@/lib/email';

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

    // Create the order in Firebase first using Admin SDK
    const currentUserId = userId || 'guest';
    const currentUserEmail = userEmail || shippingAddress.email;
    
    console.log('Payment: Creating order with user info:', {
      providedUserId: userId,
      providedUserEmail: userEmail,
      shippingEmail: shippingAddress.email,
      finalUserId: currentUserId,
      finalUserEmail: currentUserEmail
    });
    
    const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'> = {
      userId: currentUserId,
      userEmail: currentUserEmail,
      items,
      totalItems: items.reduce((acc: number, item: any) => acc + item.quantity, 0),
      totalAmount,
      status: 'pending',
      shippingAddress,
      paymentMethod: 'pesapal',
      paymentStatus: 'pending'
    };

    console.log('Creating order with data:', orderData);
    let order;
    try {
      order = await createOrderServer(orderData);
      console.log('Order created successfully:', order);
    } catch (orderError) {
      console.error('Failed to create order:', orderError);
      return NextResponse.json(
        { 
          error: 'Failed to create order',
          details: orderError instanceof Error ? orderError.message : 'Unknown order creation error'
        },
        { status: 500 }
      );
    }

    // Send order confirmation emails (async, don't wait for completion)
    sendOrderNotifications(order, 'created').catch(error => {
      console.error('Failed to send order emails:', error);
    });

    // Prepare the Pesapal payment request
    const ipnId = process.env.PESAPAL_IPN_ID;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://goodstuff-five.vercel.app';
    
    console.log('IPN ID found:', ipnId);
    
    if (!ipnId) {
      console.error('PESAPAL_IPN_ID environment variable is not set. Payment will fail.');
      console.log('To fix this:');
      console.log('1. Register IPN URL: POST to /api/payments/pesapal/register-ipn');
      console.log('2. Add PESAPAL_IPN_ID to your .env.local file');
      return NextResponse.json(
        { 
          error: 'Payment configuration error: IPN ID missing',
          details: 'The payment service needs to be configured. Please register the IPN URL first.',
          fixInstructions: [
            'Call POST /api/payments/pesapal/register-ipn to get a new IPN ID',
            'Add the returned IPN ID to your environment variables as PESAPAL_IPN_ID'
          ]
        },
        { status: 500 }
      );
    }

    if (!process.env.PESAPAL_CONSUMER_KEY || !process.env.PESAPAL_CONSUMER_SECRET) {
      console.error('Pesapal credentials not configured');
      return NextResponse.json(
        { 
          error: 'Payment configuration error: API credentials missing',
          details: 'PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET must be configured',
          missingVars: [
            ...(!process.env.PESAPAL_CONSUMER_KEY ? ['PESAPAL_CONSUMER_KEY'] : []),
            ...(!process.env.PESAPAL_CONSUMER_SECRET ? ['PESAPAL_CONSUMER_SECRET'] : [])
          ]
        },
        { status: 500 }
      );
    }

    const paymentRequest: PesapalPaymentRequest = {
      amount: totalAmount,
      currency: 'KES',
      description: `Order ${order.id}`,
      callback_url: `${baseUrl}/api/payments/pesapal/callback`,
      notification_id: ipnId, // This should be the IPN ID, not the order ID
      merchant_reference: order.id,
      tracking_id: trackingId,
      billing_address: {
        email_address: shippingAddress.email || userEmail || '',
        phone_number: shippingAddress.phone,
        first_name: shippingAddress.name?.split(' ')[0] || '',
        last_name: shippingAddress.name?.split(' ').slice(1).join(' ') || '',
        country_code: 'KE'
      }
      // Remove ipn_id as it should not be a separate field
    };

    console.log('Submitting order to Pesapal:', paymentRequest);
    
    let pesapalResponse;
    try {
      pesapalResponse = await pesapalApi.submitOrder(paymentRequest);
      console.log('Pesapal response:', pesapalResponse);
    } catch (pesapalError) {
      console.error('Pesapal API call failed:', pesapalError);
      return NextResponse.json(
        { 
          error: 'Payment service unavailable',
          details: pesapalError instanceof Error ? pesapalError.message : 'Failed to connect to payment provider'
        },
        { status: 502 }
      );
    }

    // Check for Pesapal error response
    if (pesapalResponse.error) {
      console.error('Pesapal error:', pesapalResponse.error);
      
      // Provide more specific error messages
      let errorMessage = pesapalResponse.error.message;
      if (pesapalResponse.error.code === 'invalid_api_request_parameters' && 
          pesapalResponse.error.message.includes('Invalid IPN URL ID')) {
        errorMessage = 'Payment service configuration error. The IPN URL needs to be re-registered. Please contact support.';
        console.error('IPN ID is invalid or expired. Need to re-register IPN URL.');
        console.log('Current IPN ID:', ipnId);
        console.log('Expected IPN URL:', `${baseUrl}/api/payments/pesapal/ipn`);
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // Only update if we have a tracking ID
    if (pesapalResponse.order_tracking_id) {
      const updateData = {
        pesapalOrderTrackingId: pesapalResponse.order_tracking_id
      };
      console.log('Updating order:', order.id, 'with data:', updateData);
      await updateOrderServer(order.id, updateData);
      console.log('Order updated successfully');

      return NextResponse.json({
        orderId: order.id,
        redirectUrl: pesapalResponse.redirect_url
      });
    } else {
      // Handle unexpected response format
      console.error('Unexpected Pesapal response format:', pesapalResponse);
      return NextResponse.json(
        { error: 'Unexpected response from payment provider' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
} 