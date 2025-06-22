import React from 'react';
import Link from 'next/link';
import { FaGlassWhiskey, FaArrowRight } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getProductsByCategory } from '@/lib/api';

const spiritSubcategories = [
  {
    id: 'whiskey',
    name: 'Whiskey',
    description: 'Premium whiskeys from around the world',
    color: 'from-amber-600 to-amber-800',
    image: '/wine.webp',
    types: ['Scotch', 'Bourbon', 'Irish', 'Japanese', 'Rye']
  },
  {
    id: 'vodka',
    name: 'Vodka', 
    description: 'Pure and smooth vodka selections',
    color: 'from-blue-400 to-blue-600',
    image: '/wine2.webp',
    types: ['Premium', 'Flavored', 'Craft', 'Russian', 'Polish']
  },
  {
    id: 'gin',
    name: 'Gin',
    description: 'Botanical gins for cocktail enthusiasts',
    color: 'from-green-400 to-green-600',
    image: '/wine3.webp',
    types: ['London Dry', 'Plymouth', 'Old Tom', 'Navy Strength']
  },
  {
    id: 'rum',
    name: 'Rum',
    description: 'Rich and flavorful rums from the Caribbean',
    color: 'from-yellow-600 to-yellow-800',
    image: '/wine4.webp',
    types: ['White', 'Gold', 'Dark', 'Spiced', 'Aged']
  },
  {
    id: 'tequila',
    name: 'Tequila',
    description: 'Authentic tequilas and mezcals from Mexico',
    color: 'from-orange-500 to-orange-700',
    image: '/wine.webp',
    types: ['Blanco', 'Reposado', 'Añejo', 'Extra Añejo', 'Mezcal']
  },
  {
    id: 'cognac',
    name: 'Cognac & Brandy',
    description: 'Refined cognacs and brandies',
    color: 'from-red-700 to-red-900',
    image: '/wine2.webp',
    types: ['VS', 'VSOP', 'XO', 'Napoleon', 'Armagnac']
  }
];

export default async function SpiritPage() {
  // Get all spirit products
  const spiritProducts = await getProductsByCategory('spirit');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaGlassWhiskey className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Spirits Collection
            </h1>
            <p className="text-xl sm:text-2xl text-amber-100 max-w-3xl mx-auto">
              Discover our premium selection of spirits from world-renowned distilleries
            </p>
            <div className="mt-8 text-lg text-amber-200">
              {spiritProducts.length} spirits available • Free delivery in Nairobi
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
                <Link href="/" className="text-gray-500 hover:text-amber-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Spirits</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Spirit Subcategories */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Spirit Categories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From aged whiskeys to smooth vodkas, find the perfect spirit for every occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {spiritSubcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/spirit/${subcategory.id}`}>
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
                        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs">
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

        {/* Quick Access to All Spirits */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Spirits</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete spirits collection
            </p>
            <Link href="/products?category=spirit">
              <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                View All {spiritProducts.length} Spirits
              </button>
            </Link>
          </div>
        </div>

        {/* Spirit Education */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Cocktail Recipes</h4>
            <p className="text-gray-600 text-sm">
              Learn to create classic cocktails with our premium spirits and expert recipes.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Tasting Notes</h4>
            <p className="text-gray-600 text-sm">
              Each spirit comes with detailed tasting profiles from our expert team.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Proper Storage</h4>
            <p className="text-gray-600 text-sm">
              Learn how to properly store your spirits to maintain their quality and flavor.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 