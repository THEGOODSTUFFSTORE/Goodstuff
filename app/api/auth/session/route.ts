import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { linkGuestOrdersToUser } from '@/lib/server/firebaseAdmin';

const COOKIE_NAME = 'session';

export async function POST(request: NextRequest) {
  try {
    // First verify we have the token
    const body = await request.json();
    if (!body.idToken) {
      console.error('No idToken provided in request body');
      return NextResponse.json(
        { error: 'No idToken provided' },
        { status: 400 }
      );
    }

    const { idToken } = body;

    try {
      // Verify the ID token first
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      console.log('Token verified successfully for user:', decodedToken.uid);
      
      // Get the user's custom claims
      const user = await adminAuth.getUser(decodedToken.uid);
      const customClaims = user.customClaims || {};
      
      // Link guest orders to this user account if they have an email
      if (user.email) {
        try {
          const linkedCount = await linkGuestOrdersToUser(user.email, decodedToken.uid);
          if (linkedCount > 0) {
            console.log(`Linked ${linkedCount} guest orders to user ${decodedToken.uid}`);
          }
        } catch (linkError) {
          console.error('Error linking guest orders (non-critical):', linkError);
          // Don't fail the session creation for this
        }
      }
      
      // Create a session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      const sessionCookie = await adminAuth.createSessionCookie(idToken, { 
        expiresIn,
      });

      if (!sessionCookie) {
        console.error('Failed to create session cookie');
        return NextResponse.json(
          { error: 'Failed to create session cookie' },
          { status: 500 }
        );
      }

      // Create response with cookie
      const response = NextResponse.json({ 
        status: 'success',
        isAdmin: customClaims.admin === true 
      }, { status: 200 });
      
      // Set cookie in the response
      response.cookies.set(COOKIE_NAME, sessionCookie, {
        maxAge: expiresIn / 1000, // Convert to seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

      return response;
    } catch (authError) {
      console.error('Token verification failed:', authError);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Create response and clear the cookie
    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.delete(COOKIE_NAME);
    return response;
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 