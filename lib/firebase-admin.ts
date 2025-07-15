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
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

// Export the admin instance for advanced usage if needed
export { admin }; 