"use client";
import React from 'react';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { MdLocalShipping, MdSecurity } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useCart } from '@/lib/cartContext';

export default function BasketPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl shadow-xl p-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FaShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Basket is Empty</h1>
            <p className="text-gray-600 text-lg mb-8">
              Looks like you haven't added anything to your basket yet. Start shopping to fill it up!
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
            >
              <FaShoppingBag />
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/products"
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
            >
              <FaArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Basket</h1>
              <p className="text-gray-600">{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} in your basket</p>
            </div>
          </div>
          
          {cart.items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-300 font-medium"
            >
              Clear Basket
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Image
                      src={item.product.productImage}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="object-contain rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm">{item.product.category}</p>
                    {item.product.brand && (
                      <p className="text-red-600 text-sm font-medium">{item.product.brand}</p>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      <FaMinus className="w-3 h-3" />
                    </button>
                    <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      <FaPlus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      Ksh {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-sm text-gray-600">
                        Ksh {item.product.price.toLocaleString()} each
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
                  <span className="font-semibold">Ksh {cart.totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">Ksh {cart.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                Proceed to Checkout
              </button>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Why shop with us?</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MdLocalShipping className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 text-sm">Free delivery on orders over Ksh 2,000</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MdSecurity className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 text-sm">Secure payment guaranteed</span>
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <Link 
              href="/products"
              className="block w-full text-center border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 