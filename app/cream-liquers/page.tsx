import React from 'react';
import Link from 'next/link';
import { FaWineGlass } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import { getProductsByCategory } from '@/lib/api';
import { Product } from '@/lib/types';

export default async function CreamLiqueursPage() {
  // Get all cream liqueur products with error handling
  let creamLiqueurProducts: any[] = [];
  try {
    creamLiqueurProducts = await getProductsByCategory('cream-liquers');
  } catch (error) {
    console.error('Error fetching cream liqueur products:', error);
    // Fallback to empty array to prevent page crash
    creamLiqueurProducts = [];
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-gray-100 text-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaWineGlass className="w-16 h-16 mx-auto mb-6 text-black/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Cream Liqueurs
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Smooth and indulgent cream liqueurs for dessert and cocktails
            </p>
            <div className="mt-8 text-lg text-black/80">
              {creamLiqueurProducts.length} cream liqueurs available • Free delivery for orders above Ksh. 3000
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
              <li className="text-gray-700 font-medium">Cream Liqueurs</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Background Image Section */}
      <div 
        className="min-h-screen bg-fixed relative"
        style={{
          backgroundImage: 'url(/liquer.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Semi-transparent overlay for better text legibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        <div className="min-h-screen relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Products Grid */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Premium Cream Liqueur Selection</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            From classic Irish cream to innovative flavors, discover luxurious liqueurs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creamLiqueurProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              categoryColor="bg-black"
            />
          ))}
        </div>

        {/* Quick Access to All Cream Liqueurs */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Cream Liqueurs</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete cream liqueur collection
            </p>
            <Link href="/products?category=cream-liquers">
              <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                View All {creamLiqueurProducts.length} Cream Liqueurs
              </button>
            </Link>
          </div>
        </div>

        {/* Cream Liqueur Education */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-black mb-3">Serving Tips</h4>
            <p className="text-gray-600 text-sm">
              Learn the best ways to serve and enjoy cream liqueurs at the perfect temperature.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-black mb-3">Flavor Guide</h4>
            <p className="text-gray-600 text-sm">
              Discover the unique flavor profiles and characteristics of different cream liqueurs.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-black mb-3">Cocktail Ideas</h4>
            <p className="text-gray-600 text-sm">
              Explore creative cocktail recipes that showcase cream liqueurs beautifully.
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