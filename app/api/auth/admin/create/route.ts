import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // First verify the request is authorized
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the session and check if the user is already an admin
    const decodedToken = await auth.verifySessionCookie(session);
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the email from the request body
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Get the user by email
    const user = await auth.getUserByEmail(email);
    
    // Set admin claim
    await auth.setCustomUserClaims(user.uid, {
      admin: true
    });

    return NextResponse.json({ 
      message: 'Admin privileges granted successfully',
      uid: user.uid 
    });
  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create admin' },
      { status: 500 }
    );
  }
} 