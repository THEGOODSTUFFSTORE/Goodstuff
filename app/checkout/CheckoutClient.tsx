"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { useAuth } from '@/lib/hooks/useAuth';
import { toast } from 'react-toastify';
import { capitalizeProductName } from '@/lib/utils';
import { Product } from '@/lib/types';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ShippingAddressForm from '@/app/components/ShippingAddressForm';
import SimpleLocationPicker from '@/app/components/SimpleLocationPicker';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CheckoutClient() {
  const [isClient, setIsClient] = useState(false);
  const { items, totalItems, totalAmount, clearCart, addItem } = useCartStore();
  const router = useRouter();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

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

  const qualifiesForFreeDelivery = totalAmount >= 3000;
  const effectiveDeliveryFee = deliveryMethod === 'pickup' ? 0 : (qualifiesForFreeDelivery ? 0 : deliveryFee);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/basket');
    }
  }, [items.length, router]);

  // Fetch suggested products
  const fetchSuggestedProducts = async () => {
    setIsLoadingSuggestions(true);
    try {
      const productsRef = collection(db, 'products');
      
      // Get products from popular and trending sections
      const [popularQuery, trendingQuery] = await Promise.all([
        getDocs(query(
          productsRef,
          where('sections', 'array-contains', 'popular'),
          orderBy('createdAt', 'desc'),
          limit(3)
        )),
        getDocs(query(
          productsRef,
          where('sections', 'array-contains', 'trending_deals'),
          orderBy('createdAt', 'desc'),
          limit(3)
        ))
      ]);
      
      const popularProducts = popularQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      
      const trendingProducts = trendingQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      
      // Combine and filter out products already in cart
      const cartProductIds = items.map(item => item.product.id);
      const allSuggestions = [...popularProducts, ...trendingProducts]
        .filter(product => !cartProductIds.includes(product.id))
        .slice(0, 6); // Limit to 6 suggestions
      
      setSuggestedProducts(allSuggestions);
    } catch (error) {
      console.error('Error fetching suggested products:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      fetchSuggestedProducts();
    }
  }, [items.length]);

  const handleAddSuggestedProduct = (product: Product) => {
    addItem(product, 1);
    toast.success(`${capitalizeProductName(product.name)} added to cart!`);
    // Refresh suggestions to remove the added product
    fetchSuggestedProducts();
  };

  const handleCheckout = async (shippingAddress: any) => {
    try {
      setIsLoading(true);

      if (deliveryMethod === 'delivery' && !deliveryLocation) {
        toast.error('Please select a delivery location');
        return;
      }

      const orderItems = items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.productImage,
        quantity: item.quantity,
        priceAtOrder: item.product.price,
        category: item.product.category,
        subcategory: item.product.subcategory
      }));

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

      clearCart();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error('Failed to process checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              href="/basket"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Cart</span>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
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
            <div className="space-y-6">
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
              {deliveryMethod === 'delivery' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Location</h2>
                  <SimpleLocationPicker
                    onDeliveryFeeChange={setDeliveryFee}
                    onLocationChange={setDeliveryLocation}
                  />
                </div>
              )}

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

              {/* Product Suggestions */}
              {suggestedProducts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <ShoppingBag className="h-5 w-5 mr-2 text-red-600" />
                    You might also like
                  </h2>
                  
                  {isLoadingSuggestions ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {suggestedProducts.map((product) => (
                        <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <img
                                src={product.productImage || '/wine.webp'}
                                alt={product.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {capitalizeProductName(product.name)}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Ksh {product.price.toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleAddSuggestedProduct(product)}
                              className="flex-shrink-0 bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-700 transition-colors duration-200"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 text-center">
                    <Link 
                      href="/products"
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Browse all products →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


