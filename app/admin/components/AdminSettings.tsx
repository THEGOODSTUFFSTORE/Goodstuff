"use client";
import React, { useState, useEffect } from 'react';
import { Save, ShoppingCart, Shield, Users } from 'lucide-react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ElementType;
}

const AdminSettings = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [activeSection, setActiveSection] = useState('orders');
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState({ error: '', success: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  // User Management state
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [sessionsError, setSessionsError] = useState('');
  const [adminSessions, setAdminSessions] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    orders: {
      minimumOrderAmount: 0,
      shippingFee: 0,
      freeShippingThreshold: 0,
      allowPartialFulfillment: true,
      autoConfirmOrders: false,
      orderPrefix: 'ORD',
    },
    notifications: {
      lowStockAlerts: true,
      newOrderNotifications: true,
      orderStatusUpdates: true,
      customerReviewNotifications: false,
      emailNotifications: true,
      pushNotifications: false,
    },
    users: {
      allowUserRegistration: true,
      requireEmailVerification: true,
      passwordMinLength: 8,
      sessionTimeout: 24, // hours
      maxLoginAttempts: 5,
    },
    security: {
      twoFactorAuth: false,
      requireStrongPasswords: true,
      ipWhitelist: '',
      adminActivityLogs: true,
      dataBackup: true,
      backupFrequency: 'daily',
      trackAdminLogins: true,  // New field for tracking admin login timestamps
    }
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch('/api/auth/session/validate', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Not authorized');
          }
          
          if (data.isAdmin) {
            setIsAdmin(true);
            setIsSuperAdmin(!!data.isSuperAdmin);
            setAuthError('');
          } else {
            setAuthError('You do not have admin privileges. Please contact your administrator.');
            router.push('/');
          }
        } catch (error: any) {
          console.error('Auth error:', error);
          setAuthError(error.message || 'Authentication failed. Please try logging in again.');
          router.push('/');
        }
      } else {
        setAuthError('Please log in to access admin settings.');
        router.push('/');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const sections: SettingsSection[] = [
    { id: 'orders', title: 'Order Settings', icon: ShoppingCart },
    { id: 'users', title: 'User Management', icon: Users },
    { id: 'security', title: 'Security', icon: Shield },
  ];

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSuccess('Settings saved successfully!');
      setError('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setError(error.message || 'Error saving settings. Please try again.');
      setSuccess('');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus({ error: '', success: '' });

    try {
      const response = await fetch('/api/auth/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate password reset');
      }

      setResetStatus({ error: '', success: 'Password reset email sent successfully!' });
      setResetEmail('');
    } catch (error: any) {
      setResetStatus({ error: error.message || 'Failed to initiate password reset', success: '' });
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/auth/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: newAdminEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create admin user');
      }

      setSuccess(data.message || 'Admin user created successfully!');
      setNewAdminEmail('');
    } catch (error: any) {
      setError(error.message || 'Failed to create admin user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOrderSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount</label>
          <input
            type="number"
            value={settings.orders.minimumOrderAmount}
            onChange={(e) => handleInputChange('orders', 'minimumOrderAmount', parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Shipping Fee</label>
          <p className="text-sm text-gray-500 mb-2">
            Additional fee on top of the base 70 KES per kilometer rate (e.g., rush delivery, priority handling)
          </p>
          <input
            type="number"
            value={settings.orders.shippingFee}
            onChange={(e) => handleInputChange('orders', 'shippingFee', parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
          <input
            type="number"
            value={settings.orders.freeShippingThreshold}
            onChange={(e) => handleInputChange('orders', 'freeShippingThreshold', parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Order Prefix</label>
          <input
            type="text"
            value={settings.orders.orderPrefix}
            onChange={(e) => handleInputChange('orders', 'orderPrefix', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowPartialFulfillment"
            checked={settings.orders.allowPartialFulfillment}
            onChange={(e) => handleInputChange('orders', 'allowPartialFulfillment', e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="allowPartialFulfillment" className="ml-2 block text-sm text-gray-700">
            Allow Partial Fulfillment
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoConfirmOrders"
            checked={settings.orders.autoConfirmOrders}
            onChange={(e) => handleInputChange('orders', 'autoConfirmOrders', e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label htmlFor="autoConfirmOrders" className="ml-2 block text-sm text-gray-700">
            Auto-confirm Orders
          </label>
        </div>
      </div>
    </div>
  );

  

  const renderUserSettings = () => (
      <div className="space-y-6">
        {isSuperAdmin ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create Admin User</h3>
            <p className="text-sm text-gray-600 mb-4">
              Grant admin privileges to a user. If the email doesn't exist, a new user account will be created with a temporary password.
            </p>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                  Admin Email
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
                  placeholder="Enter email address"
                  required
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-600 text-sm">
                  {success}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Admin User'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Management</h3>
            <p className="text-sm text-gray-600">
              Only the main admin can assign new admins. Contact your superadmin to request changes.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allow User Registration</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.users.allowUserRegistration}
                onChange={(e) => handleInputChange('users', 'allowUserRegistration', e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Enable public user registration</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Verification</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.users.requireEmailVerification}
                onChange={(e) => handleInputChange('users', 'requireEmailVerification', e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Require email verification</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Length</label>
            <input
              type="number"
              value={settings.users.passwordMinLength}
              onChange={(e) => handleInputChange('users', 'passwordMinLength', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
              min="6"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (hours)</label>
            <input
              type="number"
              value={settings.users.sessionTimeout}
              onChange={(e) => handleInputChange('users', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
              min="1"
            />
          </div>
        </div>
      </div>
  );

  const renderSecuritySettings = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="twoFactorAuth"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-700">
              Enable Two-Factor Authentication
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireStrongPasswords"
              checked={settings.security.requireStrongPasswords}
              onChange={(e) => handleInputChange('security', 'requireStrongPasswords', e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="requireStrongPasswords" className="ml-2 block text-sm text-gray-700">
              Require Strong Passwords
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="trackAdminLogins"
              checked={settings.security.trackAdminLogins}
              onChange={(e) => handleInputChange('security', 'trackAdminLogins', e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="trackAdminLogins" className="ml-2 block text-sm text-gray-700">
              Track Admin Login Timestamps
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist</label>
            <input
              type="text"
              value={settings.security.ipWhitelist}
              onChange={(e) => handleInputChange('security', 'ipWhitelist', e.target.value)}
              placeholder="Comma-separated IPs"
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
            <select
              value={settings.security.backupFrequency}
              onChange={(e) => handleInputChange('security', 'backupFrequency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Admin Password Reset Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Password Reset</h3>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <input
                type="email"
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base"
                placeholder="Enter admin email address"
                required
              />
            </div>
            {resetStatus.error && (
              <div className="text-red-600 text-sm">
                {resetStatus.error}
              </div>
            )}
            {resetStatus.success && (
              <div className="text-green-600 text-sm">
                {resetStatus.success}
              </div>
            )}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Send Password Reset Email
            </button>
          </form>
        </div>

        {/* Admin Sessions (Superadmin only) */}
        {isSuperAdmin && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Admin Sessions</h3>
              <button
                onClick={async () => {
                  setIsLoadingSessions(true);
                  setSessionsError('');
                  try {
                    const res = await fetch('/api/admin/sessions');
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || 'Failed to load sessions');
                    setAdminSessions(data.sessions || []);
                  } catch (e: any) {
                    setSessionsError(e.message || 'Failed to load sessions');
                  } finally {
                    setIsLoadingSessions(false);
                  }
                }}
                className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800"
              >
                {isLoadingSessions ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            {sessionsError && (
              <div className="text-sm text-red-600 mb-2">{sessionsError}</div>
            )}
            {adminSessions.length === 0 ? (
              <div className="text-sm text-gray-500">No sessions to display</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Agent</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adminSessions.map((s) => (
                      <tr key={s.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{s.uid}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{s.email || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{s.ip || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 truncate max-w-[16rem]" title={s.userAgent}>{s.userAgent || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{s.createdAt ? new Date(s.createdAt).toLocaleString() : '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{s.type || 'login'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'orders':
        return renderOrderSettings();
      case 'users':
        return renderUserSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderOrderSettings();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <p className="text-red-700">{authError}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <button
          onClick={handleSaveSettings}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
          {/* Settings Navigation */}
          <div className="p-6 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{section.title}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Content */}
          <div className="p-6 md:col-span-3">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings; 