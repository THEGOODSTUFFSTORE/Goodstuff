import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, isAdminReady } from '@/lib/firebase-admin';
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
    // Check if Firebase Admin is ready
    if (!isAdminReady() || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized. Please check server configuration.' },
        { status: 503 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';

    // Verify admin session
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(session);
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all users
    let allUsers: any[] = [];
    let pageToken: string | undefined;
    
    do {
      const listUsersResult = await adminAuth.listUsers(1000, pageToken);
      allUsers = allUsers.concat(listUsersResult.users);
      pageToken = listUsersResult.pageToken;
    } while (pageToken);

    // Filter users if search term provided
    let filteredUsers = allUsers;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = allUsers.filter(user => 
        user.email?.toLowerCase().includes(searchLower) ||
        user.displayName?.toLowerCase().includes(searchLower) ||
        user.uid.toLowerCase().includes(searchLower)
      );
    }

    // Paginate results
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    // Format user data
    const customers = paginatedUsers.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      disabled: user.disabled,
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
      customClaims: user.customClaims || {},
      isAdmin: user.customClaims?.admin === true
    }));

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
        hasNext: startIndex + limit < filteredUsers.length,
        hasPrev: page > 1
      },
      search
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
} 