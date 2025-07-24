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
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });
    }

    return NextResponse.json({
      searchParams: { orderId, userId, userEmail },
      totalFound: results.length,
      orders: results
    });

  } catch (error) {
    console.error('Debug order error:', error);
    return NextResponse.json(
      { error: 'Failed to debug orders', details: error },
      { status: 500 }
    );
  }
} 