"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { ShoppingBag, User as UserIcon, Settings, LogOut, Package, Clock, CheckCircle, XCircle, ChevronRight, TrendingUp, Home, Store } from 'lucide-react';
import { Order } from '@/lib/types';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';

const CustomerDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    pending: 0
  });
  const [linkingOrders, setLinkingOrders] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        setUser(user);
        console.log('Dashboard: User ID for fetching orders:', user.uid);
        await fetchOrders(user.uid);
        
        // Check for payment status in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment');
        const orderId = urlParams.get('orderId');
        
        console.log('Dashboard: URL params:', { paymentStatus, orderId });
        
        if (paymentStatus === 'success' && orderId) {
          // Refresh orders multiple times to ensure we get updated data
          setTimeout(async () => {
            console.log('Dashboard: First refresh after payment success');
            await fetchOrders(user.uid);
          }, 1000);
          
          setTimeout(async () => {
            console.log('Dashboard: Second refresh after payment success');
            await fetchOrders(user.uid);
          }, 3000);
          
          setTimeout(async () => {
            console.log('Dashboard: Third refresh after payment success');
            await fetchOrders(user.uid);
          }, 6000);
        }
      } else {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchOrders = async (userId: string) => {
    try {
      console.log('Dashboard: Fetching orders for user ID:', userId);
      
      // Use server-side API to fetch orders
      const response = await fetch('/api/orders/user', {
        method: 'GET',
        credentials: 'include', // Include cookies for session authentication
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      
      const data = await response.json();
      const fetchedOrders = data.orders || [];
      
      console.log('Dashboard: Found orders:', fetchedOrders.length);
      console.log('Dashboard: Orders data:', fetchedOrders.map((o: Order) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        userId: o.userId,
        userEmail: o.userEmail,
        paymentStatus: o.paymentStatus,
        status: o.status
      })));

      setOrders(fetchedOrders);
      
      // Calculate order statistics
      const stats = fetchedOrders.reduce((acc: any, order: Order) => {
        acc.total += order.totalAmount;
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {
        total: 0,
        completed: 0,
        processing: 0,
        pending: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      });
      
      setOrderStats(stats);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleManualRefresh = async () => {
    if (user) {
      console.log('Dashboard: Manual refresh triggered');
      setLoading(true);
      await fetchOrders(user.uid);
      setLoading(false);
    }
  };

  const handleLinkPreviousOrders = async () => {
    if (!user) return;
    
    setLinkingOrders(true);
    try {
      const response = await fetch('/api/orders/link-guest', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to link orders');
      }
      
      const data = await response.json();
      
      if (data.linkedCount > 0) {
        alert(`Successfully linked ${data.linkedCount} previous orders to your account!`);
        // Refresh orders after linking
        await fetchOrders(user.uid);
      } else {
        alert('No previous orders found to link.');
      }
    } catch (error) {
      console.error('Error linking orders:', error);
      alert('Failed to link previous orders. Please try again.');
    } finally {
      setLinkingOrders(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const renderOrderTimeline = (order: Order) => {
    const steps = [
      { status: 'pending', icon: Clock, label: 'Order Placed' },
      { status: 'processing', icon: Package, label: 'Processing' },
      { status: 'completed', icon: CheckCircle, label: 'Delivered' }
    ];

    const currentStepIndex = steps.findIndex(step => step.status === order.status);

    return (
      <div className="flex items-center space-x-4 mt-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.status}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStepIndex 
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1 text-gray-500">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-0.5 w-12 ${
                index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">
                KES {orderStats.total.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{orderStats.completed}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Processing</p>
              <p className="text-2xl font-semibold text-gray-900">{orderStats.processing}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Package className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleLinkPreviousOrders}
                disabled={linkingOrders}
                className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {linkingOrders ? '🔗 Linking...' : '🔗 Link Previous Orders'}
              </button>
              <button
                onClick={handleManualRefresh}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                🔄 Refresh Orders
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by exploring our products, or link any previous orders you made as a guest.
              </p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleLinkPreviousOrders}
                  disabled={linkingOrders}
                  className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {linkingOrders ? '🔗 Linking...' : '🔗 Link Previous Orders'}
                </button>
                <br />
                <button
                  onClick={() => router.push('/')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Browse Products
                </button>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {order.items[0]?.productImage && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={order.items[0].productImage}
                            alt={order.items[0].productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Order #{order.orderNumber || order.id.slice(-6)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} items · KES {order.totalAmount.toFixed(2)}
                      </p>
                      {order.paymentStatus === 'paid' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          Payment Confirmed
                        </span>
                      )}
                      {order.paymentStatus === 'pending' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                          Payment Pending
                        </span>
                      )}
                      {order.paymentStatus === 'failed' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                          Payment Failed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                {renderOrderTimeline(order)}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} · KES {item.priceAtOrder.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Tracking Number: {order.trackingNumber}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Created</label>
              <p className="mt-1 text-gray-900">
                {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => router.push('/reset-password')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="order-updates"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    defaultChecked
                  />
                  <label htmlFor="order-updates" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Order updates</span>
                    <span className="block text-sm text-gray-500">Receive notifications about your order status</span>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="promotions"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    defaultChecked
                  />
                  <label htmlFor="promotions" className="ml-3">
                    <span className="block text-sm font-medium text-gray-700">Promotions and deals</span>
                    <span className="block text-sm text-gray-500">Get notified about special offers and discounts</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.email}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      Customer Account
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <nav className="space-y-1">
                  {/* Navigation Links */}
                  <button
                    onClick={() => router.push('/')}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-red-500"
                  >
                    <Home className="mr-3 h-5 w-5" />
                    <span>Home</span>
                  </button>
                  <button
                    onClick={() => router.push('/products')}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-red-500"
                  >
                    <Store className="mr-3 h-5 w-5" />
                    <span>Browse Products</span>
                  </button>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  {/* Dashboard Tabs */}
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-red-50 text-red-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ShoppingBag className="mr-3 h-5 w-5" />
                    <span>Orders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-red-50 text-red-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <UserIcon className="mr-3 h-5 w-5" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === 'settings'
                        ? 'bg-red-50 text-red-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    <span>Settings</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard; 