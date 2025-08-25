import React from 'react';
import Link from 'next/link';
import { FaWineGlassAlt, FaArrowLeft } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { getProductsByCategory } from '@/lib/api';

interface WineTypePageProps {
  params: Promise<{
    subcategory: string;
    type: string;
  }>;
}

export default async function WineTypePage({ params }: WineTypePageProps) {
  const { subcategory, type } = await params;
  
  // Fetch only wine products from Contentful
  const wineProducts = await getProductsByCategory('wine');
  
  // Filter products by exact subcategory and type matching
  const typeProducts = wineProducts.filter(product => {
    const normalizedSubcategory = product.subcategory?.toLowerCase().replace(/\s+/g, '-');
    const normalizedType = type.toLowerCase();
    
    // Match by subcategory if it matches the type parameter
    return normalizedSubcategory === normalizedType ||
           product.subcategory?.toLowerCase().includes(type.replace(/-/g, ' '));
  });

  // Simple wine type display name
  const wineTypeName = type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="bg-white text-black py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href={`/wine/${subcategory}`} className="flex items-center text-black/80 hover:text-black transition-colors mr-4">
              <FaArrowLeft className="w-5 h-5 mr-2" />
              Back to {subcategory}
            </Link>
          </div>
          <div className="flex items-center">
            <FaWineGlassAlt className="w-12 h-12 mr-6" />
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{wineTypeName}</h1>
              <p className="text-xl text-black/90">Premium {type.replace(/-/g, ' ')} wines</p>
              <div className="mt-4 text-lg text-black/80">{typeProducts.length} wines available</div>
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
              <li className="flex items-center">
                <Link href={`/wine/${subcategory}`} className="text-gray-500 hover:text-black transition-colors">
                  {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">{wineTypeName}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{wineTypeName} Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Premium {type.replace(/-/g, ' ')} wines from renowned vineyards
          </p>
        </div>

        {typeProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {typeProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={product.image || '/default-wine.jpg'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-black transition-colors capitalize">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="text-xl font-bold text-black lowercase">{product.price.toLocaleString()}</div>
                  <div className="mt-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {product.subcategory}
                    </span>
                  </div>
                  <div className="mt-4">
                    <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No {wineTypeName} Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We don't have any {wineTypeName.toLowerCase()} in stock right now, but we're constantly adding new wines to our collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/wine/${subcategory}`}>
                <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Browse Other {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Wines
                </button>
              </Link>
            </div>
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