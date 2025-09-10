import React from 'react';
import Link from 'next/link';
import { FaStore, FaArrowRight } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getProductsByCategory } from '@/lib/api';

const marketSubcategories = [
  {
    id: 'merchandise',
    name: 'Merchandise',
    description: 'Exclusive branded merchandise and accessories',
    color: 'from-blue-500 to-blue-700',
    image: '/merch.jpg',
    types: ['T-Shirts', 'Caps', 'Accessories', 'Collectibles']
  },
  {
    id: 'nicotine-pouches',
    name: 'Nicotine pouches',
    description: 'Premium nicotine pouches in various flavors and strengths',
    color: 'from-gray-500 to-gray-700',
    image: '/pouche.jpeg',
    types: ['Mint', 'Citrus', 'Berry', 'Original']
  },
  {
    id: 'vapes',
    name: 'Vapes',
    description: 'High-quality vaping devices and accessories',
    color: 'from-purple-600 to-purple-800',
    image: '/vapes.webp',
    types: ['Disposable', 'Pod Systems', 'E-liquids', 'Accessories']
  },
  {
    id: 'lighters',
    name: 'Lighters',
    description: 'Premium lighters and fire accessories',
    color: 'from-red-500 to-red-700',
    image: '/lighters.webp',
    types: ['Torch Lighters', 'Classic Lighters', 'Premium Brands', 'Accessories']
  },
  {
    id: 'cigars',
    name: 'Cigars',
    description: 'Fine cigars and smoking accessories',
    color: 'from-amber-600 to-amber-800',
    image: '/cigar.jpg',
    types: ['Premium Cigars', 'Cigarillos', 'Humidors', 'Cutters']
  },
  {
    id: 'soft-drinks',
    name: 'Soft Drinks',
    description: 'Refreshing beverages and non-alcoholic drinks',
    color: 'from-cyan-500 to-blue-600',
    image: '/hero.jpg',
    types: ['Sodas', 'Juices', 'Energy Drinks', 'Water']
  }
];

export default async function MarketPage() {
  // Get all market products
  const marketProducts = await getProductsByCategory('market');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-gray-100 text-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaStore className="w-16 h-16 mx-auto mb-6 text-black/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              The Goodstuff 
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
            Discover exclusive market finds, nicotine pouches, vapes, lighters, cigars, and soft drinks.
            </p>
            <div className="mt-8 text-lg text-black/80">
              {marketProducts.length} products available
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
              <li className="text-gray-700 font-medium">Market</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Background Image Section */}
      <div 
        className="min-h-screen bg-fixed relative"
        style={{
          backgroundImage: 'url(/tequilla.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Semi-transparent overlay for better text legibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        <div className="min-h-screen relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Market Subcategories */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore variety of our Products</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover a curated selection of  premium cigars, nicotine pouches, vapes, lighters, cigars, and soft drinks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {marketSubcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/market/${subcategory.id}`}>
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
                  
                 

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Explore Collection</span>
                    <FaArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Access to All Market Items */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Market Items</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete market collection
            </p>
            <Link href="/products?category=market">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                View All {marketProducts.length} Products
              </button>
            </Link>
          </div>
        </div>

        {/* Market Services */}
        </div>
      </div>
      </div>

      <Footer />
    </div>
  );
} 