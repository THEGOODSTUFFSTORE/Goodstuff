import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, isAdminReady } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    if (!isAdminReady() || !adminAuth || !adminDb) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(session);
    const user = await adminAuth.getUser(decoded.uid);
    const isSuperAdmin = (user.customClaims as any)?.superadmin === true;
    if (!isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const snapshot = await adminDb
      .collection('admin_sessions')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    const sessions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching admin sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

