import React from 'react';
import Link from 'next/link';
import { FaWineGlassAlt, FaWineGlass, FaBeer, FaGlassCheers } from 'react-icons/fa';
import { GiWineBottle, GiBottleCap, GiMartini, GiCampfire } from 'react-icons/gi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const categories = [
  {
    id: 'wine',
    name: 'Wine',
    description: 'Premium wines from around the world',
    icon: <FaWineGlassAlt className="w-12 h-12" />,
    color: 'from-red-500 to-red-600',
    subcategories: ['Red Wine', 'White Wine', 'Rosé', 'Sparkling Wine', 'Dessert Wine']
  },
  {
    id: 'whiskey',
    name: 'Whiskey & Bourbon',
    description: 'Fine whiskeys and premium bourbons',
    icon: <FaWineGlass className="w-12 h-12" />,
    color: 'from-amber-500 to-amber-600',
    subcategories: ['Scotch Whisky', 'Irish Whiskey', 'American Whisky', 'Rye Whiskey', 'Japanese Whisky']
  },
  {
    id: 'spirits',
    name: 'Spirits & Liqueurs',
    description: 'Premium spirits and exotic liqueurs',
    icon: <GiBottleCap className="w-12 h-12" />,
    color: 'from-blue-500 to-blue-600',
    subcategories: ['Vodka', 'Gin', 'Liqueurs']
  },
  {
    id: 'rum',
    name: 'Rum',
    description: 'Premium rums from the Caribbean and beyond',
    icon: <GiBottleCap className="w-12 h-12" />,
    color: 'from-amber-600 to-yellow-500',
    subcategories: ['White Rum', 'Dark Rum', 'Spiced Rum', 'Premium Aged']
  },
  {
    id: 'tequila',
    name: 'Tequila',
    description: 'Authentic Mexican tequilas and mezcals',
    icon: <GiMartini className="w-12 h-12" />,
    color: 'from-yellow-500 to-orange-400',
    subcategories: ['Blanco', 'Reposado', 'Añejo', 'Mezcal']
  },
  {
    id: 'cider',
    name: 'Cider',
    description: 'Refreshing apple ciders and fruit beverages',
    icon: <GiBottleCap className="w-12 h-12" />,
    color: 'from-green-400 to-yellow-300',
    subcategories: ['Traditional Cider', 'Flavored Cider', 'Sparkling Cider']
  },
  {
    id: 'cognac',
    name: 'Cognac',
    description: 'Exceptional French cognacs and brandies',
    icon: <GiWineBottle className="w-12 h-12" />,
    color: 'from-amber-700 to-orange-600',
    subcategories: ['VS', 'VSOP', 'XO', 'Premium Blends']
  },
  {
    id: 'beer',
    name: 'Beer & Ales',
    description: 'Craft beers and international favorites',
    icon: <FaBeer className="w-12 h-12" />,
    color: 'from-yellow-500 to-yellow-600',
    subcategories: ['Lager', 'IPA', 'Stout', 'Pilsner', 'Wheat Beer']
  },
  {
    id: 'market',
    name: 'Market',
    description: 'Diverse selection of specialty products',
    icon: <GiCampfire className="w-12 h-12" />,
    color: 'from-blue-500 to-green-500',
    subcategories: ['Merchandise', 'Nicotine Pouches', 'Vapes', 'Lighters', 'Cigars', 'Soft Drinks']
  }
];

export default function Categories() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Our Categories
            </h1>
            <p className="text-xl sm:text-2xl text-red-100 max-w-3xl mx-auto">
              Discover our curated selection of premium wines, spirits, and beverages from around the world
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
                <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Categories</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                {/* Category Header */}
                <div className={`bg-gradient-to-br ${category.color} p-8 text-white relative`}>
                  <div className="absolute top-4 right-4 opacity-20">
                    <div className="text-6xl">
                      {category.icon}
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="mb-4 text-white">
                      {category.icon}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                    <p className="text-white/90">{category.description}</p>
                  </div>
                </div>

                {/* Subcategories */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Subcategories:</h3>
                  <div className="space-y-2">
                    {category.subcategories.map((sub, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-gray-700">{sub}</span>
                        <span className="text-xs text-gray-400">→</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="px-6 pb-6">
                  <Link href={category.id === 'wine' ? '/wine' : `/category/${category.id}`}>
                    <button className={`w-full bg-gradient-to-r ${category.color} text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                      Browse {category.name}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Shop by Category?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <GiWineBottle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Selection</h3>
                <p className="text-gray-600">Each category features hand-picked products from trusted producers worldwide.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaGlassCheers className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Recommendations</h3>
                <p className="text-gray-600">Our sommelier team provides detailed tasting notes and pairing suggestions.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <GiCampfire className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfect for Every Occasion</h3>
                <p className="text-gray-600">From intimate dinners to grand celebrations, find the perfect beverage for any moment.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-xl text-red-100 mb-6">
              Our expert team is here to help you find the perfect beverage for any occasion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-white text-red-600 font-semibold py-3 px-8 rounded-xl hover:bg-red-50 transition-colors">
                  Contact Our Experts
                </button>
              </Link>
              <Link href="/products">
                <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-red-600 transition-colors">
                  Browse All Products
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
