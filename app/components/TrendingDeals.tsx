'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';

export default function TrendingDeals() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use API route with trending type parameter
        const response = await fetch('/api/products?type=trending');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProducts(data); // API already returns the correct slice
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-6 -mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-light text-gray-800">Trending Deals</h2>
          <a href="/products" className="text-orange-600 font-medium hover:underline flex items-center">
            VIEW ALL »
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
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
    <section className="container mx-auto px-4 py-6 -mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-light text-gray-800">Trending Deals</h2>
        <a href="/products" className="text-orange-600 font-medium hover:underline flex items-center">
          VIEW ALL »
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="relative h-48 w-full flex items-center justify-center bg-gray-50">
              <Image
                src={product.productImage}
                alt={product.name}
                width={150}
                height={150}
                objectFit="contain"
              />
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-800 h-12 overflow-hidden">
                {product.name}
              </h3>
              <div className="flex items-baseline mt-2">
                <span className="text-xl font-bold text-red-600">
                  {product.price}/-
                </span>
              </div>
              <button 
                className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to cart functionality here
                  console.log('Added to cart:', product.name);
                }}
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