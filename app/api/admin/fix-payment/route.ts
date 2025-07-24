import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { updateOrderServer } from '@/lib/server/firebaseAdmin';
import { pesapalApi } from '@/lib/pesapal';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(session);
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, action, pesapalTrackingId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    // Get the order
    const orderDoc = await adminDb.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = { id: orderDoc.id, ...orderDoc.data() };

    let updateData: any = {};

    if (action === 'mark_paid') {
      // Manually mark as paid
      updateData = {
        paymentStatus: 'paid',
        status: 'processing',
        updatedAt: new Date().toISOString(),
        adminNote: `Payment manually marked as paid by admin at ${new Date().toISOString()}`
      };
    } else if (action === 'check_pesapal' && pesapalTrackingId) {
      // Check with Pesapal
      try {
        const paymentStatus = await pesapalApi.getTransactionStatus(pesapalTrackingId);
        updateData = {
          pesapalPaymentStatus: paymentStatus,
          paymentStatus: paymentStatus.payment_status === 'COMPLETED' ? 'paid' : 
                        paymentStatus.payment_status === 'FAILED' ? 'failed' : 'pending',
          status: paymentStatus.payment_status === 'COMPLETED' ? 'processing' : 'pending',
          updatedAt: new Date().toISOString(),
          adminNote: `Payment status checked with Pesapal by admin at ${new Date().toISOString()}`
        };
      } catch (error) {
        return NextResponse.json({ 
          error: 'Failed to check Pesapal status', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
      }
    } else if (action === 'reset_to_pending') {
      // Reset to pending
      updateData = {
        paymentStatus: 'pending',
        status: 'pending',
        updatedAt: new Date().toISOString(),
        adminNote: `Payment reset to pending by admin at ${new Date().toISOString()}`
      };
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await updateOrderServer(orderId, updateData);

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} payment status updated`,
      orderId,
      action,
      updateData
    });

  } catch (error) {
    console.error('Error fixing payment status:', error);
    return NextResponse.json(
      { error: 'Failed to fix payment status', details: error },
      { status: 500 }
    );
  }
} 