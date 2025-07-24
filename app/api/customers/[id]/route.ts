import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { getOrdersByUserServer, linkGuestOrdersToUser } from '@/lib/server/firebaseAdmin';

export async function GET(
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

    const params = await context.params;
    const { id: customerId } = params;

    // Get customer info
    const customer = await adminAuth.getUser(customerId);
    
    // Get orders for this customer
    const orders = await getOrdersByUserServer(customerId, customer.email || undefined);

    return NextResponse.json({
      customer: {
        id: customer.uid,
        email: customer.email,
        name: customer.displayName,
        phone: customer.phoneNumber,
        joinDate: customer.metadata.creationTime,
        status: customer.disabled ? 'inactive' : 'active'
      },
      orders
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer orders' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const params = await context.params;
    const { id: customerId } = params;
    const body = await request.json();
    const { action } = body;

    if (action === 'link_guest_orders') {
      // Get customer info
      const customer = await adminAuth.getUser(customerId);
      
      if (!customer.email) {
        return NextResponse.json({ error: 'Customer has no email' }, { status: 400 });
      }

      // Link guest orders
      const linkedCount = await linkGuestOrdersToUser(customer.email, customerId);

      return NextResponse.json({
        success: true,
        message: `Linked ${linkedCount} guest orders to customer`,
        linkedCount
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing customer action:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
} 