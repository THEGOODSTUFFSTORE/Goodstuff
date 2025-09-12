"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { useAuth } from '@/lib/hooks/useAuth';
import { capitalizeProductName } from '@/lib/utils';
import { toast } from 'react-toastify';
import Footer from '@/app/components/Footer';

export default function BasketPage() {
  const [isClient, setIsClient] = useState(false);
  const { items, totalItems, totalAmount, removeItem, updateQuantity } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading basket...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Basket</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{capitalizeProductName(item.product.name)}</h3>
                      <p className="text-gray-600">Ksh {item.product.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          -
                        </button>
                        <span className="text-gray-900 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold">Ksh {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-red-600">Ksh {totalAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Delivery fee will be calculated at checkout
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 