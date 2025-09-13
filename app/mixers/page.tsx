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
  // Get all mixer products with error handling
  let mixerProducts: any[] = [];
  try {
    mixerProducts = await getProductsByCategory('mixers');
  } catch (error) {
    console.error('Error fetching mixer products:', error);
    // Fallback to empty array to prevent page crash
    mixerProducts = [];
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-gray-100 text-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaCocktail className="w-16 h-16 mx-auto mb-6 text-black/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Mixers Collection
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Premium mixers and cocktail ingredients for perfect drinks
            </p>
            <div className="mt-8 text-lg text-black/80">
              {mixerProducts.length} mixers available • Free delivery for orders above Ksh. 3000
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

      {/* Background Image Section */}
      <div 
        className="min-h-screen bg-fixed relative"
        style={{
          backgroundImage: 'url(/resize.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Semi-transparent overlay for better text legibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        <div className="min-h-screen relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Mixer Subcategories */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Premium Mixer Selection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From tonic waters to specialty syrups, elevate your cocktail game
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mixerSubcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/mixers/${subcategory.id}`}>
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                {/* Image Header */}
                <div className="h-48 relative overflow-hidden bg-gray-100">
                  <img 
                    src={subcategory.image}
                    alt={subcategory.name}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
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
              Can't find what you're looking for? Browse our complete mixer collection
            </p>
            <Link href="/products?category=mixers">
              <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                View All {mixerProducts.length} Mixers
              </button>
            </Link>
          </div>
        </div>

        {/* Mixer Education */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-black mb-3">Cocktail Basics</h4>
            <p className="text-gray-600 text-sm">
              Learn the fundamentals of mixing perfect cocktails with quality ingredients.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-black mb-3">Mixer Guide</h4>
            <p className="text-gray-600 text-sm">
              Discover how different mixers can transform your favorite spirits.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-black mb-3">Recipe Collection</h4>
            <p className="text-gray-600 text-sm">
              Explore our curated collection of cocktail recipes using premium mixers.
            </p>
          </div>
        </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 