import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getProductsBySection } from '@/lib/api';
import { Product } from '@/lib/types';
import ProductCard from '@/app/components/ProductCard';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'New Arrivals - Goodstuff',
  description: 'Discover the latest and newest products at Goodstuff. Be the first to explore our fresh arrivals.',
};

export default async function NewArrivalsPage() {
  // Get new arrival products
  const newArrivalProducts = await getProductsBySection('new_arrivals');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-gray-100 text-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              New Arrivals
            </h1>
            <p className="text-xl md:text-2xl text-black/90 max-w-3xl mx-auto mb-8">
              Be the first to discover our latest products and fresh arrivals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                View All Products
              </Link>
              <Link
                href="/products"
                className="border-2 border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors"
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
                <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">New Arrivals</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fresh & New Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest additions to our collection. These products just arrived and are ready for you!
          </p>
        </div>

        {newArrivalProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {newArrivalProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryLabel="Fresh Arrival"
                categoryColor="bg-blue-600"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No new arrivals available</h3>
            <p className="text-gray-600 mb-8">
              Please check back later for our new arrivals.
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Why Shop New Arrivals */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">First to Know</h4>
            <p className="text-gray-600 text-sm">
              Be among the first to discover and try our newest products before they become mainstream.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Latest Trends</h4>
            <p className="text-gray-600 text-sm">
              Stay ahead of the curve with the latest trends and innovations in beverages and spirits.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Exclusive Access</h4>
            <p className="text-gray-600 text-sm">
              Get exclusive access to new products and limited editions that may not be available later.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
