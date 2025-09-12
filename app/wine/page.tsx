import React from 'react';
import Link from 'next/link';
import { FaWineGlassAlt, FaArrowRight } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getProducts } from '@/lib/api';

const wineSubcategories = [
  {
    id: 'red',
    name: 'Red',
    description: 'Bold and rich red wines from around the world',
    image: '/Red-wine.jpg',
    types: ['Pinot Noir', 'Shiraz']
  },
  {
    id: 'white',
    name: 'White', 
    description: 'Crisp and refreshing white wines',
    image: '/white-wine2.webp',
    types: ['Chardonnay', 'Pinot Grigio', 'Riesling']
  },
  {
    id: 'rose',
    name: 'Rosé',
    description: 'Elegant pink wines perfect for any occasion',
    image: '/rose-wine.jpg',
    types: ['Provence Rosé', 'Spanish Rosado', 'Italian Rosato', 'Grenache Rosé']
  },
  
  {
    id: 'champagne',
    name: 'Champagne',
    description: 'Premium sparkling wine from the Champagne region',
    image: '/champagne.jpg',
    types: ['Brut', 'Extra Brut', 'Rosé Champagne', 'Vintage Champagne']
  }
];

export default async function WinePage() {
  // Get all wine products
  const allProducts = await getProducts();
  const wineProducts = allProducts.filter(product => 
    product.category.toLowerCase() === 'wine'
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white text-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaWineGlassAlt className="w-16 h-16 mx-auto mb-6 text-black/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Wine Collection
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Discover our curated selection of premium wines from renowned vineyards around the world
            </p>
            <div className="mt-8 text-lg text-black/80">
              {wineProducts.length} wines available • Free delivery for orders above Ksh. 3000
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
              <li className="text-gray-700 font-medium">Wine</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Background Image Section */}
      <div 
        className="min-h-screen bg-fixed relative"
        style={{
          backgroundImage: 'url(/wine.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Semi-transparent overlay for better text legibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        <div className="min-h-screen relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Wine Subcategories */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Explore Wine Categories</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            From bold reds to crisp whites, discover the perfect wine for every palate and occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wineSubcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/wine/${subcategory.id}`}>
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

        {/* Quick Access to All Wines */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Wines</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete wine collection
            </p>
            <Link href="/products?category=wine">
              <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-xl transition-colors">
                View All {wineProducts.length} Wines
              </button>
            </Link>
          </div>
        </div>

        {/* Wine Education */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Wine & Food Pairing</h4>
            <p className="text-gray-600 text-sm">
              Learn how to pair our wines with different cuisines for the perfect dining experience.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Tasting Notes</h4>
            <p className="text-gray-600 text-sm">
              Each wine comes with detailed tasting notes from our expert sommeliers.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h4 className="text-xl font-bold text-gray-900 mb-3">Storage Tips</h4>
            <p className="text-gray-600 text-sm">
              Proper storage ensures your wine maintains its quality and flavor profile.
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