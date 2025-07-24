import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { linkGuestOrdersToUser } from '@/lib/server/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(session);
    const userId = decodedToken.uid;
    
    // Get user info to get email
    const user = await adminAuth.getUser(userId);
    
    if (!user.email) {
      return NextResponse.json({ error: 'User has no email address' }, { status: 400 });
    }
    
    // Link guest orders to user account
    const linkedCount = await linkGuestOrdersToUser(user.email, userId);
    
    console.log(`Manually linked ${linkedCount} guest orders to user ${userId}`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully linked ${linkedCount} orders to your account`,
      linkedCount,
      userEmail: user.email
    });
  } catch (error) {
    console.error('Error manually linking guest orders:', error);
    return NextResponse.json(
      { error: 'Failed to link guest orders' },
      { status: 500 }
    );
  }
} 