'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBeer } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getProductsByCategory } from '@/lib/api';
import { Product } from '@/lib/types';

export default async function BeerPage() {
  // Get all beer products
  const beerProducts = await getProductsByCategory('beer');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#A76545] to-[#8B4513] text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaBeer className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Beer Collection
            </h1>
            <p className="text-xl sm:text-2xl text-[#F5DEB3] max-w-3xl mx-auto">
              Discover our extensive selection of beers from craft breweries to international favorites
            </p>
            <div className="mt-8 text-lg text-[#F5DEB3]">
              {beerProducts.length} beers available • Free delivery for products above Ksh. 5000
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="text-gray-500 hover:text-[#A76545] transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Beer</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Beer Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From crisp lagers to bold ales, find the perfect beer for every taste and occasion
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {beerProducts.map((product: Product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <div className="relative h-48 w-full flex items-center justify-center bg-gray-50">
                <Image
                  src={product.productImage || '/wine.webp'}
                  alt={product.name}
                  width={150}
                  height={150}
                  style={{ objectFit: 'contain' }}
                  onError={(e: any) => {
                    e.currentTarget.src = '/wine.webp';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-800 h-12 overflow-hidden">
                  {product.name}
                </h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-xl font-bold text-[#A76545]">
                    Ksh {product.price.toLocaleString()}/-
                  </span>
                </div>
                <button 
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    // Add to cart functionality will be handled by the cart store
                  }}
                >
                  Add to basket
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* No products found */}
        {beerProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No beers available</h3>
            <p className="text-gray-600 mb-8">
              Please check back later for our beer collection.
            </p>
            <Link
              href="/products"
              className="bg-[#A76545] text-white px-6 py-3 rounded-lg hover:bg-[#8B4513] transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Beer Education */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h4 className="text-xl font-bold text-[#A76545] mb-3">Beer & Food Pairing</h4>
            <p className="text-gray-600 text-sm">
              Learn how to pair different beer styles with various cuisines and dishes.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h4 className="text-xl font-bold text-[#A76545] mb-3">Brewing Process</h4>
            <p className="text-gray-600 text-sm">
              Discover how your favorite beers are crafted from grain to glass.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h4 className="text-xl font-bold text-[#A76545] mb-3">Serving Tips</h4>
            <p className="text-gray-600 text-sm">
              Learn the optimal serving temperatures and glassware for each beer style.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 