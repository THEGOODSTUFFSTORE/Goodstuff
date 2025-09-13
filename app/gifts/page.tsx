"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGift, FaArrowRight } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';

const giftSubcategories = [
  {
    id: 'gift-sets',
    name: 'Gift Sets',
    description: 'Curated gift sets for every occasion',
    color: 'from-pink-500 to-pink-700',
    image: '/gift1.jpg',
    types: ['Wine Sets', 'Spirit Sets', 'Cocktail Sets', 'Premium Sets']
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Premium accessories and gift items',
    color: 'from-purple-500 to-purple-700',
    image: '/gift2.jpg',
    types: ['Glassware', 'Decanters', 'Corkscrews', 'Gift Boxes']
  },
  {
    id: 'luxury',
    name: 'Luxury Items',
    description: 'Exclusive luxury gifts and collectibles',
    color: 'from-gold-500 to-gold-700',
    image: '/gift3.jpg',
    types: ['Limited Edition', 'Collectibles', 'Premium Brands', 'Exclusive']
  }
];

export default function GiftsPage() {
  const [giftProducts, setGiftProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGiftProducts = async () => {
      setIsLoading(true);
      try {
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef,
          where('category', '==', 'gifts'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setGiftProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching gift products:', error);
        setGiftProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGiftProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-100 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <FaGift className="h-16 w-16 text-pink-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              Gifts & Accessories
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Perfect gifts for every occasion and lifestyle
            </p>
            <div className="mt-8 text-lg text-black/80">
              {isLoading ? 'Loading...' : `${giftProducts.length} gifts available`} • Free delivery for orders above Ksh. 3000
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
              <li className="text-gray-700 font-medium">Gifts</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect gift for any occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giftSubcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/gifts/${subcategory.id}`}
                className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className={`h-48 bg-gradient-to-br ${subcategory.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-bold mb-2">{subcategory.name}</h3>
                      <p className="text-sm opacity-90">{subcategory.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                        {subcategory.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{subcategory.description}</p>
                    </div>
                    <FaArrowRight className="h-5 w-5 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {subcategory.types.slice(0, 3).map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                      {subcategory.types.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{subcategory.types.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      {!isLoading && giftProducts.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Gifts</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our most popular gift items and accessories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {giftProducts.slice(0, 8).map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4">
                  <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product.productImage || '/wine.webp'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-pink-600 font-bold text-lg">Ksh {product.price.toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/products?category=gifts"
                className="inline-flex items-center px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-colors"
              >
                View All Gifts
                <FaArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gifts...</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}