import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // Check if Firebase Admin is initialized
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      );
    }
    
    // Check if user has superadmin role via custom claims or fallback doc role
    const user = await getAuth().getUser(decodedToken.uid);
    const isSuperAdmin = (user.customClaims as any)?.superadmin === true;
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const hasLegacyAdminDoc = userDoc.exists && userDoc.data()?.role === 'admin';
    if (!isSuperAdmin && !hasLegacyAdminDoc) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { settings } = await req.json();
    
    if (!settings) {
      return NextResponse.json(
        { error: 'Settings data is required' },
        { status: 400 }
      );
    }

    // Save settings to Firestore
    const settingsDoc = adminDb.collection('admin_settings').doc('global');
    await settingsDoc.set({
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: decodedToken.uid
    }, { merge: true });

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully'
    });

  } catch (error) {
    console.error('Error saving admin settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // Check if Firebase Admin is initialized
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      );
    }
    
    // Check if user has superadmin role via custom claims or fallback doc role
    const user = await getAuth().getUser(decodedToken.uid);
    const isSuperAdmin = (user.customClaims as any)?.superadmin === true;
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const hasLegacyAdminDoc = userDoc.exists && userDoc.data()?.role === 'admin';
    if (!isSuperAdmin && !hasLegacyAdminDoc) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get settings from Firestore
    const settingsDoc = await adminDb.collection('admin_settings').doc('global').get();
    
    if (!settingsDoc.exists) {
      // Return default settings if none exist
      return NextResponse.json({
        settings: {
          orders: {
            minimumOrderAmount: 0,
            shippingFee: 300,
            freeShippingThreshold: 5000,
            allowPartialFulfillment: true,
            autoConfirmOrders: false,
            orderPrefix: 'GS',
          },
          notifications: {
            lowStockAlerts: true,
            newOrderNotifications: true,
            orderStatusUpdates: true,
            customerReviewNotifications: false,
            emailNotifications: true,
            pushNotifications: false,
          },
          users: {
            allowUserRegistration: true,
            requireEmailVerification: true,
            passwordMinLength: 8,
            sessionTimeout: 24,
            maxLoginAttempts: 5,
          },
          security: {
            twoFactorAuth: false,
            requireStrongPasswords: true,
            ipWhitelist: '',
            adminActivityLogs: true,
            dataBackup: true,
            backupFrequency: 'daily',
            trackAdminLogins: true,
          }
        }
      });
    }

    const settingsData = settingsDoc.data();
    return NextResponse.json({
      settings: settingsData
    });

  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
} 