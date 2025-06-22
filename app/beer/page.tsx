import React from 'react';
import Link from 'next/link';
import { FaBeer, FaArrowRight } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getProductsByCategory } from '@/lib/api';

const beerSubcategories = [
  {
    id: 'lager',
    name: 'Lager',
    description: 'Crisp and refreshing lagers from around the world',
    color: 'from-yellow-400 to-yellow-600',
    image: '/wine.webp',
    types: ['Pilsner', 'Helles', 'Märzen', 'Bock', 'Light Lager']
  },
  {
    id: 'ale',
    name: 'Ale', 
    description: 'Rich and flavorful ales with complex profiles',
    color: 'from-orange-500 to-orange-700',
    image: '/wine2.webp',
    types: ['IPA', 'Pale Ale', 'Porter', 'Stout', 'Belgian Ale']
  },
  {
    id: 'wheat',
    name: 'Wheat Beer',
    description: 'Smooth wheat beers perfect for any season',
    color: 'from-amber-400 to-amber-600',
    image: '/wine3.webp',
    types: ['Hefeweizen', 'Witbier', 'American Wheat', 'Dunkelweizen']
  },
  {
    id: 'craft',
    name: 'Craft Beer',
    description: 'Innovative craft brews from local and international breweries',
    color: 'from-green-500 to-green-700',
    image: '/wine4.webp',
    types: ['Sour', 'Experimental', 'Seasonal', 'Limited Edition']
  },
  {
    id: 'imported',
    name: 'Imported Beer',
    description: 'Premium imported beers from renowned breweries',
    color: 'from-blue-500 to-blue-700',
    image: '/wine.webp',
    types: ['German', 'Belgian', 'Japanese', 'Mexican', 'British']
  }
];

export default async function BeerPage() {
  // Get all beer products
  const beerProducts = await getProductsByCategory('beer');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaBeer className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Beer Collection
            </h1>
            <p className="text-xl sm:text-2xl text-yellow-100 max-w-3xl mx-auto">
              Discover our extensive selection of beers from craft breweries to international favorites
            </p>
            <div className="mt-8 text-lg text-yellow-200">
              {beerProducts.length} beers available • Ice-cold delivery in Nairobi
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
                <Link href="/" className="text-gray-500 hover:text-yellow-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Beer</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Beer Subcategories */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Beer Categories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From crisp lagers to bold ales, find the perfect beer for every taste and occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beerSubcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/beer/${subcategory.id}`}>
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
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
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

        {/* Quick Access to All Beers */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Beers</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete beer collection
            </p>
            <Link href="/products?category=beer">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                View All {beerProducts.length} Beers
              </button>
            </Link>
          </div>
        </div>

        {/* Beer Education */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Beer & Food Pairing</h4>
            <p className="text-gray-600 text-sm">
              Learn how to pair different beer styles with various cuisines and dishes.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Brewing Process</h4>
            <p className="text-gray-600 text-sm">
              Discover how your favorite beers are crafted from grain to glass.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Serving Tips</h4>
            <p className="text-gray-600 text-sm">
              Learn the optimal serving temperatures and glassware for each beer style.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 