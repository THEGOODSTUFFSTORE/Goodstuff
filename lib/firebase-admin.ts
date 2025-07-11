import { initializeApp, getApps, cert } from 'firebase-admin/app';

export const initAdmin = () => {
  const apps = getApps();
  
  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  }
}; 