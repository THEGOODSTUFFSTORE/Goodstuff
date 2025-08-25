import React from 'react';
import Link from 'next/link';
import { FaCocktail, FaArrowLeft } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getProductsByCategory } from '@/lib/api';

interface MixersTypePageProps {
  params: Promise<{
    subcategory: string;
    type: string;
  }>;
}

export default async function MixersTypePage({ params }: MixersTypePageProps) {
  const { subcategory, type } = await params;
  
  // Fetch only mixer products from Contentful
  const mixerProducts = await getProductsByCategory('mixers');
  
  // Filter products by exact subcategory and type matching
  const typeProducts = mixerProducts.filter(product => {
    const normalizedSubcategory = product.subcategory?.toLowerCase().replace(/\s+/g, '-');
    const normalizedType = type.toLowerCase();
    
    // Match by subcategory if it matches the type parameter
    return normalizedSubcategory === normalizedType ||
           product.subcategory?.toLowerCase().includes(type.replace(/-/g, ' '));
  });

  // Simple mixer type display name
  const mixerTypeName = type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-gray-100 text-black py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href={`/mixers/${subcategory}`} className="flex items-center text-black/80 hover:text-black transition-colors mr-4">
              <FaArrowLeft className="w-5 h-5 mr-2" />
              Back to {subcategory}
            </Link>
          </div>
          <div className="flex items-center">
            <div className="mr-6">
              <FaCocktail className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{mixerTypeName}</h1>
              <p className="text-xl text-black/90">Premium {type.replace(/-/g, ' ')} mixers</p>
              <div className="mt-4 text-lg text-black/80">{typeProducts.length} mixers available</div>
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
              <li className="flex items-center">
                <Link href="/mixers" className="text-gray-500 hover:text-black transition-colors">Mixers</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <Link href={`/mixers/${subcategory}`} className="text-gray-500 hover:text-black transition-colors">
                  {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">{mixerTypeName}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{mixerTypeName} Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium {type.replace(/-/g, ' ')} mixers
          </p>
        </div>

        {typeProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typeProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                  <div className="relative bg-gray-50 p-6 h-64 flex items-center justify-center">
                    <img 
                      src={product.productImage} 
                      alt={product.name}
                      className="max-w-full max-h-full object-contain hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 capitalize">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="text-xl font-bold text-blue-600 lowercase">{product.price.toLocaleString()}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No mixers found</h3>
            <p className="text-gray-600 mb-8">
              We don't have any {mixerTypeName.toLowerCase()} in stock right now, but we're constantly adding new mixers to our collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/mixers/${subcategory}`}>
                <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Browse Other {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Mixers
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Access to All Mixers */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Mixers</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete mixer collection
            </p>
            <Link href="/mixers">
              <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                View All Mixers
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 