"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { useAuth } from '@/lib/hooks/useAuth';
import { toast } from 'react-toastify';
import ShippingAddressForm from '@/app/components/ShippingAddressForm';
import Footer from '@/app/components/Footer';

export default function BasketPage() {
  const { items, totalItems, totalAmount, removeItem, updateQuantity, clearCart } = useCartStore();
  const router = useRouter();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your basket is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your basket to continue shopping.</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCheckout = async (shippingAddress: any) => {
    try {
      setIsLoading(true);

      // Check if user is logged in
      if (!auth.currentUser) {
        router.push('/login?redirect=/basket');
        return;
      }

      // Prepare order items
      const orderItems = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.productImage,
        quantity: item.quantity,
        priceAtOrder: item.product.price,
        category: item.product.category,
        subcategory: item.product.subcategory
      }));

      // Send payment request to our API
      const response = await fetch('/api/payments/pesapal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount,
          shippingAddress
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const { redirectUrl } = await response.json();

      // Clear the cart
      clearCart();

      // Redirect to Pesapal payment page
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Failed to process checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Basket</h1>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-6"
                >
                  <img
                    src={item.product.productImage}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.product.category} - {item.product.subcategory}
                    </p>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border-x">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      Ksh {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Ksh {item.product.price.toLocaleString()} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">Ksh {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">Ksh {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {!showShippingForm ? (
                <button 
                  onClick={() => setShowShippingForm(true)}
                  disabled={isLoading || items.length === 0}
                  className={`w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  Proceed to Checkout
                </button>
              ) : (
                <ShippingAddressForm
                  onSubmit={handleCheckout}
                  isLoading={isLoading}
                  initialAddress={{
                    email: auth.currentUser?.email || '',
                    country: 'Kenya'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 