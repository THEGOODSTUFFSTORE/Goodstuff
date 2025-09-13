import React from 'react';
import Link from 'next/link';
import { FaWineGlassAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import { getProducts } from '@/lib/api';

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
  
  // Get all wine products and filter by subcategory with error handling
  let subcategoryProducts: any[] = [];
  try {
    const allProducts = await getProducts();
    subcategoryProducts = allProducts.filter(product => {
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
    
    return false;
  });
  } catch (error) {
    console.error('Error fetching wine subcategory products:', error);
    // Fallback to empty array to prevent page crash
    subcategoryProducts = [];
  }

  const subcategoryData = subcategoryInfo[subcategory] || {
    name: subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
    description: `Premium ${subcategory} wines`
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white text-black py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/wine" className="flex items-center text-black/80 hover:text-black transition-colors mr-4">
              <FaArrowLeft className="w-5 h-5 mr-2" />
              Back to Wine
            </Link>
          </div>
          <div className="flex items-center">
            <FaWineGlassAlt className="w-12 h-12 mr-6" />
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">{subcategoryData.name}</h1>
              <p className="text-xl text-black/90">{subcategoryData.description}</p>
              <div className="mt-4 text-lg text-black/80">{subcategoryProducts.length} wines available</div>
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
              <li className="flex items-center">
                <Link href="/wine" className="text-gray-500 hover:text-black transition-colors">Wine</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">{subcategoryData.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{subcategoryData.name} Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {subcategoryData.description}
          </p>
        </div>

        {subcategoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subcategoryProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                categoryColor="bg-black"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No wines found</h3>
            <p className="text-gray-600 mb-8">
              We don't have any {subcategoryData.name.toLowerCase()} in stock right now, but we're constantly adding new wines to our collection.
            </p>
            <Link href="/wine">
              <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Browse All Wines
              </button>
            </Link>
          </div>
        )}

        {/* Quick Access to All Wines */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Wines</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete wine collection
            </p>
            <Link href="/wine">
              <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                View All Wines
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 