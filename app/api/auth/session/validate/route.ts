import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(session);
    const userRecord = await adminAuth.getUser(decodedToken.uid);
    
    // Check for admin custom claim
    const customClaims = userRecord.customClaims || {};
    const isAdmin = customClaims.admin === true;

    if (!isAdmin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    return NextResponse.json({
      uid: decodedToken.uid,
      isAdmin: true
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
} 