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

    const sessionCookie = request.cookies.get('session')?.value || '';
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);

    // Get the user's email from auth
    const user = await adminAuth.getUser(decodedToken.uid);
    const userEmail = user.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }
    
    // Link guest orders to the session user
    const linkedCount = await linkGuestOrdersToUser(userEmail, decodedToken.uid);
    
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