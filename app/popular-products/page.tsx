import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getProductsBySection } from '@/lib/api';
import { Product } from '@/lib/types';
import { capitalizeProductName } from '@/lib/utils';
import AddToBasketButton from '@/app/components/AddToBasketButton';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'Popular Products - Goodstuff',
  description: 'Explore our most popular and best-selling products at Goodstuff. Discover what customers love most.',
};

export default async function PopularProductsPage() {
  // Get popular products
  const popularProducts = await getProductsBySection('popular');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Popular Products
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
              Discover our most loved and best-selling products that customers can't get enough of
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View All Products
              </Link>
              <Link
                href="/products"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Browse Products
              </Link>
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
                <Link href="/" className="text-gray-500 hover:text-purple-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Popular Products</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Customer Favorites & Best Sellers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            These are the products our customers love the most. Join thousands of satisfied customers!
          </p>
        </div>

        {popularProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {popularProducts.map((product: Product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
                <Link href={`/products/${product.id}`}>
                  <div className="relative bg-gray-50 p-6 h-64 flex items-center justify-center">
                    <Image
                      src={product.productImage || '/wine.webp'}
                      alt={product.name}
                      width={200}
                      height={200}
                      style={{ objectFit: 'contain' }}
                      priority={false}
                      loading="lazy"
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Top Choice
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors capitalize">
                      {capitalizeProductName(product.name)}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-purple-600 lowercase">
                        {product.price.toLocaleString()}/=
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="px-6 pb-6">
                  <AddToBasketButton 
                    productId={product.id} 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No popular products available</h3>
            <p className="text-gray-600 mb-8">
              Please check back later for our popular products.
            </p>
            <Link
              href="/products"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Why Shop Popular Products */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Customer Approved</h4>
            <p className="text-gray-600 text-sm">
              These products have been tried, tested, and loved by thousands of our satisfied customers.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Quality Assured</h4>
            <p className="text-gray-600 text-sm">
              Every popular product meets our high quality standards and comes with customer satisfaction guarantee.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Community Choice</h4>
            <p className="text-gray-600 text-sm">
              Join the community of customers who have made these products their top choices and favorites.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
