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
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
        onClick={() => handleWineClick(wine.id)}
      >
        <div className="relative h-48 w-full flex items-center justify-center bg-gray-50">
          <Image
            src={wine.productImage || '/wine.webp'}
            alt={wine.name}
            width={150}
            height={150}
            style={{ objectFit: 'contain' }}
            priority={false}
            loading="lazy"
            onError={(e: any) => {
              console.error('Image load error:', e);
              e.target.src = '/wine.webp';
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-800 h-12 overflow-hidden capitalize">
            {wine.name}
          </h3>
          <div className="flex items-baseline mt-2">
            <span className="text-lg font-bold text-red-600 lowercase">
              {wine.price.toLocaleString()}
            </span>
          </div>
          <button 
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
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