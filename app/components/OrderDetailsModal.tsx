"use client";
import React from 'react';
import { X, Package, MapPin, CreditCard, Clock, CheckCircle, Truck, User, Mail, Phone, Copy } from 'lucide-react';
import { Order } from '@/lib/types';
import Image from 'next/image';
import { formatShippingAddress } from '@/lib/utils';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      alert('Address copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Address copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Order Details #{order.orderNumber || order.id.slice(-6)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Created: {formatDate(order.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Status and Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Order Status</span>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Payment Status</span>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(order.paymentStatus || 'pending')}`}>
                {(order.paymentStatus || 'pending').charAt(0).toUpperCase() + (order.paymentStatus || 'pending').slice(1)}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="h-5 w-5 text-gray-500" />
                <span className="font-medium text-gray-700">Total Amount</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                KES {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Email</span>
                </div>
                <p className="font-medium text-gray-900">{order.userEmail}</p>
              </div>
              {order.shippingAddress?.name && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Name</span>
                  </div>
                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                </div>
              )}
              {order.shippingAddress?.phone && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Phone</span>
                  </div>
                  <p className="font-medium text-gray-900">{order.shippingAddress.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Address
              </h3>
              
              {/* Clean, Copyable Address for Uber/Bolt */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">📍 Delivery Address (Copy for Uber/Bolt)</h4>
                    <p className="text-gray-900 font-medium text-lg leading-relaxed">
                      {formatShippingAddress(order.shippingAddress) || 'No address available'}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(formatShippingAddress(order.shippingAddress))}
                    className="ml-4 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </button>
                </div>
              </div>

              {/* Additional Address Details */}
              <div className="space-y-3">
                {/* Show distance if available */}
                {order.shippingAddress.distance && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-700">Distance from Store:</span>
                    <span className="text-sm font-bold text-blue-900">{order.shippingAddress.distance.toFixed(2)} km</span>
                  </div>
                )}
                
                {/* Show GPS coordinates if available (for reference only) */}
                {order.shippingAddress.latitude && order.shippingAddress.longitude && (
                  <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                    <span className="font-medium">GPS Reference:</span> {order.shippingAddress.latitude.toFixed(6)}, {order.shippingAddress.longitude.toFixed(6)}
                  </div>
                )}
                
                {/* Show Plus Code if available (for reference only) */}
                {order.shippingAddress.deliveryAddress && order.shippingAddress.deliveryAddress.includes('+') && (
                  <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                    <span className="font-medium">Plus Code:</span> {order.shippingAddress.deliveryAddress}
                  </div>
                )}
                
                {/* Debug: Show raw address data for troubleshooting */}
                <details className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                  <summary className="cursor-pointer font-medium">🔍 Debug: Raw Address Data</summary>
                  <div className="mt-2 space-y-1">
                    <div><strong>Area:</strong> {order.shippingAddress.area || 'Not set'}</div>
                    <div><strong>City:</strong> {order.shippingAddress.city || 'Not set'}</div>
                    <div><strong>Exact Location:</strong> {order.shippingAddress.exactLocation || 'Not set'}</div>
                    <div><strong>Custom Location:</strong> {order.shippingAddress.customLocation || 'Not set'}</div>
                    <div><strong>Delivery Address:</strong> {order.shippingAddress.deliveryAddress || 'Not set'}</div>
                  </div>
                </details>
              </div>
            </div>
          )}

          {/* Driver Information */}
          {order.trackingNumber && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Driver Information
              </h3>
              <p className="text-blue-800">
                <span className="font-medium">Driver Number:</span> {order.trackingNumber}
              </p>
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg mb-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Items ({order.totalItems} items)
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    {item.productImage && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: KES {item.priceAtOrder.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        KES {(item.quantity * item.priceAtOrder).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Details
            </h3>
            <div className="space-y-2">
              {order.paymentMethod && (
                <p className="text-gray-900">
                  <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                </p>
              )}
              {order.pesapalOrderTrackingId && (
                <p className="text-gray-900">
                  <span className="font-medium">Pesapal Tracking ID:</span> {order.pesapalOrderTrackingId}
                </p>
              )}
              <p className="text-gray-900">
                <span className="font-medium">Total Amount:</span> KES {order.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Admin Notes */}
          {order.adminNote && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Admin Notes</h3>
              <p className="text-yellow-800">{order.adminNote}</p>
            </div>
          )}

          {/* Order Timeline */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Order Timeline
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Created</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                {order.updatedAt && order.updatedAt !== order.createdAt && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-xs text-gray-500">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                )}
                {order.linkedAt && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Linked to User Account</p>
                      <p className="text-xs text-gray-500">{formatDate(order.linkedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal; 