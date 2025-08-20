"use client";

import { useState } from 'react';
import { FaHeart, FaFacebookF, FaTwitter, FaWhatsapp, FaLink, FaCheckCircle, FaStar, FaShoppingCart, FaTruck, FaShieldAlt, FaUndoAlt, FaInstagram } from 'react-icons/fa';
import { MdOutlineDeliveryDining, MdLocalShipping, MdSecurity } from "react-icons/md";
import { BiHeart } from 'react-icons/bi';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store';
import Image from 'next/image';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    setIsLoading(true);
    try {
      addItem(product, quantity);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
      {/* Breadcrumb */}
      <div className="mb-6">
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

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Product Image Section */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8 flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
            <div className="relative group w-full h-full flex items-center justify-center">
              {product.productImage ? (
                <div className="relative w-full h-[450px]">
                  <Image
                    src={product.productImage}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 rounded-lg w-full h-[450px] flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
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
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-5">
                <div className="flex items-baseline space-x-3 flex-wrap">
                  <span className="text-2xl font-bold text-red-600 lowercase">{product.price.toLocaleString()}</span>
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

              {/* Description */}
              {product.description && (
                <div className="border-l-4 border-red-600 pl-4">
                  <p className="text-gray-700 text-base leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Detailed Description */}
              {product.detailedDescription && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Description</h3>
                  <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">{product.detailedDescription}</p>
                </div>
              )}

              {/* Tasting Notes */}
              {product.tastingNotes && (
                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tasting Notes</h3>
                  <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">{product.tastingNotes}</p>
                </div>
              )}

              {/* Additional Notes */}
              {product.additionalNotes && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
                  <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">{product.additionalNotes}</p>
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
                    disabled={isLoading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl text-base transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                  >
                    <FaShoppingCart />
                    <span>{isLoading ? 'Adding...' : 'Add to Cart'}</span>
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
                  <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <FaFacebookF className="w-4 h-4" />
                  </button>
                  <button className="bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 transition-colors">
                    <FaTwitter className="w-4 h-4" />
                  </button>
                  <button className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors">
                    <FaWhatsapp className="w-4 h-4" />
                  </button>
                  <button className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition-colors">
                    <FaLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 