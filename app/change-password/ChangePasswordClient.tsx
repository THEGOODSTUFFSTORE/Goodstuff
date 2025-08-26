"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';

export default function ChangePasswordClient() {
  const searchParams = useSearchParams();
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isValidCode, setIsValidCode] = useState(false);

  useEffect(() => {
    const oobCodeParam = searchParams.get('oobCode');
    
    if (oobCodeParam) {
      setOobCode(oobCodeParam);
      setIsValidCode(true);
    } else {
      setMessage({ 
        type: 'error', 
        text: 'Invalid or missing reset code. Please request a new password reset email.' 
      });
    }
  }, [searchParams]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oobCode) {
      setMessage({ type: 'error', text: 'Invalid reset code' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage({ 
        type: 'success', 
        text: 'Password changed successfully! You can now sign in with your new password.' 
      });
      
      // Clear the form
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error: any) {
      console.error('Password change error:', error);
      
      let errorMessage = 'Failed to change password. ';
      
      if (error.code === 'auth/invalid-action-code') {
        errorMessage += 'The reset link has expired or is invalid. Please request a new password reset email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage += 'Please choose a stronger password.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (!isValidCode) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="mb-6">
              <Link href="/" className="flex justify-center">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={150}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h1>
            
            {message && (
              <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200 text-red-800">
                {message.text}
              </div>
            )}
            
            <div className="space-y-4">
              <Link 
                href="/reset-password" 
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 inline-block text-center"
              >
                Request New Password Reset
              </Link>
              
              <Link 
                href="/login" 
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-block text-center"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-6">
            <Link href="/" className="flex justify-center mb-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Change Your Password</h1>
            <p className="text-gray-600 mt-2">Enter your new password below</p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
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
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
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
              {loading ? 'Changing Password...' : 'Change Password'}
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
