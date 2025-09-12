"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { useAuth } from '@/lib/hooks/useAuth';
import { toast } from 'react-toastify';
import { capitalizeProductName } from '@/lib/utils';
import ShippingAddressForm from '@/app/components/ShippingAddressForm';
import SimpleLocationPicker from '@/app/components/SimpleLocationPicker';
import Footer from '@/app/components/Footer';
import Link from 'next/link';

export default function CheckoutPage() {
  const [isClient, setIsClient] = useState(false);
  const { items, totalItems, totalAmount, clearCart } = useCartStore();
  const router = useRouter();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryLocation, setDeliveryLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
    distance: number;
  } | null>(null);

  // Free delivery for orders over Ksh 3,000; Pickup is always free
  const qualifiesForFreeDelivery = totalAmount >= 3000;
  const effectiveDeliveryFee = deliveryMethod === 'pickup' ? 0 : (qualifiesForFreeDelivery ? 0 : deliveryFee);

  useEffect(() => {
    // Redirect to basket if cart is empty
    if (items.length === 0) {
      router.push('/basket');
    }
  }, [items.length, router]);

  const handleCheckout = async (shippingAddress: any) => {
    try {
      setIsLoading(true);

      if (deliveryMethod === 'delivery' && !deliveryLocation) {
        toast.error('Please select a delivery location');
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

      // Combine shipping address with delivery location or pickup
      const fullShippingAddress = deliveryMethod === 'pickup' ? {
        ...shippingAddress,
        deliveryAddress: 'Self Pickup at Store',
        latitude: null,
        longitude: null,
        distance: 0,
        pickup: true
      } : {
        ...shippingAddress,
        latitude: deliveryLocation!.latitude,
        longitude: deliveryLocation!.longitude,
        deliveryAddress: deliveryLocation!.address,
        distance: deliveryLocation!.distance,
        pickup: false
      };

      // Send payment request to our API
      const response = await fetch('/api/payments/pesapal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount: totalAmount + effectiveDeliveryFee,
          shippingAddress: fullShippingAddress,
          deliveryFee: effectiveDeliveryFee,
          deliveryMethod,
          userId: auth.currentUser?.uid || null,
          userEmail: auth.currentUser?.email || shippingAddress.email
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

  if (items.length === 0) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          {/* Optional Login Section */}
          {!auth.currentUser && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <p className="text-gray-600">Already have an account?</p>
              <Link 
                href="/login?redirect=/checkout"
                className="text-red-600 hover:text-red-700 font-semibold ml-2"
              >
                Log in for a faster checkout
              </Link>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shipping and Delivery Section */}
            <div className="space-y-6">
              {/* Delivery Method */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="delivery"
                      checked={deliveryMethod === 'delivery'}
                      onChange={() => setDeliveryMethod('delivery')}
                    />
                    <span className="text-gray-800">Deliver to my address</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={deliveryMethod === 'pickup'}
                      onChange={() => setDeliveryMethod('pickup')}
                    />
                    <span className="text-gray-800">Self Pickup at the store (Free)</span>
                  </label>
                </div>
              </div>
              {/* Delivery Location Selection */}
              {deliveryMethod === 'delivery' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Location</h2>
                  <SimpleLocationPicker
                    onDeliveryFeeChange={setDeliveryFee}
                    onLocationChange={setDeliveryLocation}
                  />
                </div>
              )}

              {/* Shipping Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <ShippingAddressForm
                  onSubmit={handleCheckout}
                  isLoading={isLoading}
                  initialAddress={{
                    email: auth.currentUser?.email || ''
                  }}
                />
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{capitalizeProductName(item.product.name)}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        Ksh {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                      <span className="font-semibold">Ksh {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-semibold">{effectiveDeliveryFee === 0 ? 'Free' : `Ksh ${effectiveDeliveryFee.toLocaleString()}`}</span>
                    </div>
                    {qualifiesForFreeDelivery && (
                      <p className="text-sm text-green-600 mt-1">Free delivery applied for orders over Ksh 3,000</p>
                    )}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-red-600">Ksh {(totalAmount + effectiveDeliveryFee).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 