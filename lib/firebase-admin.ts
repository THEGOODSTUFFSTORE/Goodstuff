// This is a server-side only module
import * as admin from 'firebase-admin';
import serviceAccount from '../firebase-service-account.json.json';

// Ensure we only initialize the admin SDK once
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
    console.log('Firebase Admin initialized successfully');
    
    // Verify the service account has necessary permissions
    const db = admin.firestore();
    db.collection('orders').limit(1).get()
      .then(() => {
        console.log('Firebase Admin SDK has required Firestore permissions');
      })
      .catch((error) => {
        console.error('Firebase Admin SDK permission check failed:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          code: error instanceof Error && 'code' in error ? (error as any).code : undefined
        });
      });
  } catch (error) {
    console.error('Firebase Admin initialization error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
      serviceAccountEmail: serviceAccount.client_email
    });
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

// Export the admin instance for advanced usage if needed
export { admin }; 