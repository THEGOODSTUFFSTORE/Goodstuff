"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AuthForm from '../components/auth/AuthForm';
import Link from 'next/link';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'request' | 'reset'>('request');
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    const oobCodeParam = searchParams.get('oobCode');
    
    if (modeParam === 'action' && oobCodeParam) {
      setMode('reset');
      setOobCode(oobCodeParam);
    } else {
      setMode('request');
    }
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    if (!oobCode) {
      setMessage({ type: 'error', text: 'Invalid reset code' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage({ 
        type: 'success', 
        text: 'Password reset successfully! You can now sign in with your new password.' 
      });
      
      // Clear the form
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to reset password. The link may have expired.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'reset') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
              <p className="text-gray-600 mt-2">Enter your new password below</p>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>

              {message && (
                <div className={`p-3 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>

            {message?.type === 'success' && (
              <div className="mt-6 text-center">
                <Link 
                  href="/login" 
                  className="text-red-600 hover:text-red-500 font-medium"
                >
                  Sign In with New Password
                </Link>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-gray-500 text-sm"
              >
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show the original request form
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
