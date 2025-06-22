import React from 'react';
import Link from 'next/link';
import { FaCocktail, FaArrowRight } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getProductsByCategory } from '@/lib/api';

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
    types: ['Club Soda', 'Sparkling Water', 'Ginger Ale', 'Lemon-Lime']
  },
  {
    id: 'juice',
    name: 'Juices',
    description: 'Fresh and premium juices for cocktails',
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

export default async function MixersPage() {
  // Get all mixer products
  const mixerProducts = await getProductsByCategory('mixers');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaCocktail className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Mixers & Cocktail Essentials
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
              Complete your home bar with premium mixers, bitters, and cocktail essentials
            </p>
            <div className="mt-8 text-lg text-blue-200">
              {mixerProducts.length} mixers available • Perfect for cocktail crafting
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
                <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Mixers</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Mixer Subcategories */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Mixer Categories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From premium tonics to essential bitters, everything you need for perfect cocktails
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mixerSubcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/mixers/${subcategory.id}`}>
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                {/* Image Header */}
                <div className={`bg-gradient-to-br ${subcategory.color} h-48 relative overflow-hidden`}>
                  <img 
                    src={subcategory.image}
                    alt={subcategory.name}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-3xl font-bold text-white text-center">{subcategory.name}</h3>
                  </div>
                  <div className="absolute top-4 right-4">
                    <FaArrowRight className="text-white w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{subcategory.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Popular Types:</h4>
                    <div className="flex flex-wrap gap-2">
                      {subcategory.types.slice(0, 3).map((type, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                          {type}
                        </span>
                      ))}
                      {subcategory.types.length > 3 && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                          +{subcategory.types.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Explore Collection</span>
                    <FaArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Access to All Mixers */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Mixers</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete mixers collection
            </p>
            <Link href="/products?category=mixers">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                View All {mixerProducts.length} Mixers
              </button>
            </Link>
          </div>
        </div>

        {/* Mixers Education */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Cocktail Recipes</h4>
            <p className="text-gray-600 text-sm">
              Learn classic and modern cocktail recipes using our premium mixers.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Bar Setup Guide</h4>
            <p className="text-gray-600 text-sm">
              Essential tips for setting up your home bar with the right mixers.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Mixing Techniques</h4>
            <p className="text-gray-600 text-sm">
              Master the art of cocktail making with proper mixing techniques.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 