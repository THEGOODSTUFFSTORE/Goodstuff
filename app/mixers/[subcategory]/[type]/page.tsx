"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCocktail, FaArrowLeft } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import AddToBasketButton from '@/app/components/AddToBasketButton';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';

interface MixerTypePageProps {
  params: Promise<{
    subcategory: string;
    type: string;
  }>;
}

export default function MixerTypePage({ params }: MixerTypePageProps) {
  const [mixerProducts, setMixerProducts] = useState<Product[]>([]);
  const [typeProducts, setTypeProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ subcategory: string; type: string } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchMixerProducts = async () => {
      setIsLoading(true);
      try {
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef,
          where('category', '==', 'mixers'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        setMixerProducts(fetchedProducts);
        
        // Filter products by exact subcategory and type matching
        const filteredProducts = fetchedProducts.filter(product => {
          const normalizedSubcategory = product.subcategory?.toLowerCase().replace(/\s+/g, '-');
          const normalizedType = resolvedParams.type.toLowerCase();
          
          return normalizedSubcategory === normalizedType ||
                 product.subcategory?.toLowerCase().includes(resolvedParams.type.replace(/-/g, ' '));
        });
        
        setTypeProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching mixer products:', error);
        setMixerProducts([]);
        setTypeProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMixerProducts();
  }, [resolvedParams]);

  if (!resolvedParams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const { subcategory, type } = resolvedParams;
  const displayType = type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-teal-100 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <FaCocktail className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              {displayType} Mixers
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Discover our curated selection of {displayType.toLowerCase()} mixers
            </p>
            <div className="mt-8 text-lg text-black/80">
              {isLoading ? 'Loading...' : `${typeProducts.length} mixers available`} • Free delivery for orders above Ksh. 3000
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
              <li className="flex items-center">
                <Link href={`/mixers/${subcategory}`} className="text-gray-500 hover:text-black transition-colors">
                  {subcategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">{displayType}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/mixers/${subcategory}`}
            className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <FaArrowLeft className="h-4 w-4 mr-2" />
            Back to {subcategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Link>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading mixers...</p>
            </div>
          ) : typeProducts.length === 0 ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No {displayType} mixers found</h2>
              <p className="text-gray-600 mb-6">We're working on adding more {displayType.toLowerCase()} mixers to our collection.</p>
              <Link
                href="/mixers"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Browse All Mixers
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{displayType} Mixer Collection</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Discover our carefully selected {displayType.toLowerCase()} mixers for perfect cocktails
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {typeProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.productImage || '/wine.webp'}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-green-600 font-bold text-lg mb-3">Ksh {product.price.toLocaleString()}</p>
                      <AddToBasketButton product={product} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}