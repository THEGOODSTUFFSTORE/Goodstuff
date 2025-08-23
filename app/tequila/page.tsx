import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { GiMartini } from 'react-icons/gi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import { getProductsByCategory } from '@/lib/api';
import { Product } from '@/lib/types';

export default async function TequilaPage() {
  // Get all tequila products
  const tequilaProducts = await getProductsByCategory('tequila');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GiMartini className="w-20 h-20" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Premium Tequila Collection
            </h1>
            <p className="text-xl sm:text-2xl text-yellow-100 max-w-3xl mx-auto">
              Explore our authentic selection of premium tequilas from Mexico's finest distilleries
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
                <Link href="/" className="text-gray-500 hover:text-yellow-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Tequila</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Tequila Selection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From blanco to añejo, discover our curated collection of authentic Mexican tequilas
          </p>
        </div>

        {tequilaProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tequilaProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryLabel="Tequila"
                categoryColor="bg-yellow-500"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <GiMartini className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Tequila Products Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're currently building our tequila collection. Check back soon for premium Mexican tequilas!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 