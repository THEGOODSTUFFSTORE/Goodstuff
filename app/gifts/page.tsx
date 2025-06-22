import React from 'react';
import Link from 'next/link';
import { FaGift, FaArrowRight } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getProductsByCategory } from '@/lib/api';

const giftSubcategories = [
  {
    id: 'sets',
    name: 'Gift Sets',
    description: 'Curated gift sets for every occasion',
    color: 'from-purple-600 to-purple-800',
    image: '/wine.webp',
    types: ['Wine Sets', 'Spirit Sets', 'Beer Sets', 'Mixed Sets', 'Tasting Sets']
  },
  {
    id: 'accessories',
    name: 'Bar Accessories', 
    description: 'Essential tools for the home bartender',
    color: 'from-gray-600 to-gray-800',
    image: '/wine2.webp',
    types: ['Cocktail Shakers', 'Wine Openers', 'Glassware', 'Decanters', 'Bar Tools']
  },
  {
    id: 'corporate',
    name: 'Corporate Gifts',
    description: 'Professional gifts for business occasions',
    color: 'from-blue-700 to-blue-900',
    image: '/wine3.webp',
    types: ['Executive Sets', 'Branded Items', 'Premium Bottles', 'Gift Vouchers']
  },
  {
    id: 'occasion',
    name: 'Occasion Gifts',
    description: 'Perfect gifts for special celebrations',
    color: 'from-pink-500 to-pink-700',
    image: '/wine4.webp',
    types: ['Birthday', 'Anniversary', 'Wedding', 'Graduation', 'Retirement']
  },
  {
    id: 'luxury',
    name: 'Luxury Gifts',
    description: 'Premium and luxury gift options',
    color: 'from-yellow-600 to-yellow-800',
    image: '/wine.webp',
    types: ['Rare Bottles', 'Limited Editions', 'Vintage Collection', 'Premium Sets']
  },
  {
    id: 'personalized',
    name: 'Personalized Gifts',
    description: 'Custom and personalized gift options',
    color: 'from-green-600 to-green-800',
    image: '/wine2.webp',
    types: ['Engraved Bottles', 'Custom Labels', 'Monogrammed Items', 'Photo Gifts']
  }
];

export default async function GiftsPage() {
  // Get all gift products
  const giftProducts = await getProductsByCategory('gifts');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaGift className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Premium Gifts
            </h1>
            <p className="text-xl sm:text-2xl text-purple-100 max-w-3xl mx-auto">
              Discover the perfect gift for any occasion with our curated collection
            </p>
            <div className="mt-8 text-lg text-purple-200">
              {giftProducts.length} gifts available • Elegant gift wrapping included
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
                <Link href="/" className="text-gray-500 hover:text-purple-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Gifts</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Gift Subcategories */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Gift Categories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From curated sets to personalized items, find the perfect gift for every special person
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {giftSubcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/gifts/${subcategory.id}`}>
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
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
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

        {/* Quick Access to All Gifts */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Gifts</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete gifts collection
            </p>
            <Link href="/products?category=gifts">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                View All {giftProducts.length} Gifts
              </button>
            </Link>
          </div>
        </div>

        {/* Gift Services */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Gift Wrapping</h4>
            <p className="text-gray-600 text-sm">
              Complimentary elegant gift wrapping available for all gift purchases.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Personal Messages</h4>
            <p className="text-gray-600 text-sm">
              Add a personal touch with custom messages and greeting cards.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Direct Delivery</h4>
            <p className="text-gray-600 text-sm">
              Send gifts directly to recipients with our reliable delivery service.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 