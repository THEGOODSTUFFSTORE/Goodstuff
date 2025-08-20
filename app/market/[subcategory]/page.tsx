import React from 'react';
import Link from 'next/link';
import { FaStore, FaArrowLeft } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import AddToBasketButton from '@/app/components/AddToBasketButton';
import { getProducts } from '@/lib/api';

interface MarketSubcategoryPageProps {
  params: Promise<{
    subcategory: string;
  }>;
}

const subcategoryInfo: { [key: string]: any } = {
  merchandise: {
    name: 'Merchandise',
    description: 'Exclusive branded merchandise and accessories',
    color: 'from-blue-500 to-blue-700'
  },
  'nicotine-pouches': {
    name: 'Nicotine Pouches',
    description: 'Premium nicotine pouches in various flavors and strengths',
    color: 'from-gray-500 to-gray-700'
  },
  vapes: {
    name: 'Vapes',
    description: 'High-quality vaping devices and accessories',
    color: 'from-purple-600 to-purple-800'
  },
  lighters: {
    name: 'Lighters',
    description: 'Premium lighters and fire accessories',
    color: 'from-red-500 to-red-700'
  },
  cigars: {
    name: 'Cigars',
    description: 'Fine cigars and smoking accessories',
    color: 'from-amber-600 to-amber-800'
  },
  'soft-drinks': {
    name: 'Soft Drinks',
    description: 'Refreshing beverages and non-alcoholic drinks',
    color: 'from-cyan-500 to-blue-600'
  }
};

export default async function MarketSubcategoryPage({ params }: MarketSubcategoryPageProps) {
  const { subcategory } = await params;
  
  // Get all market products and filter by subcategory
  const allProducts = await getProducts();
  const subcategoryProducts = allProducts.filter(product => 
    product.category.toLowerCase() === 'market' &&
    (product.subcategory.toLowerCase().includes(subcategory.toLowerCase()) ||
     product.subcategory.toLowerCase().replace(/\s+/g, '').includes(subcategory.toLowerCase()))
  );

  const subcategoryData = subcategoryInfo[subcategory] || {
    name: subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
    description: `Premium ${subcategory} products`,
    color: 'from-green-500 to-green-600'
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${subcategoryData.color} text-white py-16`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/market" className="flex items-center text-white/80 hover:text-white transition-colors mr-4">
              <FaArrowLeft className="w-5 h-5 mr-2" />
              Back to Market
            </Link>
          </div>
          <div className="flex items-center">
            <div className="mr-6">
              <FaStore className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                {subcategoryData.name}
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 max-w-3xl">
                {subcategoryData.description}
              </p>
              <div className="mt-4 text-lg text-white/80">
                {subcategoryProducts.length} products available
              </div>
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
                <Link href="/" className="text-gray-500 hover:text-green-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <Link href="/market" className="text-gray-500 hover:text-green-600 transition-colors">Market</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">{subcategoryData.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
              All {subcategoryData.name} ({subcategoryProducts.length})
            </h2>
            <div className="flex items-center space-x-4">
              <label htmlFor="sort" className="text-gray-700 font-medium">Sort by:</label>
              <select 
                id="sort" 
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {subcategoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subcategoryProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
                    <div className="relative bg-gray-50 p-6 h-64 flex items-center justify-center">
                      <img 
                        src={product.productImage} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Premium
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors capitalize">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-green-600 lowercase">
                          {product.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-4">
                        <AddToBasketButton 
                          productId={product.id} 
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FaStore className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No {subcategoryData.name} Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We don't have any {subcategoryData.name.toLowerCase()} in stock right now, but we're constantly adding new products to our collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/market">
                  <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Browse Other Market Categories
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
} 