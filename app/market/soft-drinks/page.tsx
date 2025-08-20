import React from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { GiSodaCan } from 'react-icons/gi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getProducts } from '@/lib/api';

export default async function SoftDrinksPage() {
  // Get all market products and filter by soft drinks subcategory
  const allProducts = await getProducts();
  const softDrinksProducts = allProducts.filter(product => 
    product.category.toLowerCase() === 'market' &&
    product.subcategory.toLowerCase().includes('soft-drinks')
  );

  const types = ['Sodas', 'Juices', 'Energy Drinks', 'Water'];

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

      {/* Product Types */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Soft Drinks Categories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our variety of refreshing beverages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {types.map((type) => (
            <Link key={type} href={`/market/soft-drinks/${type.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-6">
                <div className="text-center">
                  <GiSodaCan className="w-12 h-12 text-cyan-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{type}</h3>
                  <FaArrowRight className="w-4 h-4 text-gray-400 mx-auto group-hover:text-cyan-500 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">All Soft Drinks</h2>
        </div>

        {softDrinksProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {softDrinksProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img 
                      src={product.productImage || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-cyan-600">
                        {product.price.toLocaleString()}/=
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.volume}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
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