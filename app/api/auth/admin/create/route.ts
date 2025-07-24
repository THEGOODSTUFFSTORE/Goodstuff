import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, isAdminReady } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is ready
    if (!isAdminReady() || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized. Please check server configuration.' },
        { status: 503 }
      );
    }

    // First verify the request is authorized
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the session and check if the user is already an admin
    const decodedToken = await adminAuth.verifySessionCookie(session);
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the email from the request body
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let user;
    let userCreated = false;
    
    try {
      // Try to get existing user by email
      user = await adminAuth.getUserByEmail(email);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        // User doesn't exist, create them
        try {
          user = await adminAuth.createUser({
            email: email,
            emailVerified: false,
            password: Math.random().toString(36).slice(-12) + 'A1!', // Temporary password
          });
          userCreated = true;
        } catch (createError: any) {
          return NextResponse.json(
            { error: `Failed to create user: ${createError.message}` },
            { status: 500 }
          );
        }
      } else {
        // Some other error occurred
        return NextResponse.json(
          { error: `Failed to find user: ${error.message}` },
          { status: 500 }
        );
      }
    }
    
    // Set admin claim
    await adminAuth.setCustomUserClaims(user.uid, {
      admin: true
    });

    return NextResponse.json({ 
      message: userCreated 
        ? 'Admin user created and privileges granted successfully. User will need to reset their password.'
        : 'Admin privileges granted successfully',
      uid: user.uid,
      email: user.email,
      created: userCreated
    });
  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create admin' },
      { status: 500 }
    );
  }
} 