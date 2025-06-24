"use client";
import React, { useState, useEffect } from 'react';
import { FaHeart, FaFacebookF, FaTwitter, FaWhatsapp, FaLink, FaCheckCircle, FaStar, FaShoppingCart, FaTruck, FaShieldAlt, FaUndoAlt, FaInstagram, FaSpinner } from 'react-icons/fa';
import { MdOutlineDeliveryDining, MdLocalShipping, MdSecurity } from "react-icons/md";
import { BiHeart } from 'react-icons/bi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cartContext';

interface ProductDetailProps {
  params: {
    productId: string;
  };
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isLoading: cartLoading } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productId = (await params).productId;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/products?id=${productId}`, { cache: 'no-store' });
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="w-8 h-8 text-red-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Fallback data if product not found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center bg-white rounded-xl shadow-lg p-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 text-lg">The product you're looking for doesn't exist.</p>
            <button className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
              Browse Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <a href="/" className="text-gray-500 hover:text-red-600 transition-colors">Home</a>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <a href="/Categories" className="text-gray-500 hover:text-red-600 transition-colors">{product.category}</a>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            {/* Product Image Section */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8 flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
              <div className="relative group w-full h-full flex items-center justify-center">
                <img 
                  src={product.productImage} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  style={{ maxHeight: '450px' }}
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Premium
                </div>
              </div>
            </div>

            {/* Product Information Section */}
            <div className="p-6 lg:p-8 flex flex-col justify-start">
              <div className="space-y-5">
                
                {/* Product Header */}
                <div className="space-y-3">
                  {product.brand && (
                    <p className="text-red-600 font-semibold text-base uppercase tracking-wide">{product.brand}</p>
                  )}
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4" />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">(24 reviews)</span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-5">
                  <div className="flex items-baseline space-x-3 flex-wrap">
                    <span className="text-3xl font-bold text-red-600">Ksh {product.price.toLocaleString()}</span>
                    <span className="text-gray-500 line-through text-lg">Ksh {Math.round(product.price * 1.2).toLocaleString()}</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Save 17%
                    </span>
                  </div>
                </div>

                {/* Product Quick Info */}
                {(product.origin || product.alcoholContent || product.volume) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.origin && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-500 text-sm font-medium">Origin</p>
                        <p className="text-gray-900 font-semibold">{product.origin}</p>
                      </div>
                    )}
                    {product.alcoholContent && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-500 text-sm font-medium">Alcohol</p>
                        <p className="text-gray-900 font-semibold">{product.alcoholContent}</p>
                      </div>
                    )}
                    {product.volume && (
                      <div className="bg-gray-50 rounded-lg p-4 sm:col-span-2">
                        <p className="text-gray-500 text-sm font-medium">Volume</p>
                        <p className="text-gray-900 font-semibold">{product.volume}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Short Description */}
                {product.description && (
                  <div className="border-l-4 border-red-600 pl-4">
                    <p className="text-gray-700 text-base leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="flex items-center space-x-4 bg-gray-50 rounded-xl p-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      <span className="text-lg font-bold">−</span>
                    </button>
                    <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      <span className="text-lg font-bold">+</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleAddToCart}
                      disabled={cartLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl text-base transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                    >
                      {cartLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaShoppingCart />
                      )}
                      <span>{cartLoading ? 'Adding...' : 'Add to Cart'}</span>
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center">
                      <BiHeart className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300">
                    Buy Now
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <MdLocalShipping className="w-6 h-6 mx-auto text-green-600 mb-2" />
                    <p className="text-xs text-gray-600 font-medium">Fast Delivery</p>
                  </div>
                  <div className="text-center">
                    <MdSecurity className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                    <p className="text-xs text-gray-600 font-medium">Secure Payment</p>
                  </div>
                </div>

                {/* Social Share */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-gray-600 font-medium text-sm">Share:</span>
                  <div className="flex space-x-2">
                    <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <FaFacebookF className="w-3 h-3" />
                    </a>
                    <a href="#" className="bg-red-400 text-white p-2 rounded-full hover:bg-red-500 transition-colors">
                      <FaInstagram className="w-3 h-3" />
                    </a>
                    <a href="#" className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors">
                      <FaWhatsapp className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information Card */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center mb-4">
            <div className="bg-green-600 rounded-full p-2 mr-3">
              <FaTruck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Express Delivery</h3>
              <p className="text-green-700 text-sm">Lightning fast delivery</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-green-600 w-4 h-4" />
              <span className="text-gray-700 text-sm">20-40 minutes in Nairobi</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-green-600 w-4 h-4" />
              <span className="text-gray-700 text-sm">Next-day country-wide</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-green-600 w-4 h-4" />
              <span className="text-gray-700 text-sm">Order before 4pm for same-day</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-green-600 w-4 h-4" />
              <span className="text-gray-700 text-sm">Free delivery over Ksh 5,000</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="space-y-6">
              {/* Detailed Description */}
              {product.detailedDescription && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <span className="w-1 h-6 bg-red-600 mr-3 rounded"></span>
                    About {product.name}
                  </h2>
                  <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                    <p className="whitespace-pre-line">{product.detailedDescription}</p>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {product.additionalNotes && (
                <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <span className="w-1 h-6 bg-blue-600 mr-3 rounded"></span>
                    Additional Info
                  </h2>
                  <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                    <p className="whitespace-pre-line">{product.additionalNotes}</p>
                  </div>
                </div>
              )}

              {/* Fallback content if no detailed info */}
              {!product.detailedDescription && !product.tastingNotes && !product.additionalNotes && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <span className="w-1 h-6 bg-red-600 mr-3 rounded"></span>
                    Product Description
                  </h2>
                  <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                    <p>{product.description || "Premium quality product with exceptional taste and craftsmanship."}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Why Choose Us */}
            <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Why Choose Goodstuff</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <FaTruck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">Fast Delivery</h3>
                  <p className="text-gray-600 text-xs">30 minutes in Nairobi</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <FaShieldAlt className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">Premium Quality</h3>
                  <p className="text-gray-600 text-xs">Finest selection worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
