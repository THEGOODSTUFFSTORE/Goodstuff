const admin = require('firebase-admin');

// Initialize Firebase Admin with your service account
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function createSuperAdmin(email) {
  try {
    console.log('🚀 Starting Super Admin creation process...');
    console.log('📧 Target email:', email);
    console.log('🎯 Project ID:', process.env.FIREBASE_PROJECT_ID || 'From service account');
    console.log('');
    
    // Get user by email
    console.log('🔍 Looking for user in Firebase...');
    const user = await admin.auth().getUserByEmail(email);
    console.log(`✅ Found user: ${user.uid}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`✅ Email Verified: ${user.emailVerified}`);
    console.log(`🔍 Current custom claims:`, user.customClaims || 'None');
    console.log('');
    
    // Check if already super admin
    if (user.customClaims && user.customClaims.superadmin === true) {
      console.log('👑 User is already a Super Admin!');
      console.log('🔍 Current claims:', user.customClaims);
      process.exit(0);
    }
    
    // Set super admin claims
    console.log('🔧 Setting Super Admin claims...');
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
      superadmin: true
    });
    
    console.log('🎉 Successfully promoted user to Super Admin!');
    console.log('');
    
    // Verify the claims were set
    console.log('🔍 Verifying claims were set correctly...');
    const updatedUser = await admin.auth().getUser(user.uid);
    console.log(`✅ New custom claims:`, updatedUser.customClaims);
    console.log('');
    
    // Success summary
    console.log('🎯 SUPER ADMIN CREATION COMPLETE!');
    console.log('=====================================');
    console.log(`📧 Email: ${email}`);
    console.log(`🆔 UID: ${user.uid}`);
    console.log(`👑 Role: Super Admin`);
    console.log(`🔐 Claims: admin=true, superadmin=true`);
    console.log('');
    
    console.log('📋 Next Steps:');
    console.log('1. Log out of your admin dashboard (if currently logged in)');
    console.log('2. Log back in with the same email');
    console.log('3. Go to Settings → Users tab');
    console.log('4. You should now see "Create Admin User" option');
    console.log('5. Test by trying to create another admin user');
    console.log('');
    
    console.log('🔒 Security Note:');
    console.log('- Only Super Admins can create other admin users');
    console.log('- Keep your super admin credentials secure');
    console.log('- Monitor admin creation activity');
    
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ ERROR: Super Admin creation failed!');
    console.error('=====================================');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code || 'Unknown');
    console.error('');
    
    // Provide specific help based on error type
    if (error.code === 'auth/user-not-found') {
      console.error('🔍 TROUBLESHOOTING: User not found');
      console.error('   - Make sure the email address is exactly correct');
      console.error('   - The user must have logged in to your app at least once');
      console.error('   - Check for typos in the email address');
    } else if (error.code === 'auth/invalid-email') {
      console.error('🔍 TROUBLESHOOTING: Invalid email format');
      console.error('   - Check the email format (e.g., user@domain.com)');
      console.error('   - Make sure there are no extra spaces');
    } else if (error.code === 'auth/insufficient-permission') {
      console.error('🔍 TROUBLESHOOTING: Insufficient permissions');
      console.error('   - Your service account needs Firebase Admin SDK permissions');
      console.error('   - Make sure you are the project owner or have admin access');
      console.error('   - Check your firebase-service-account.json file');
    } else if (error.message.includes('firebase-service-account.json')) {
      console.error('🔍 TROUBLESHOOTING: Missing service account file');
      console.error('   - Download firebase-service-account.json from Firebase Console');
      console.error('   - Go to Project Settings → Service Accounts → Generate New Private Key');
      console.error('   - Save the file in your project root directory');
    } else {
      console.error('🔍 TROUBLESHOOTING: General error');
      console.error('   - Check your internet connection');
      console.error('   - Verify your Firebase project is active');
      console.error('   - Try again in a few minutes');
    }
    
    console.error('');
    console.error('📞 Need help? Check the error details above and try again.');
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ ERROR: Email address is required!');
  console.error('');
  console.error('📝 USAGE:');
  console.error('   node scripts/create-super-admin.js your@email.com');
  console.error('');
  console.error('📋 EXAMPLES:');
  console.error('   node scripts/create-super-admin.js admin@yourstore.com');
  console.error('   node scripts/create-super-admin.js owner@company.com');
  console.error('');
  console.error('🔍 Make sure:');
  console.error('   - You are in the correct project directory');
  console.error('   - firebase-service-account.json exists');
  console.error('   - The email address is correct');
  console.error('');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('❌ ERROR: Invalid email format!');
  console.error('📧 Please provide a valid email address (e.g., user@domain.com)');
  process.exit(1);
}

// Start the process
createSuperAdmin(email);
