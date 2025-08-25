import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { GiBottleCap } from 'react-icons/gi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import { getProductsByCategory } from '@/lib/api';
import { Product } from '@/lib/types';
import { FaGlassWhiskey } from 'react-icons/fa';

export default async function CiderPage() {
  // Get all cider products
  const ciderProducts = await getProductsByCategory('cider');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-gray-100 text-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaGlassWhiskey className="w-16 h-16 mx-auto mb-6 text-black/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Cider Collection
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Refreshing ciders from traditional to contemporary styles
            </p>
            <div className="mt-8 text-lg text-black/80">
              {ciderProducts.length} ciders available • Free delivery for products above Ksh. 5000
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
                <Link href="/" className="text-gray-500 hover:text-black transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Cider</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Cider Selection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From dry to sweet, discover artisanal ciders for every palate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ciderProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              categoryColor="bg-black"
            />
          ))}
        </div>

        {/* Quick Access to All Ciders */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Ciders</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete cider collection
            </p>
            <Link href="/products?category=cider">
              <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                View All {ciderProducts.length} Ciders
              </button>
            </Link>
          </div>
        </div>

        {/* Cider Education */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-black mb-3">Cider Styles</h4>
            <p className="text-gray-600 text-sm">
              Learn about different cider styles from traditional to modern craft varieties.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-black mb-3">Food Pairing</h4>
            <p className="text-gray-600 text-sm">
              Discover the perfect food pairings for different cider styles and flavors.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-black mb-3">Serving Guide</h4>
            <p className="text-gray-600 text-sm">
              Master the art of serving cider at the perfect temperature and presentation.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 