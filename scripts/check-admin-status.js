const admin = require('firebase-admin');

// Initialize Firebase Admin with your service account
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

async function checkAdminStatus(email) {
  try {
    console.log('🔍 Checking admin status for:', email);
    console.log('');
    
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    console.log('✅ User found!');
    console.log('📧 Email:', user.email);
    console.log('🆔 UID:', user.uid);
    console.log('✅ Email Verified:', user.emailVerified);
    console.log('📅 Created:', user.metadata.creationTime);
    console.log('🔄 Last Sign In:', user.metadata.lastSignInTime);
    console.log('');
    
    // Check custom claims
    const claims = user.customClaims || {};
    console.log('🔐 Custom Claims:');
    console.log('   admin:', claims.admin ? '✅ YES' : '❌ NO');
    console.log('   superadmin:', claims.superadmin ? '👑 YES' : '❌ NO');
    console.log('');
    
    // Determine role
    if (claims.superadmin) {
      console.log('👑 ROLE: SUPER ADMIN');
      console.log('   - Can create other admin users');
      console.log('   - Full access to all admin features');
      console.log('   - Can manage system settings');
    } else if (claims.admin) {
      console.log('🔴 ROLE: REGULAR ADMIN');
      console.log('   - Can manage products, orders, customers');
      console.log('   - Cannot create other admin users');
      console.log('   - Limited access to system settings');
    } else {
      console.log('👤 ROLE: REGULAR USER');
      console.log('   - No admin privileges');
      console.log('   - Cannot access admin dashboard');
    }
    
    console.log('');
    console.log('📋 Next Steps:');
    if (!claims.admin) {
      console.log('1. Run: node scripts/create-super-admin.js ' + email);
    } else if (!claims.superadmin) {
      console.log('1. Run: node scripts/create-super-admin.js ' + email);
    } else {
      console.log('✅ You are already a Super Admin!');
      console.log('   - You can create other admin users');
      console.log('   - Access all admin features');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'auth/user-not-found') {
      console.error('   User not found. Make sure the email is correct.');
    }
  }
  
  process.exit(0);
}

// Get email from command line
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide email address:');
  console.error('📝 Usage: node scripts/check-admin-status.js your@email.com');
  process.exit(1);
}

checkAdminStatus(email);
