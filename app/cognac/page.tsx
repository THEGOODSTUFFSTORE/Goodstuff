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
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  
                  {/* Premium badge */}
                  <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    PREMIUM
                  </div>
                  
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent group-hover:from-amber-50/20 group-hover:to-orange-50/20 transition-all duration-500"></div>
                    <img 
                      src={product.productImage || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 drop-shadow-sm group-hover:drop-shadow-xl"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="relative p-6 bg-gradient-to-br from-white via-gray-50/30 to-white">
                    <div className="mb-3">
                      <span className="inline-block bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                        Premium Cognac
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors capitalize leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent lowercase">
                        KES {product.price.toLocaleString()}
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