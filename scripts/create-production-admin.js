const admin = require('firebase-admin');

// Initialize Firebase Admin with environment variables (production-safe)
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function createAdminUser(email, password) {
  try {
    console.log('🔧 Creating admin user with environment variables...');
    console.log('📧 Email:', email);
    console.log('🎯 Project ID:', process.env.FIREBASE_PROJECT_ID);
    
    let user;
    
    try {
      // Try to get existing user
      user = await admin.auth().getUserByEmail(email);
      console.log('👤 User already exists:', user.uid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create the user
        user = await admin.auth().createUser({
          email,
          password,
          emailVerified: true
        });
        console.log('✅ User created:', user.uid);
      } else {
        throw error;
      }
    }

    // Set admin claim
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });

    console.log('👑 Admin privileges granted successfully!');
    console.log('🎉 User can now login to admin dashboard');
    
    // Verify the claim was set
    const userRecord = await admin.auth().getUser(user.uid);
    console.log('🔍 Verification - Custom claims:', userRecord.customClaims);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.error('🔧 Make sure these environment variables are set:');
    console.error('   - FIREBASE_PROJECT_ID');
    console.error('   - FIREBASE_CLIENT_EMAIL');
    console.error('   - FIREBASE_PRIVATE_KEY');
    process.exit(1);
  }
}

// Get email and password from command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('❌ Please provide email and password as arguments:');
  console.error('📝 Usage: node create-production-admin.js your@email.com yourpassword');
  process.exit(1);
}

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - FIREBASE_PROJECT_ID');
  console.error('   - FIREBASE_CLIENT_EMAIL');  
  console.error('   - FIREBASE_PRIVATE_KEY');
  console.error('');
  console.error('💡 Set these in your production environment or .env.local file');
  process.exit(1);
}

createAdminUser(email, password); 