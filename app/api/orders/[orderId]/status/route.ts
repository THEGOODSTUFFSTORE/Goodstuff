import { NextRequest, NextResponse } from 'next/server';
import { updateOrderServer } from '@/lib/server/firebaseAdmin';
import { sendOrderNotifications } from '@/lib/email';
import { adminDb } from '@/lib/firebase-admin';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 503 }
      );
    }

    // First verify we have the order ID
    const params = await context.params;
    const { orderId } = params;
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get the request body
    const body = await request.json();
    const { status, trackingNumber } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Get the current order to send emails
    const orderDoc = await adminDb.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderData = { id: orderDoc.id, ...orderDoc.data() };

    // Update the order status
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString()
    };

    // Add tracking number if provided
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    await updateOrderServer(orderId, updateData);

    // Send appropriate email notifications
    if (status === 'shipped') {
      sendOrderNotifications(orderData as any, 'shipped', trackingNumber).catch(error => {
        console.error('Failed to send shipping notification:', error);
      });
    } else if (status === 'delivered' || status === 'completed') {
      sendOrderNotifications(orderData as any, 'delivered').catch(error => {
        console.error('Failed to send delivery notification:', error);
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      orderId,
      status,
      ...(trackingNumber && { trackingNumber })
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
} 