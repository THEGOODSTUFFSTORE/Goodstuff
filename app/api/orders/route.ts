import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, isAdminReady } from '@/lib/firebase-admin';
import { createOrderServer } from '@/lib/server/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is ready
    if (!isAdminReady() || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized. Please check server configuration.' },
        { status: 503 }
      );
    }

    const session = request.cookies.get('session')?.value;
    const decodedToken = await adminAuth.verifySessionCookie(session || '');
    
    const orderData = await request.json();
    const order = await createOrderServer({
      ...orderData,
      userId: decodedToken.uid
    });
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check if Firebase Admin is ready
    if (!isAdminReady() || !adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized. Please check server configuration.' },
        { status: 503 }
      );
    }

    // Check if user is authenticated and is admin
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(session);
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all orders
    const ordersSnapshot = await adminDb.collection('orders')
      .orderBy('createdAt', 'desc')
      .get();

    const orders = ordersSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 