import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, isAdminReady } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    console.log('Admin sessions API called');
    
    if (!isAdminReady() || !adminAuth || !adminDb) {
      console.log('Firebase Admin not ready');
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const session = request.cookies.get('session')?.value;
    if (!session) {
      console.log('No session cookie found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(session);
    const user = await adminAuth.getUser(decoded.uid);
    const isAdmin = (user.customClaims as any)?.admin === true;
    const isSuperAdmin = (user.customClaims as any)?.superadmin === true;
    console.log('User claims:', user.customClaims, 'isAdmin:', isAdmin, 'isSuperAdmin:', isSuperAdmin);
    
    if (!isSuperAdmin) {
      console.log('User is not super admin - sessions access restricted');
      return NextResponse.json({ error: 'Forbidden - Super admin access required' }, { status: 403 });
    }

    console.log('Fetching admin sessions from collection...');
    const snapshot = await adminDb
      .collection('admin_sessions')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    const sessions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${sessions.length} admin sessions`);
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching admin sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

