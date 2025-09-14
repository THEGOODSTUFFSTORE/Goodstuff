"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FaCocktail, FaArrowLeft } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import { useParams } from 'next/navigation';


const subcategoryInfo: { [key: string]: any } = {
  tonic: {
    name: 'Tonic Water',
    description: 'Premium tonic waters for perfect gin & tonics',
    color: 'from-blue-400 to-blue-600'
  },
  soda: {
    name: 'Soda Water',
    description: 'Sparkling waters and sodas for cocktails',
    color: 'from-green-400 to-green-600'
  },
  juice: {
    name: 'Juices',
    description: 'Fresh and premium juices for cocktails',
    color: 'from-orange-400 to-orange-600'
  },
  bitters: {
    name: 'Bitters & Syrups',
    description: 'Essential bitters and syrups for cocktail crafting',
    color: 'from-red-500 to-red-700'
  },
  garnish: {
    name: 'Garnishes',
    description: 'Perfect finishing touches for your cocktails',
    color: 'from-purple-500 to-purple-700'
  }
};

export default function MixersSubcategoryPage() {
  const { subcategory } = useParams<{ subcategory: string }>();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/products?category=mixers', { cache: 'no-store' });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      }
    };
    load();
  }, []);

  const subcategoryProducts = useMemo(() => {
    const key = (subcategory || '').toString().toLowerCase();
    return products.filter((product: any) =>
      product.category?.toLowerCase() === 'mixers' &&
      (
        product.subcategory?.toLowerCase().includes(key) ||
        product.subcategory?.toLowerCase().replace(/\s+/g, '').includes(key)
      )
    );
  }, [products, subcategory]);

  const subcategoryData = subcategoryInfo[subcategory] || {
    name: subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
    description: `Premium ${subcategory} mixers`,
    color: 'from-blue-500 to-blue-600'
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-gray-100 text-black py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/mixers" className="flex items-center text-black/80 hover:text-black transition-colors mr-4">
              <FaArrowLeft className="w-5 h-5 mr-2" />
              Back to Mixers
            </Link>
          </div>
          <div className="flex items-center">
            <div className="mr-6">
              <FaCocktail className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{subcategoryData.name}</h1>
              <p className="text-xl text-black/90">{subcategoryData.description}</p>
              <div className="mt-4 text-lg text-black/80">{subcategoryProducts.length} mixers available</div>
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
                <Link href="/mixers" className="text-gray-500 hover:text-black transition-colors">Mixers</Link>
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No mixers found</h3>
            <p className="text-gray-600 mb-8">
              We don't have any {subcategoryData.name.toLowerCase()} in stock right now, but we're constantly adding new mixers to our collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/mixers">
                <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Browse Other Mixer Categories
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Access to All Mixers */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Mixers</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete mixer collection
            </p>
            <Link href="/mixers">
              <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                View All Mixers
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 