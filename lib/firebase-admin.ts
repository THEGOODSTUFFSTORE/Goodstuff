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
  
  // Fallback to local JSON when running outside managed hosts (e.g., local dev or self-hosted), regardless of NODE_ENV
  try {
    // Avoid reading local files on Vercel/managed build environments
    if (!process.env.VERCEL) {
      const path = require('path');
      const fs = require('fs');
      const serviceAccountPath = path.join(process.cwd(), 'firebase-service-account.json');
      
      if (fs.existsSync(serviceAccountPath)) {
        const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
        return JSON.parse(serviceAccountData);
      }
    }
  } catch (error) {
    console.warn('Firebase service account file not found or unreadable');
  }
  
  // If neither works, throw error
  throw new Error(
    'Firebase service account configuration not found. ' +
    'Please set FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and FIREBASE_PROJECT_ID environment variables, ' +
    'or ensure firebase-service-account.json exists in the root directory.'
  );
}

// Only treat Next.js build phase explicitly as build-time
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

// Consider already-initialized apps (e.g., hot reload or other modules)
let adminInitialized = admin.apps.length > 0;

// Initialize Firebase Admin only if not in build time and if we have the required config
if (!isBuildTime && !adminInitialized) {
  try {
    const serviceAccount = getServiceAccountConfig();
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    adminInitialized = true;
    console.log('Firebase Admin initialized successfully');
    
    // Verify the service account has necessary permissions (non-blocking)
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

// Safe exports that handle uninitialized admin
export const adminAuth = admin.apps.length ? admin.auth() : null;
export const adminDb = admin.apps.length ? admin.firestore() : null;

// Export the admin instance for advanced usage if needed
export { admin };

// Helper function to check if admin is ready
export const isAdminReady = () => admin.apps.length > 0; 