import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { GiWineBottle } from 'react-icons/gi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getProductsByCategory } from '@/lib/api';

export default async function CognacPage() {
  // Get all cognac products
  const cognacProducts = await getProductsByCategory('cognac');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-700 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GiWineBottle className="w-20 h-20" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Premium Cognac Collection
            </h1>
            <p className="text-xl sm:text-2xl text-amber-100 max-w-3xl mx-auto">
              Experience the finest French cognacs from prestigious houses and boutique distilleries
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
              <li className="text-gray-700 font-medium">Cognac</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Cognac Selection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From VS to XO, discover our curated collection of exceptional French cognacs
          </p>
        </div>

        {cognacProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {cognacProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="relative group bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden border border-gray-100 hover:border-amber-200">
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gray-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  

                  
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <div className="absolute inset-0 bg-gray-100/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <img 
                      src={product.productImage || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 drop-shadow-sm group-hover:drop-shadow-xl"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="relative p-6 bg-white">
                    <div className="mb-3">
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                        Premium Cognac
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-600 transition-colors capitalize leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900 lowercase">
                        {product.price.toLocaleString()}/=
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
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
            <GiWineBottle className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Cognac Products Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're currently building our cognac collection. Check back soon for premium French cognacs!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 