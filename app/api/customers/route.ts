import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Order } from '@/lib/types';

// Helper function to get orders for a user
async function getUserOrders(userId: string) {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

// GET /api/customers
export async function GET(request: NextRequest) {
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

    // Get all users
    const { users } = await adminAuth.listUsers();
    
    // Get orders for each user
    const customersWithOrders = await Promise.all(
      users.map(async (user) => {
        const orders = await getUserOrders(user.uid);
        const totalSpent = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
        
        return {
          id: user.uid,
          name: user.displayName || 'N/A',
          email: user.email || 'N/A',
          phone: user.phoneNumber || 'N/A',
          joinDate: user.metadata.creationTime,
          totalOrders: orders.length,
          totalSpent: totalSpent,
          lastOrder: orders[0]?.createdAt || null,
          status: user.disabled ? 'inactive' : 'active'
        };
      })
    );

    return NextResponse.json(customersWithOrders);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
} 