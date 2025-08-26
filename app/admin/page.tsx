"use client";
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  FileText, 
  Users, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  TrendingUp,
  ShoppingCart,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  Menu,
  X,
  LayoutList,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import ProductForm from './components/ProductForm';
import AdminAuth from './components/AdminAuth';
import AdminSettings from './components/AdminSettings';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { getProducts, deleteProduct, getOrderStats, getRecentOrders, getTopSellingProducts, TopSellingProduct } from '@/lib/firebaseApi';
import { Product, Customer, Order } from '@/lib/types';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { LucideIcon } from 'lucide-react';

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  monthlyGrowth: number;
}

interface Tab {
  id: string;
  name: string;
  icon: LucideIcon;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalOrders: 0,
    monthlyGrowth: 12.5
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [isCustomersLoading, setIsCustomersLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [isOrderDetailsModalOpen, setIsOrderDetailsModalOpen] = useState(false);

  // Payment Debug Modal Component
  const PaymentDebugModal = ({ order, isOpen, onClose }: { order: Order | null, isOpen: boolean, onClose: () => void }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [debugInfo, setDebugInfo] = useState<any>(null);

    const handlePaymentAction = async (action: string, pesapalTrackingId?: string) => {
      if (!order) return;
      
      setIsLoading(true);
      try {
        console.log('Payment action:', action, 'for order:', order.id);
        const response = await fetch('/api/admin/fix-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: order.id,
            action,
            pesapalTrackingId
          }),
        });

        const result = await response.json();
        console.log('Payment action result:', result);
        
        if (response.ok) {
          // Show detailed success message
          const message = `${result.message}\n\nUpdated Data:\n${JSON.stringify(result.verifiedData || result.updateData, null, 2)}`;
          alert(message);
          
          if (result.debugInfo) {
            setDebugInfo(result.debugInfo);
          }
          
          // Force refresh orders with a small delay to ensure database update is complete
          setTimeout(async () => {
            console.log('Refreshing orders list...');
            const ordersResponse = await fetch('/api/orders');
            if (ordersResponse.ok) {
              const fetchedOrders = await ordersResponse.json();
              console.log('Refreshed orders:', fetchedOrders.length);
              setOrders(fetchedOrders);
              
              // Also update the current order in the modal
              const updatedOrder = fetchedOrders.find((o: any) => o.id === order.id);
              if (updatedOrder) {
                console.log('Updated order found:', updatedOrder.paymentStatus, updatedOrder.status);
                setSelectedOrder(updatedOrder);
              }
            }
          }, 1000);
        } else {
          alert(`Error: ${result.error}\n\nDetails: ${JSON.stringify(result.details || {}, null, 2)}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to perform action: ' + error);
      } finally {
        setIsLoading(false);
      }
    };

    const getDebugInfo = async () => {
      if (!order) return;
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/fix-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: order.id,
            action: 'debug_info'
          }),
        });

        const result = await response.json();
        setDebugInfo(result.debugInfo);
      } catch (error) {
        console.error('Error getting debug info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isOpen || !order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Payment Debug: Order #{order.orderNumber || order.id}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Current Status</h4>
              <p><strong>Payment Status:</strong> {order.paymentStatus || 'unknown'}</p>
              <p><strong>Order Status:</strong> {order.status}</p>
              <p><strong>Total Amount:</strong> KES {order.totalAmount.toLocaleString()}</p>
              <p><strong>Pesapal Tracking ID:</strong> {order.pesapalOrderTrackingId || 'None'}</p>
              <p><strong>Last Updated:</strong> {order.updatedAt || 'Never'}</p>
              <p><strong>Admin Note:</strong> {order.adminNote || 'None'}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={getDebugInfo}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Get Debug Info
              </button>
              
              <button
                onClick={async () => {
                  // Immediately check current order status
                  try {
                    const response = await fetch(`/api/debug-order?orderId=${order.id}`);
                    const result = await response.json();
                    alert(`Current Order Status:\n${JSON.stringify(result.orders[0], null, 2)}`);
                  } catch (error) {
                    alert('Failed to check order status');
                  }
                }}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                Check Current Status
              </button>
              
              <button
                onClick={() => handlePaymentAction('force_sync')}
                disabled={isLoading || !order.pesapalOrderTrackingId}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Force Sync with Pesapal
              </button>
              
              <button
                onClick={() => handlePaymentAction('mark_paid')}
                disabled={isLoading}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
              >
                Mark as Paid
              </button>
              
              <button
                onClick={() => handlePaymentAction('reset_to_pending')}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Reset to Pending
              </button>
            </div>

            {debugInfo && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Debug Information</h4>
                <pre className="text-sm overflow-x-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const tabs: Tab[] = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'orders', name: 'Orders', icon: ShoppingCart },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  // Fetch products and order stats on mount and when products are updated
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch products
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);

        // Fetch order stats
        const orderStats = await getOrderStats();

        // Fetch dashboard lists
        const [recent, top] = await Promise.all([
          getRecentOrders(5),
          getTopSellingProducts(5, 90),
        ]);
        setRecentOrders(recent);
        setTopProducts(top);

        // Update stats
        setStats({
          totalProducts: fetchedProducts.length,
          totalOrders: orderStats.totalOrders,
          monthlyGrowth: 12.5
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Fetch customers
  useEffect(() => {
    const loadCustomers = async () => {
      setIsCustomersLoading(true);
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const fetchedCustomers = await response.json();
        const customersArray = Array.isArray(fetchedCustomers)
          ? fetchedCustomers
          : (fetchedCustomers.customers || []);
        setCustomers(customersArray);
      } catch (error) {
        console.error('Error loading customers:', error);
      } finally {
        setIsCustomersLoading(false);
      }
    };

    if (activeTab === 'customers') {
      loadCustomers();
    }
  }, [activeTab]);

  // Fetch orders
  useEffect(() => {
    const loadOrders = async () => {
      setIsOrdersLoading(true);
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const fetchedOrders = await response.json();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsOrdersLoading(false);
      }
    };

    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check session validity
        const response = await fetch('/api/auth/session/validate');
        if (!response.ok) {
          setIsAuthenticated(false);
          return;
        }
        
        const data = await response.json();
        if (!data.isAdmin) {
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkAuth();
      } else {
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleProductSubmit = async (productData: Product) => {
    // Refresh products list after submit
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const handleUpdateCustomerStatus = async (customerId: string, disabled: boolean) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disabled }),
      });

      if (!response.ok) {
        throw new Error('Failed to update customer status');
      }

      // Refresh customers list
      if (activeTab === 'customers') {
        const response = await fetch('/api/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const fetchedCustomers = await response.json();
        const customersArray = Array.isArray(fetchedCustomers)
          ? fetchedCustomers
          : (fetchedCustomers.customers || []);
        setCustomers(customersArray);
      }
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, trackingNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders list
      if (activeTab === 'orders') {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const fetchedOrders = await response.json();
        setOrders(fetchedOrders);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status. Please try again.');
    }
  };

  const filteredProducts = products.filter(product => {
    // Text search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Stock filter
    let matchesStock = true;
    if (stockFilter === 'in_stock') {
      matchesStock = product.stockQuantity > 0;
    } else if (stockFilter === 'low_stock') {
      matchesStock = product.stockQuantity > 0 && product.stockQuantity <= 10;
    } else if (stockFilter === 'out_of_stock') {
      matchesStock = product.stockQuantity === 0;
    }
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = product.status === 'active';
    } else if (statusFilter === 'inactive') {
      matchesStatus = product.status === 'inactive';
    } else if (statusFilter === 'out_of_stock') {
      matchesStatus = product.status === 'out_of_stock';
    } else if (statusFilter === 'discontinued') {
      matchesStatus = product.status === 'discontinued';
    }
    
    return matchesSearch && matchesStock && matchesStatus;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
            </div>
            <div className="p-2 md:p-3 bg-gray-50 rounded-xl">
              <Package className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="p-2 md:p-3 bg-gray-50 rounded-xl">
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Stock Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Stock Status</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Stock:</span>
                  <span className="text-lg font-bold text-green-600">
                    {products.filter(p => p.stockQuantity > 0 && p.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Low Stock:</span>
                  <span className="text-lg font-bold text-orange-600">
                    {products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10 && p.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Out of Stock:</span>
                  <span className="text-lg font-bold text-red-600">
                    {products.filter(p => p.stockQuantity === 0 || p.status === 'out_of_stock').length}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-2 md:p-3 bg-gray-50 rounded-xl">
              <Package className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Revenue card removed */}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select className="form-select text-sm border-gray-200 rounded-xl focus:border-gray-900 focus:ring-gray-900">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <div className="text-sm text-gray-500">No recent orders</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-sm font-medium text-gray-900">#{order.orderNumber || order.id}</div>
                    <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">KES {order.totalAmount.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
              <p className="text-sm text-gray-500 mt-1">Best selling items</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select className="form-select text-sm border-gray-200 rounded-xl focus:border-gray-900 focus:ring-gray-900">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <div className="text-sm text-gray-500">No sales data</div>
            ) : (
              topProducts.map((p) => (
                <div key={p.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={p.productImage || '/wine.webp'} alt={p.productName} className="h-10 w-10 rounded object-cover" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{p.productName}</div>
                      <div className="text-xs text-gray-500">{p.soldQuantity} sold</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">KES {p.revenue.toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={handleAddProduct}
            className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          
          {/* Quick Stock Actions */}
          <button
            onClick={() => {
              const lowStockProducts = products.filter(p => p.stockQuantity <= 10 && p.stockQuantity > 0);
              if (lowStockProducts.length > 0) {
                alert(`Low stock alert! ${lowStockProducts.length} products have 10 or fewer items remaining.`);
              } else {
                alert('All products have sufficient stock!');
              }
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-all duration-200"
          >
            <Package className="h-4 w-4" />
            <span>Check Low Stock</span>
          </button>
          
          <button
            onClick={() => {
              const outOfStockProducts = products.filter(p => p.stockQuantity === 0);
              if (outOfStockProducts.length > 0) {
                alert(`Out of stock alert! ${outOfStockProducts.length} products need restocking.`);
              } else {
                alert('All products are in stock!');
              }
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-200"
          >
            <Package className="h-4 w-4" />
            <span>Check Out of Stock</span>
          </button>
        </div>
      </div>

      {/* Search, Filters, and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          >
            <option value="all">All Stock Levels</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock (1-10)</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="discontinued">Discontinued</option>
          </select>
          
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center justify-center px-3 py-2.5 ${
                viewMode === 'table'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center justify-center px-3 py-2.5 ${
                viewMode === 'grid'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products List */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="ml-2">Loading products...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      <div className="text-gray-500">No products found</div>
                      <button
                        onClick={handleAddProduct}
                        className="mt-2 text-sm text-gray-900 hover:text-gray-700"
                      >
                        Add your first product
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={product.productImage || '/wine.webp'}
                              alt={product.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                          {product.subcategory && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              {product.subcategory}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        KES {product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {/* Stock Quantity */}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.stockQuantity > 10
                              ? 'bg-green-100 text-green-800'
                              : product.stockQuantity > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stockQuantity} in stock
                          </span>
                          
                          {/* Status Badge */}
                          <div className="flex items-center space-x-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.status === 'active' ? 'bg-blue-100 text-blue-800' :
                              product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                              product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                              product.status === 'discontinued' ? 'bg-gray-100 text-gray-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {product.status === 'active' ? 'Active' :
                               product.status === 'inactive' ? 'Inactive' :
                               product.status === 'out_of_stock' ? 'Out of Stock' :
                               product.status === 'discontinued' ? 'Discontinued' :
                               'Unknown'}
                            </span>
                            
                            {/* Low Stock Alert */}
                            {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                Low Stock!
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded-lg"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">No products found</div>
              <button
                onClick={handleAddProduct}
                className="mt-2 text-sm text-gray-900 hover:text-gray-700"
              >
                Add your first product
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={product.productImage || '/wine.webp'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                    {product.subcategory && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {product.subcategory}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-2">
                    {/* Price and Stock */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        KES {product.price.toFixed(2)}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stockQuantity > 10
                          ? 'bg-green-100 text-green-800'
                          : product.stockQuantity > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stockQuantity} in stock
                      </span>
                    </div>
                    
                    {/* Status and Alerts */}
                    <div className="flex items-center space-x-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        product.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' :
                        product.status === 'discontinued' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status === 'active' ? 'Active' :
                         product.status === 'inactive' ? 'Inactive' :
                         product.status === 'out_of_stock' ? 'Out of Stock' :
                         product.status === 'discontinued' ? 'Discontinued' :
                         'Unknown'}
                      </span>
                      
                      {/* Low Stock Alert */}
                      {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                          Low Stock!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isProductFormOpen}
        product={editingProduct || undefined}
        onClose={() => setIsProductFormOpen(false)}
        onSubmit={handleProductSubmit}
      />
    </div>
  );

  const renderCustomers = () => {
    const filteredCustomers = customers.filter((customer: any) => {
      const name = (customer.name || customer.displayName || '').toLowerCase();
      const email = (customer.email || '').toLowerCase();
      const phone = (customer.phone || customer.phoneNumber || '');
      const term = customerSearchTerm.toLowerCase();
      return name.includes(term) || email.includes(term) || phone.includes(customerSearchTerm);
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your customer base</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base transition-all duration-200"
              value={customerSearchTerm}
              onChange={(e) => setCustomerSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isCustomersLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer: any) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {(customer.displayName || customer.name || customer.email || 'U')
                                  .toString()
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.displayName || customer.name || customer.email || 'User'}</div>
                            <div className="text-sm text-gray-500">Joined {new Date(customer.creationTime || customer.joinDate || Date.now()).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone || customer.phoneNumber || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.totalOrders || 0} orders</div>
                        {customer.lastOrder && (
                          <div className="text-sm text-gray-500">Last order {new Date(customer.lastOrder).toLocaleDateString()}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">KES {(customer.totalSpent || 0).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const isDisabled = customer.disabled === true ? true : (customer.status ? customer.status !== 'active' : false);
                          const statusLabel = isDisabled ? 'Inactive' : 'Active';
                          const userId = customer.uid || customer.id;
                          return (
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                                !isDisabled 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                              onClick={() => handleUpdateCustomerStatus(userId, !isDisabled)}
                            >
                              {statusLabel}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderOrders = () => {
    const filteredOrders = orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        (order.shippingAddress?.name && order.shippingAddress.name.toLowerCase().includes(orderSearchTerm.toLowerCase()));
      
      const matchesStatus = selectedOrderStatus === 'all' || order.status === selectedOrderStatus;
      
      return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'processing':
          return 'bg-blue-100 text-blue-800';
        case 'shipped':
          return 'bg-purple-100 text-purple-800';
        case 'delivered':
          return 'bg-green-100 text-green-800';
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    const OrderStatusDropdown = ({ order }: { order: Order }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [driverNumber, setDriverNumber] = useState(order.trackingNumber || '');

      const statuses = [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ];

      const handleStatusUpdate = (newStatus: string) => {
        if (newStatus === 'shipped' && !driverNumber.trim()) {
          const driver = prompt('Please enter driver number:');
          if (driver) {
            setDriverNumber(driver);
            handleUpdateOrderStatus(order.id, newStatus, driver);
          }
        } else {
          handleUpdateOrderStatus(order.id, newStatus, driverNumber);
        }
        setIsOpen(false);
      };

      return (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} hover:opacity-80`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusUpdate(status.value)}
                  className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    order.status === status.value ? 'bg-gray-100 font-medium' : ''
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
            <p className="text-sm text-gray-500 mt-1">Manage customer orders and track fulfillment</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base transition-all duration-200"
              value={orderSearchTerm}
              onChange={(e) => setOrderSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedOrderStatus}
            onChange={(e) => setSelectedOrderStatus(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-black text-base transition-all duration-200"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isOrdersLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="ml-2">Loading orders...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{order.orderNumber || order.id}</div>
                          {order.trackingNumber && (
                            <div className="text-sm text-gray-500">Tracking: {order.trackingNumber}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.shippingAddress?.name || 'Guest'}
                          </div>
                          <div className="text-sm text-gray-500">{order.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.totalItems} items</div>
                        <div className="text-sm text-gray-500">
                          {order.items.slice(0, 2).map(item => item.productName).join(', ')}
                          {order.items.length > 2 && ` +${order.items.length - 2} more`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          KES {order.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : order.paymentStatus === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentStatus === 'paid' ? 'Payment Confirmed' : 
                             order.paymentStatus === 'failed' ? 'Payment Failed' : 'Payment Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <OrderStatusDropdown order={order} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsPaymentModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="Debug Payment"
                          >
                            🔧
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedOrderForDetails(order);
                              setIsOrderDetailsModalOpen(true);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                            title="View Order Details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <AdminSettings />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProducts();
      case 'orders':
        return renderOrders();
      case 'customers':
        return renderCustomers();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  if (!isAuthenticated) {
    return <AdminAuth />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - hidden on mobile, shown on md and up */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white shadow-sm z-30">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header - shown on mobile, hidden on md and up */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-30 md:hidden">
        <div className="flex items-center justify-between px-4 h-full">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - shown when menu button is clicked */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gray-900 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        <main className="p-4 md:p-8 mt-16 md:mt-0">
          {renderContent()}
        </main>
      </div>

      {/* Payment Debug Modal */}
      <PaymentDebugModal
        order={selectedOrder}
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedOrder(null);
        }}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrderForDetails}
        isOpen={isOrderDetailsModalOpen}
        onClose={() => {
          setIsOrderDetailsModalOpen(false);
          setSelectedOrderForDetails(null);
        }}
      />
    </div>
  );
};

export default AdminDashboard; 