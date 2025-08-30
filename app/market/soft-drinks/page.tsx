import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { GiSodaCan } from 'react-icons/gi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import { getProducts } from '@/lib/api';

export default async function SoftDrinksPage() {
  // Get all market products and filter by soft drinks subcategory
  const allProducts = await getProducts();
  const softDrinksProducts = allProducts.filter(product => 
    product.category.toLowerCase() === 'market' &&
    product.subcategory.toLowerCase().includes('soft-drinks')
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GiSodaCan className="w-20 h-20" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Soft Drinks
            </h1>
            <p className="text-xl sm:text-2xl text-cyan-100 max-w-3xl mx-auto">
              Refreshing beverages and non-alcoholic drinks
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="text-gray-500 hover:text-cyan-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <Link href="/market" className="text-gray-500 hover:text-cyan-600 transition-colors">Market</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Soft Drinks</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/market" className="inline-flex items-center text-gray-600 hover:text-cyan-600 transition-colors">
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Back to Market
        </Link>
      </div>

      {/* All Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">All Soft Drinks</h2>
        </div>

        {softDrinksProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {softDrinksProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                showCategory={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <GiSodaCan className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Soft Drinks Products Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're currently building our soft drinks collection. Check back soon for refreshing beverages!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 