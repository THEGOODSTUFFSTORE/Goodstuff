const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function createAdminUser(email: string, password: string) {
  try {
    // Create the user
    const user = await admin.auth().createUser({
      email,
      password,
      emailVerified: true
    });

    // Set admin claim
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });

    console.log(`Successfully created admin user with email: ${email}`);
    console.log(`User UID: ${user.uid}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('Please provide email and password as arguments:');
  console.error('npm run create-admin your@email.com yourpassword');
  process.exit(1);
}

createAdminUser(email, password); 