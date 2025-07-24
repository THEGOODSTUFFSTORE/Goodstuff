import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, isAdminReady } from '@/lib/firebase-admin';
import { getOrdersByUserServer } from '@/lib/server/firebaseAdmin';

export async function GET(request: NextRequest) {
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
    
    // Get the user's email
    const user = await adminAuth.getUser(decodedToken.uid);
    const userEmail = user.email;
    
    // Get orders for this user (includes both user orders and linked guest orders)
    const orders = await getOrdersByUserServer(decodedToken.uid, userEmail);
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 