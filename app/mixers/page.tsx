"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCocktail, FaArrowRight } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';

const mixerSubcategories = [
  {
    id: 'tonic',
    name: 'Tonic Water',
    description: 'Premium tonic waters for perfect gin & tonics',
    color: 'from-blue-400 to-blue-600',
    image: '/wine.webp',
    types: ['Classic', 'Diet', 'Elderflower', 'Mediterranean', 'Indian']
  },
  {
    id: 'soda',
    name: 'Soda Water', 
    description: 'Sparkling waters and sodas for cocktails',
    color: 'from-green-400 to-green-600',
    image: '/wine2.webp',
    types: ['Club Soda', 'Seltzer', 'Sparkling Water', 'Ginger Ale', 'Cola']
  },
  {
    id: 'juice',
    name: 'Juices & Mixers',
    description: 'Fresh juices and cocktail mixers',
    color: 'from-orange-400 to-orange-600',
    image: '/wine3.webp',
    types: ['Cranberry', 'Orange', 'Lime', 'Grapefruit', 'Pineapple']
  },
  {
    id: 'bitters',
    name: 'Bitters & Syrups',
    description: 'Essential bitters and syrups for cocktail crafting',
    color: 'from-red-500 to-red-700',
    image: '/wine4.webp',
    types: ['Angostura', 'Orange', 'Simple Syrup', 'Grenadine', 'Orgeat']
  },
  {
    id: 'garnish',
    name: 'Garnishes',
    description: 'Perfect finishing touches for your cocktails',
    color: 'from-purple-500 to-purple-700',
    image: '/wine.webp',
    types: ['Olives', 'Cherries', 'Citrus', 'Herbs', 'Salts']
  }
];

export default function MixersPage() {
  const [mixerProducts, setMixerProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMixerProducts = async () => {
      setIsLoading(true);
      try {
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef,
          where('category', '==', 'mixers'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setMixerProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching mixer products:', error);
        setMixerProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMixerProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-teal-100 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <FaCocktail className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              Mixers & Cocktail Essentials
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Everything you need to craft the perfect cocktail
            </p>
            <div className="mt-8 text-lg text-black/80">
              {isLoading ? 'Loading...' : `${mixerProducts.length} mixers available`} • Free delivery for orders above Ksh. 3000
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
              <li className="text-gray-700 font-medium">Mixers</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect mixers and cocktail essentials for your home bar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mixerSubcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/mixers/${subcategory.id}`}
                className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className={`h-48 bg-gradient-to-br ${subcategory.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">{subcategory.name}</h3>
                      <p className="text-sm opacity-90">{subcategory.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        {subcategory.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{subcategory.description}</p>
                    </div>
                    <FaArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {subcategory.types.slice(0, 3).map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                      {subcategory.types.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{subcategory.types.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      {!isLoading && mixerProducts.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Mixers</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our most popular mixers and cocktail essentials
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mixerProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4">
                  <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product.productImage || '/wine.webp'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-green-600 font-bold text-lg">Ksh {product.price.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/products?category=mixers"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                View All Mixers
                <FaArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading mixers...</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}