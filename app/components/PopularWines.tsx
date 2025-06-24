'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cartContext';

export default function PopularWines() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [wines, setWines] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWines = async () => {
      try {
        // Use API route with popular type parameter  
        const response = await fetch('/api/products?type=popular');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
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

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-light text-gray-800">Popular Wines</h2>
          <a href="/products?category=wine" className="text-orange-600 font-medium hover:underline flex items-center">
            VIEW ALL »
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-light text-gray-800">Popular Wines</h2>
        <a href="/products?category=wine" className="text-orange-600 font-medium hover:underline flex items-center">
          VIEW ALL »
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {wines.map((wine) => (
          <div
            key={wine.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
            onClick={() => handleWineClick(wine.id)}
          >
            <div className="relative h-48 w-full flex items-center justify-center bg-gray-50">
              <Image
                src={wine.productImage}
                alt={wine.name}
                width={150}
                height={150}
                objectFit="contain"
              />
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-800 h-12 overflow-hidden">
                {wine.name}
              </h3>
              <div className="flex items-baseline mt-2">
                <span className="text-xl font-bold text-red-600">
                  {wine.price}/-
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
        ))}
      </div>
    </section>
  );
} 