import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase only in the browser to avoid build-time initialization
let app: ReturnType<typeof initializeApp> | undefined;
if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
}

export const db = app ? getFirestore(app) : (undefined as any);
export const storage = app ? getStorage(app) : (undefined as any);
export const auth = app ? getAuth(app) : (undefined as any);

export default app as any;