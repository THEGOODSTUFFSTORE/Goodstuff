import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { getOrdersByUserServer, linkGuestOrdersToUser } from '@/lib/server/firebaseAdmin';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(session);
    const userId = decodedToken.uid;
    
    // Get user info to get email
    const user = await adminAuth.getUser(userId);
    
    // Try to link any guest orders first (in case they weren't linked during session creation)
    if (user.email) {
      try {
        const linkedCount = await linkGuestOrdersToUser(user.email, userId);
        if (linkedCount > 0) {
          console.log(`Linked ${linkedCount} additional guest orders to user ${userId}`);
        }
      } catch (linkError) {
        console.error('Error linking guest orders during order fetch:', linkError);
        // Continue with fetching orders even if linking fails
      }
    }
    
    // Fetch orders using server-side function
    const orders = await getOrdersByUserServer(userId, user.email || undefined);
    
    console.log(`Fetched ${orders.length} orders for user ${userId}`);
    
    return NextResponse.json({
      orders,
      totalOrders: orders.length,
      userId: userId,
      userEmail: user.email
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 