import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');

    if (!orderId && !userId && !userEmail) {
      return NextResponse.json(
        { error: 'Provide orderId, userId, or userEmail parameter' },
        { status: 400 }
      );
    }

    let results = [];
    let guestOrders = [];
    let linkedOrders = [];

    if (orderId) {
      // Get specific order
      const orderDoc = await adminDb.collection('orders').doc(orderId).get();
      if (orderDoc.exists) {
        results.push({
          id: orderDoc.id,
          ...orderDoc.data()
        });
      }
    }

    if (userId) {
      // Get orders by user ID
      const userOrdersSnapshot = await adminDb.collection('orders')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      userOrdersSnapshot.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });
    }

    if (userEmail) {
      // Get orders by user email
      const emailOrdersSnapshot = await adminDb.collection('orders')
        .where('userEmail', '==', userEmail)
        .orderBy('createdAt', 'desc')
        .get();
      
      emailOrdersSnapshot.forEach(doc => {
        const orderData = {
          id: doc.id,
          ...doc.data()
        } as any;
        results.push(orderData);
        
        // Categorize orders
        if (orderData.userId === 'guest') {
          guestOrders.push(orderData);
        } else {
          linkedOrders.push(orderData);
        }
      });
    }

    // Remove duplicates
    const uniqueResults = results.filter((order, index, self) => 
      index === self.findIndex(o => o.id === order.id)
    );

    return NextResponse.json({
      searchParams: { orderId, userId, userEmail },
      totalFound: uniqueResults.length,
      orders: uniqueResults,
      analysis: {
        guestOrdersCount: guestOrders.length,
        linkedOrdersCount: linkedOrders.length,
                 paymentStatusBreakdown: uniqueResults.reduce((acc: any, order: any) => {
           const status = order.paymentStatus || 'unknown';
           acc[status] = (acc[status] || 0) + 1;
           return acc;
         }, {}),
         orderStatusBreakdown: uniqueResults.reduce((acc: any, order: any) => {
           const status = order.status || 'unknown';
           acc[status] = (acc[status] || 0) + 1;
           return acc;
         }, {}),
                 hasTrackingIds: uniqueResults.filter((order: any) => order.pesapalOrderTrackingId).length,
         callbackProcessed: uniqueResults.filter((order: any) => order.callbackProcessedAt).length
      }
    });

  } catch (error) {
    console.error('Debug order error:', error);
    return NextResponse.json(
      { error: 'Failed to debug orders', details: error },
      { status: 500 }
    );
  }
} 