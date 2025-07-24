import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, isAdminReady } from '@/lib/firebase-admin';
import { updateOrderServer, reduceProductInventory } from '@/lib/server/firebaseAdmin';
import { pesapalApi } from '@/lib/pesapal';

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is ready
    if (!isAdminReady() || !adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized. Please check server configuration.' },
        { status: 503 }
      );
    }

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

    const orderData = { id: orderDoc.id, ...orderDoc.data() } as any;

    let updateData: any = {};
    let debugInfo: any = {};

    if (action === 'mark_paid') {
      // Manually mark as paid
      updateData = {
        paymentStatus: 'paid',
        status: 'processing',
        updatedAt: new Date().toISOString(),
        adminNote: `Payment manually marked as paid by admin at ${new Date().toISOString()}`
      };
      
      // Reduce inventory if not already reduced
      if (!orderData.inventoryReduced) {
        try {
          console.log('Admin: Reducing inventory for manually marked payment');
          await reduceProductInventory(orderData.items);
          updateData.inventoryReduced = true;
          updateData.inventoryReducedAt = new Date().toISOString();
          console.log('Admin: Inventory reduction completed');
        } catch (inventoryError) {
          console.error('Admin: Failed to reduce inventory:', inventoryError);
          // Continue without failing the payment update
        }
      }
    } else if (action === 'check_pesapal' && pesapalTrackingId) {
      // Check with Pesapal
      try {
        const paymentStatus = await pesapalApi.getTransactionStatus(pesapalTrackingId);
        const isCompleted = (paymentStatus.payment_status_description === 'Completed' || paymentStatus.payment_status === 'COMPLETED');
        
        updateData = {
          pesapalPaymentStatus: paymentStatus,
          paymentStatus: isCompleted ? 'paid' : 
                        (paymentStatus.payment_status_description === 'Failed' || paymentStatus.payment_status === 'FAILED') ? 'failed' : 'pending',
          status: isCompleted ? 'processing' : 'pending',
          updatedAt: new Date().toISOString(),
          adminNote: `Payment status checked with Pesapal by admin at ${new Date().toISOString()}`
        };
        debugInfo.pesapalResponse = paymentStatus;
        
        // Reduce inventory if payment is completed and not already reduced
        if (isCompleted && !orderData.inventoryReduced) {
          try {
            console.log('Admin: Reducing inventory for Pesapal confirmed payment');
            await reduceProductInventory(orderData.items);
            updateData.inventoryReduced = true;
            updateData.inventoryReducedAt = new Date().toISOString();
            console.log('Admin: Inventory reduction completed');
          } catch (inventoryError) {
            console.error('Admin: Failed to reduce inventory:', inventoryError);
            // Continue without failing the payment update
          }
        }
      } catch (error) {
        return NextResponse.json({ 
          error: 'Failed to check Pesapal status', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
      }
    } else if (action === 'reset_to_pending') {
      // Reset to pending - NOTE: This does NOT restore inventory
      updateData = {
        paymentStatus: 'pending',
        status: 'pending',
        updatedAt: new Date().toISOString(),
        adminNote: `Payment reset to pending by admin at ${new Date().toISOString()} - WARNING: Inventory NOT restored`
      };
    } else if (action === 'force_sync') {
      // Force sync with Pesapal using the stored tracking ID
      const storedTrackingId = orderData.pesapalOrderTrackingId;
      if (!storedTrackingId) {
        return NextResponse.json({ 
          error: 'No Pesapal tracking ID found for this order' 
        }, { status: 400 });
      }
      
      try {
        console.log('Force sync: Checking Pesapal status for tracking ID:', storedTrackingId);
        const paymentStatus = await pesapalApi.getTransactionStatus(storedTrackingId);
        console.log('Force sync: Pesapal response:', paymentStatus);
        
        const isCompleted = (paymentStatus.payment_status_description === 'Completed' || paymentStatus.payment_status === 'COMPLETED');
        
        updateData = {
          pesapalPaymentStatus: paymentStatus,
          paymentStatus: isCompleted ? 'paid' : 
                        (paymentStatus.payment_status_description === 'Failed' || paymentStatus.payment_status === 'FAILED') ? 'failed' : 'pending',
          status: isCompleted ? 'processing' : 'pending',
          updatedAt: new Date().toISOString(),
          adminNote: `Payment status force synced with Pesapal by admin at ${new Date().toISOString()}`,
          lastSyncAt: new Date().toISOString()
        };
        
        // Reduce inventory if payment is completed and not already reduced
        if (isCompleted && !orderData.inventoryReduced) {
          try {
            console.log('Force sync: Reducing inventory for synced completed payment');
            await reduceProductInventory(orderData.items);
            updateData.inventoryReduced = true;
            updateData.inventoryReducedAt = new Date().toISOString();
            console.log('Force sync: Inventory reduction completed');
          } catch (inventoryError) {
            console.error('Force sync: Failed to reduce inventory:', inventoryError);
            // Continue without failing the payment update
          }
        }
        
        console.log('Force sync: About to update order with data:', updateData);
        debugInfo.pesapalResponse = paymentStatus;
        debugInfo.trackingId = storedTrackingId;
        debugInfo.updateData = updateData;
      } catch (error) {
        console.error('Force sync: Error getting status from Pesapal:', error);
        return NextResponse.json({ 
          error: 'Failed to sync with Pesapal', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
      }
    } else if (action === 'debug_info') {
      // Return debug information without making changes
      return NextResponse.json({
        order: orderData,
        debugInfo: {
          hasTrackingId: !!orderData.pesapalOrderTrackingId,
          trackingId: orderData.pesapalOrderTrackingId,
          currentPaymentStatus: orderData.paymentStatus,
          currentStatus: orderData.status,
          lastUpdated: orderData.updatedAt,
          callbackProcessed: !!orderData.callbackProcessedAt,
          callbackTime: orderData.callbackProcessedAt,
          adminNotes: orderData.adminNote
        }
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await updateOrderServer(orderId, updateData);

    // Verify the update worked by fetching the order again
    const verifyDoc = await adminDb.collection('orders').doc(orderId).get();
    const verifiedData = verifyDoc.exists ? verifyDoc.data() : null;
    
    console.log('Payment fix: Verified order data after update:', {
      id: orderId,
      paymentStatus: verifiedData?.paymentStatus,
      status: verifiedData?.status,
      lastSyncAt: verifiedData?.lastSyncAt,
      adminNote: verifiedData?.adminNote
    });

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} payment status updated`,
      orderId,
      action,
      updateData,
      debugInfo,
      verifiedData: {
        paymentStatus: verifiedData?.paymentStatus,
        status: verifiedData?.status,
        lastSyncAt: verifiedData?.lastSyncAt
      }
    });

  } catch (error) {
    console.error('Error in fix payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment fix' },
      { status: 500 }
    );
  }
} 