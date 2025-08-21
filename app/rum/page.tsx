import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { GiBottleCap } from 'react-icons/gi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductImage from '@/app/components/ProductImage';
import { getProductsByCategory } from '@/lib/api';

export default async function RumPage() {
  // Get all rum products
  const rumProducts = await getProductsByCategory('rum');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GiBottleCap className="w-20 h-20" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Premium Rum Collection
            </h1>
            <p className="text-xl sm:text-2xl text-amber-100 max-w-3xl mx-auto">
              Discover our exceptional selection of premium rums from the Caribbean and beyond
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
                <Link href="/" className="text-gray-500 hover:text-amber-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Rum</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Rum Selection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From light and crisp to dark and rich, explore our curated collection of premium rums
          </p>
        </div>

        {rumProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {rumProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                    <ProductImage
                      src={product.productImage || '/wine.webp'}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="group-hover:scale-110 transition-transform duration-500"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors capitalize">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-amber-600">
                        Ksh {product.price.toLocaleString()}/-
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
            <GiBottleCap className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Rum Products Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're currently building our rum collection. Check back soon for premium rum selections!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 