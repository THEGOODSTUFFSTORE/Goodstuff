import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, isAdminReady } from '@/lib/firebase-admin';
import { linkGuestOrdersToUser } from '@/lib/server/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is ready
    if (!isAdminReady() || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized. Please check server configuration.' },
        { status: 503 }
      );
    }

    const { userId } = await request.json();
    const decodedToken = await adminAuth.verifySessionCookie(request.cookies.get('session')?.value || '');
    
    // Get the user's email
    const user = await adminAuth.getUser(userId);
    const userEmail = user.email;
    
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }
    
    // Link guest orders to the user
    const linkedCount = await linkGuestOrdersToUser(userEmail, userId);
    
    return NextResponse.json({ 
      success: true, 
      linkedCount,
      message: `${linkedCount} guest orders linked to user account`
    });
  } catch (error) {
    console.error('Error linking guest orders:', error);
    return NextResponse.json(
      { error: 'Failed to link guest orders' },
      { status: 500 }
    );
  }
} 