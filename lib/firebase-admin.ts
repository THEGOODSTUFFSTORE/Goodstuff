// This is a server-side only module
import * as admin from 'firebase-admin';

// Function to get service account from environment variables or JSON file
function getServiceAccountConfig() {
  // First try environment variables (production)
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    } as admin.ServiceAccount;
  }
  
  // For development only, try to load from JSON file
  if (process.env.NODE_ENV === 'development') {
    try {
      // Use dynamic require to avoid webpack bundling issues
      const path = require('path');
      const fs = require('fs');
      const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');
      
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
        return JSON.parse(serviceAccountData);
      }
    } catch (error) {
      console.warn('Firebase service account file not found in development');
    }
  }
  
  // If neither works, throw error
  throw new Error(
    'Firebase service account configuration not found. ' +
    'Please set FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID environment variables, ' +
    'or ensure firebase-service-account.json exists in the root directory for development.'
  );
}

// Ensure we only initialize the admin SDK once
if (!admin.apps.length) {
  try {
    const serviceAccount = getServiceAccountConfig();
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
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
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined
    });
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

// Export the admin instance for advanced usage if needed
export { admin }; 