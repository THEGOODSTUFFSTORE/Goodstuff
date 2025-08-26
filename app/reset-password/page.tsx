import AuthForm from '../components/auth/AuthForm';
import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <AuthForm mode="reset" />
        
        {/* Additional Help Section */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              • Check your spam/junk folder if you don't see the email
            </p>
            <p>
              • Make sure you're using the email address associated with your account
            </p>
            <p>
              • The reset link will expire in 1 hour for security
            </p>
            <p>
              • Contact support if you continue to have issues
            </p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/login" 
                className="text-red-600 hover:text-red-500 text-sm font-medium"
              >
                ← Back to Sign In
              </Link>
              <Link 
                href="/register" 
                className="text-red-600 hover:text-red-500 text-sm font-medium"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 