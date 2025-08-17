import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
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

    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json({ error: 'ID token required' }, { status: 400 });
    }

    // Verify the ID token first
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Get user data with custom claims
    const user = await adminAuth.getUser(decodedToken.uid);
    
    // Create session cookie (expires in 5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    
    // Get custom claims (including admin claim)
    const customClaims = user.customClaims || {};
    
    // Add claims to the session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn
    });

    const response = NextResponse.json({
      success: true,
      isAdmin: customClaims.admin || false,
      isSuperAdmin: customClaims.superadmin || false,
      user: {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        ...customClaims
      }
    });

    // Set the session cookie with proper security flags
    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    // Track admin login sessions (only when enabled by settings)
    try {
      if ((customClaims.admin || customClaims.superadmin) && (process.env.TRACK_ADMIN_LOGINS === 'true')) {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
        const ua = request.headers.get('user-agent') || 'unknown';
        const { adminDb } = await import('@/lib/firebase-admin');
        if (adminDb) {
          await adminDb.collection('admin_sessions').add({
            uid: user.uid,
            email: user.email,
            createdAt: new Date().toISOString(),
            ip,
            userAgent: ua,
            type: 'login'
          });
        }
      }
    } catch (e) {
      console.warn('Failed to log admin session', e);
    }

    return response;
  } catch (error: any) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  try {
    // Create response and clear the cookie
    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.delete('session');
    // Best-effort logout tracking is handled client-side by clearing session; server log optional
    return response;
  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 