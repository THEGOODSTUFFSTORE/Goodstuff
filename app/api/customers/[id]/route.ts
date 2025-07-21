import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(session);
    const adminUser = await adminAuth.getUser(decodedToken.uid);
    if (!adminUser.customClaims?.admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { disabled } = await request.json();
    const params = await context.params;
    const userId = params.id;

    // Update user status
    await adminAuth.updateUser(userId, { disabled });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
} 