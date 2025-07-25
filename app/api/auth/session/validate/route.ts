import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, isAdminReady } from '@/lib/firebase-admin';

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
    if (!session) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(session);
    const userRecord = await adminAuth.getUser(decodedToken.uid);

    return NextResponse.json({
      valid: true,
      isAdmin: decodedToken.admin || false,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        admin: decodedToken.admin || false
      }
    });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
} 