'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store';
import React from 'react';

const PopularWines = React.memo(() => {
  const router = useRouter();
  const { addItem: addToCart } = useCartStore();
  const [wines, setWines] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWines = async () => {
      try {
        // Use API route with popular type parameter  
        const response = await fetch('/api/products?type=popular');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        console.log('Fetched wine data:', data);
        setWines(data); // API already returns filtered and sliced wine products
      } catch (error) {
        console.error('Error fetching wines:', error);
        setWines([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWines();
  }, []);

  const handleWineClick = (wineId: string) => {
    router.push(`/products/${wineId}`);
  };

  const handleAddToCart = (wine: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(wine, 1);
  };

  // Memoize the wine list to prevent unnecessary re-renders
  const wineList = useMemo(() => {
    return wines.map((wine) => (
      <div
        key={wine.id}
        className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 group border border-gray-100 hover:border-purple-200"
        onClick={() => handleWineClick(wine.id)}
      >
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gray-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        

        
        <div className="relative h-48 w-full flex items-center justify-center bg-gray-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-100/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          <Image
            src={wine.productImage || '/wine.webp'}
            alt={wine.name}
            width={150}
            height={150}
            style={{ objectFit: 'contain' }}
            priority={false}
            loading="lazy"
            className="transition-all duration-500 group-hover:scale-110 drop-shadow-sm group-hover:drop-shadow-xl z-10 relative"
            onError={(e: any) => {
              console.error('Image load error:', e);
              e.target.src = '/wine.webp';
            }}
          />
        </div>
        <div className="relative p-4 bg-white">
          <div className="mb-2">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              Top Choice
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-800 h-12 overflow-hidden capitalize mb-2 group-hover:text-gray-600 transition-colors leading-tight">
            {wine.name}
          </h3>
          <div className="flex items-baseline mt-2 mb-4">
            <span className="text-lg font-bold text-gray-900 lowercase">
              {wine.price.toLocaleString()}/=
            </span>
          </div>
                      <button 
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              onClick={(e) => handleAddToCart(wine, e)}
            >
            Add to basket
          </button>
        </div>
      </div>
    ));
  }, [wines]);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-light text-gray-800">Popular Products</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (!loading && wines.length === 0) {
    return null; // Don't render if no wines available after loading
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-light text-gray-800">Popular Products</h2>
        <a href="/products" className="text-orange-600 font-medium hover:underline flex items-center">
          VIEW ALL »
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {wineList}
      </div>
    </section>
  );
});

PopularWines.displayName = 'PopularWines';

export default PopularWines; 