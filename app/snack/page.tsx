import React from 'react';
import Link from 'next/link';
import { FaCookie, FaArrowRight } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getProductsByCategory } from '@/lib/api';

const snackSubcategories = [
  {
    id: 'nuts',
    name: 'Nuts & Seeds',
    description: 'Premium nuts and seeds perfect for snacking',
    color: 'from-yellow-600 to-yellow-800',
    image: '/wine.webp',
    types: ['Almonds', 'Cashews', 'Pistachios', 'Mixed Nuts', 'Trail Mix']
  },
  {
    id: 'chips',
    name: 'Chips & Crisps', 
    description: 'Crunchy chips and artisanal crisps',
    color: 'from-orange-500 to-orange-700',
    image: '/wine2.webp',
    types: ['Potato Chips', 'Tortilla Chips', 'Vegetable Chips', 'Pita Chips']
  },
  {
    id: 'chocolate',
    name: 'Chocolate & Sweets',
    description: 'Indulgent chocolates and sweet treats',
    color: 'from-brown-600 to-brown-800',
    image: '/wine3.webp',
    types: ['Dark Chocolate', 'Milk Chocolate', 'Truffles', 'Gummies', 'Bars']
  },
  {
    id: 'cheese',
    name: 'Cheese & Crackers',
    description: 'Artisanal cheeses and gourmet crackers',
    color: 'from-amber-500 to-amber-700',
    image: '/wine4.webp',
    types: ['Aged Cheese', 'Soft Cheese', 'Artisan Crackers', 'Biscuits']
  },
  {
    id: 'jerky',
    name: 'Jerky & Dried Meats',
    description: 'High-protein jerky and dried meat snacks',
    color: 'from-red-600 to-red-800',
    image: '/wine.webp',
    types: ['Beef Jerky', 'Turkey Jerky', 'Biltong', 'Dried Sausage']
  },
  {
    id: 'healthy',
    name: 'Healthy Snacks',
    description: 'Nutritious and wholesome snacking options',
    color: 'from-green-500 to-green-700',
    image: '/wine2.webp',
    types: ['Protein Bars', 'Granola', 'Dried Fruit', 'Rice Cakes']
  }
];

export default async function SnackPage() {
  // Get all snack products
  const snackProducts = await getProductsByCategory('snack');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaCookie className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Gourmet Snacks
            </h1>
            <p className="text-xl sm:text-2xl text-orange-100 max-w-3xl mx-auto">
              Discover our curated selection of premium snacks perfect for any occasion
            </p>
            <div className="mt-8 text-lg text-orange-200">
              {snackProducts.length} snacks available • Perfect for entertaining
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
                <Link href="/" className="text-gray-500 hover:text-orange-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Snacks</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Snack Subcategories */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Snack Categories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From healthy nuts to indulgent chocolates, find the perfect snacks for every craving
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {snackSubcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/snack/${subcategory.id}`}>
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
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
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

        {/* Quick Access to All Snacks */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Snacks</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete snacks collection
            </p>
            <Link href="/products?category=snack">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                View All {snackProducts.length} Snacks
              </button>
            </Link>
          </div>
        </div>

        {/* Snack Education */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Pairing Guide</h4>
            <p className="text-gray-600 text-sm">
              Learn how to pair snacks with wines, beers, and spirits for the perfect combination.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Nutritional Info</h4>
            <p className="text-gray-600 text-sm">
              Detailed nutritional information for all our snack products.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Storage Tips</h4>
            <p className="text-gray-600 text-sm">
              Keep your snacks fresh with proper storage techniques and tips.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 