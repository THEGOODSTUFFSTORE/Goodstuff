import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, isAdminReady } from '@/lib/firebase-admin';
import { linkGuestOrdersToUser } from '@/lib/server/firebaseAdmin';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Check if Firebase Admin is ready
    if (!isAdminReady() || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized. Please check server configuration.' },
        { status: 503 }
      );
    }

    const { id: customerId } = params;

    // Verify admin session
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(session);
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get customer details
    const customer = await adminAuth.getUser(customerId);

    const customerData = {
      uid: customer.uid,
      email: customer.email,
      displayName: customer.displayName,
      emailVerified: customer.emailVerified,
      disabled: customer.disabled,
      creationTime: customer.metadata.creationTime,
      lastSignInTime: customer.metadata.lastSignInTime,
      customClaims: customer.customClaims || {},
      isAdmin: customer.customClaims?.admin === true,
      phoneNumber: customer.phoneNumber,
      photoURL: customer.photoURL
    };

    return NextResponse.json({ customer: customerData });

  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Check if Firebase Admin is ready
    if (!isAdminReady() || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized. Please check server configuration.' },
        { status: 503 }
      );
    }

    const { id: customerId } = params;

    // Verify admin session
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

         const decodedToken = await adminAuth!.verifySessionCookie(session);
     if (!decodedToken.admin) {
       return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
     }

     const updateData = await request.json();

     // Get current customer to preserve existing data
     const customer = await adminAuth!.getUser(customerId);
     
     // Prepare update object (only include fields that are allowed to be updated)
     const allowedUpdates: any = {};
     
     if (updateData.email !== undefined) allowedUpdates.email = updateData.email;
     if (updateData.displayName !== undefined) allowedUpdates.displayName = updateData.displayName;
     if (updateData.disabled !== undefined) allowedUpdates.disabled = updateData.disabled;
     if (updateData.emailVerified !== undefined) allowedUpdates.emailVerified = updateData.emailVerified;
     if (updateData.phoneNumber !== undefined) allowedUpdates.phoneNumber = updateData.phoneNumber;
     if (updateData.photoURL !== undefined) allowedUpdates.photoURL = updateData.photoURL;

     // Update user
     const updatedUser = await adminAuth!.updateUser(customerId, allowedUpdates);

     // Handle custom claims separately if provided
     if (updateData.customClaims !== undefined) {
       await adminAuth!.setCustomUserClaims(customerId, updateData.customClaims);
     }

    return NextResponse.json({
      message: 'Customer updated successfully',
      customer: {
        uid: updatedUser.uid,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        emailVerified: updatedUser.emailVerified,
        disabled: updatedUser.disabled,
        customClaims: updateData.customClaims || customer.customClaims || {}
      }
    });

  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Check if Firebase Admin is ready
    if (!isAdminReady() || !adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin is not initialized. Please check server configuration.' },
        { status: 503 }
      );
    }

    const { id: customerId } = params;

    // Verify admin session
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifySessionCookie(session);
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

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