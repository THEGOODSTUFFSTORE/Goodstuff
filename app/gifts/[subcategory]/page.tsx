"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FaGift, FaArrowLeft } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import { useParams } from 'next/navigation';


const subcategoryInfo: { [key: string]: any } = {
  sets: {
    name: 'Gift Sets',
    description: 'Curated gift sets for every occasion',
    color: 'from-purple-600 to-purple-800'
  },
  accessories: {
    name: 'Bar Accessories',
    description: 'Essential tools for the home bartender',
    color: 'from-gray-600 to-gray-800'
  },
  corporate: {
    name: 'Corporate Gifts',
    description: 'Professional gifts for business occasions',
    color: 'from-blue-700 to-blue-900'
  },
  occasion: {
    name: 'Occasion Gifts',
    description: 'Perfect gifts for special celebrations',
    color: 'from-pink-500 to-pink-700'
  },
  luxury: {
    name: 'Luxury Gifts',
    description: 'Premium and luxury gift options',
    color: 'from-yellow-600 to-yellow-800'
  },
  personalized: {
    name: 'Personalized Gifts',
    description: 'Custom and personalized gift options',
    color: 'from-green-600 to-green-800'
  }
};

export default function GiftsSubcategoryPage() {
  const { subcategory } = useParams<{ subcategory: string }>();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/products?category=gifts', { cache: 'no-store' });
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
      product.category?.toLowerCase() === 'gifts' &&
      (
        product.subcategory?.toLowerCase().includes(key) ||
        product.subcategory?.toLowerCase().replace(/\s+/g, '').includes(key)
      )
    );
  }, [products, subcategory]);

  const subcategoryData = subcategoryInfo[subcategory] || {
    name: subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
    description: `Premium ${subcategory} gifts`,
    color: 'from-purple-500 to-purple-600'
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-gray-100 text-black py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/gifts" className="flex items-center text-black/80 hover:text-black transition-colors mr-4">
              <FaArrowLeft className="w-5 h-5 mr-2" />
              Back to Gifts
            </Link>
          </div>
          <div className="flex items-center">
            <div className="mr-6">
              <FaGift className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{subcategoryData.name}</h1>
              <p className="text-xl text-black/90">{subcategoryData.description}</p>
              <div className="mt-4 text-lg text-black/80">{subcategoryProducts.length} gifts available</div>
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
                <Link href="/gifts" className="text-gray-500 hover:text-black transition-colors">Gifts</Link>
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
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No gifts found</h3>
            <p className="text-gray-600 mb-8">
              We don't have any {subcategoryData.name.toLowerCase()} in stock right now, but we're constantly adding new gifts to our collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/gifts">
                <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Browse Other Gift Categories
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Access to All Gifts */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All Gifts</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete gift collection
            </p>
            <Link href="/gifts">
              <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                View All Gifts
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 