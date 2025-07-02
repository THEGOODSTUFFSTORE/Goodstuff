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
      
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href={`/mixers/${subcategory}`} className="flex items-center text-white/80 hover:text-white transition-colors mr-4">
              <FaArrowLeft className="w-5 h-5 mr-2" />
              Back to {subcategory}
            </Link>
          </div>
          <div className="flex items-center">
            <FaCocktail className="w-12 h-12 mr-6" />
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{mixerTypeName}</h1>
              <p className="text-xl text-white/90">Premium {type.replace(/-/g, ' ')} mixers</p>
              <div className="mt-4 text-lg text-white/80">{typeProducts.length} mixers available</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <Link href="/mixers" className="text-gray-500 hover:text-blue-600 transition-colors">Mixers</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <Link href={`/mixers/${subcategory}`} className="text-gray-500 hover:text-blue-600 transition-colors">
                  {subcategory}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">{mixerTypeName}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {typeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="text-2xl font-bold text-blue-600">Ksh {product.price.toLocaleString()}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No {mixerTypeName} Available</h3>
            <p className="text-gray-600 mb-8">We don't have any {mixerTypeName.toLowerCase()} mixers in stock right now.</p>
            <Link href={`/mixers/${subcategory}`}>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Browse Other Types
              </button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 