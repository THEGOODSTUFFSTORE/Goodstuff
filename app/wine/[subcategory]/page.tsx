import React from 'react';
import Link from 'next/link';
import { FaWineGlassAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import AddToBasketButton from '@/app/components/AddToBasketButton';
import { getProducts } from '@/lib/api';
import { capitalizeProductName } from '@/lib/utils';

interface WineSubcategoryPageProps {
  params: Promise<{
    subcategory: string;
  }>;
}

const subcategoryInfo: { [key: string]: any } = {
  red: {
    name: 'Red Wine',
    description: 'Bold and rich red wines from around the world'
  },
  white: {
    name: 'White Wine',
    description: 'Crisp and refreshing white wines'
  },
  rose: {
    name: 'Rosé Wine',
    description: 'Elegant pink wines perfect for any occasion'
  },
  'cabernet-sauvignon': {
    name: 'Cabernet Sauvignon',
    description: 'Full-bodied red wine with rich dark fruit flavors'
  },
  'sauvignon-blanc': {
    name: 'Sauvignon Blanc',
    description: 'Crisp white wine with citrus and herbal notes'
  },
  merlot: {
    name: 'Merlot',
    description: 'Smooth and medium-bodied red wine'
  },
  champagne: {
    name: 'Champagne',
    description: 'Premium sparkling wine from the Champagne region'
  },
  // Legacy support for old routes
  redwine: {
    name: 'Red Wine',
    description: 'Bold and rich red wines from around the world'
  },
  whitewine: {
    name: 'White Wine',
    description: 'Crisp and refreshing white wines'
  },
  rosewine: {
    name: 'Rosé Wine',
    description: 'Elegant pink wines perfect for any occasion'
  },
  sparklingwine: {
    name: 'Sparkling Wine',
    description: 'Celebrate with bubbles and effervescence'
  },
  dessertwine: {
    name: 'Dessert Wine',
    description: 'Sweet wines perfect for dessert pairings'
  }
};

export default async function WineSubcategoryPage({ params }: WineSubcategoryPageProps) {
  const { subcategory } = await params;
  
  // Get all wine products and filter by subcategory
  const allProducts = await getProducts();
  const subcategoryProducts = allProducts.filter(product => {
    if (product.category.toLowerCase() !== 'wine') return false;
    
    const productSubcategory = product.subcategory?.toLowerCase() || '';
    const searchSubcategory = subcategory.toLowerCase();
    
    // Direct match
    if (productSubcategory === searchSubcategory) return true;
    
    // Match without spaces/hyphens
    if (productSubcategory.replace(/[\s-]/g, '') === searchSubcategory.replace(/[\s-]/g, '')) return true;
    
    // Match for specific wine types
    if (searchSubcategory === 'red' && productSubcategory.includes('red')) return true;
    if (searchSubcategory === 'white' && productSubcategory.includes('white')) return true;
    if (searchSubcategory === 'rose' && (productSubcategory.includes('rose') || productSubcategory.includes('rosé'))) return true;
    if (searchSubcategory === 'champagne' && productSubcategory.includes('champagne')) return true;
    
    // Match for specific varietals
    if (searchSubcategory === 'cabernet-sauvignon' && productSubcategory.includes('cabernet')) return true;
    if (searchSubcategory === 'sauvignon-blanc' && productSubcategory.includes('sauvignon blanc')) return true;
    if (searchSubcategory === 'merlot' && productSubcategory.includes('merlot')) return true;
    
    return false;
  });

  const subcategoryData = subcategoryInfo[subcategory] || {
    name: subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
    description: `Premium ${subcategory} wines`
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-[#A76545] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/wine" className="flex items-center text-white/80 hover:text-white transition-colors mr-4">
              <FaArrowLeft className="w-5 h-5 mr-2" />
              Back to Wine
            </Link>
          </div>
          <div className="flex items-center">
            <div className="mr-6">
              <FaWineGlassAlt className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                {subcategoryData.name}
              </h1>
              <p className="text-xl sm:text-2xl text-white/90 max-w-3xl">
                {subcategoryData.description}
              </p>
              <div className="mt-4 text-lg text-white/80">
                {subcategoryProducts.length} wines available
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
                <Link href="/" className="text-gray-500 hover:text-[#A76545] transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <Link href="/wine" className="text-gray-500 hover:text-[#A76545] transition-colors">Wine</Link>
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
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[#A76545] focus:border-transparent"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {subcategoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subcategoryProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
                    <div className="relative bg-gray-50 p-6 h-64 flex items-center justify-center">
                      <img 
                        src={product.productImage} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-[#A76545] text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Premium
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#A76545] transition-colors">
                        {capitalizeProductName(product.name)}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-[#A76545] lowercase">
                          {product.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-4">
                        <AddToBasketButton 
                          productId={product.id} 
                          className="w-full bg-[#A76545] hover:bg-[#8B543A] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
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
                <FaWineGlassAlt className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No {subcategoryData.name} Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We don't have any {subcategoryData.name.toLowerCase()} in stock right now, but we're constantly adding new wines to our collection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/wine">
                  <button className="bg-[#A76545] hover:bg-[#8B543A] text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Browse Other Wine Types
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