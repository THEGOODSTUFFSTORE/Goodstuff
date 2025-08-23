'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store';
import { capitalizeProductName } from '@/lib/utils';
import React from 'react';

const TrendingDeals = React.memo(() => {
  const router = useRouter();
  const { addItem: addToCart } = useCartStore();
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

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Memoize the product list to prevent unnecessary re-renders
  const productList = useMemo(() => {
    return products.map((product) => (
      <div
        key={product.id}
        className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 group border border-gray-100 hover:border-red-200"
        onClick={() => handleProductClick(product.id)}
      >
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gray-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        

        
        <div className="relative h-48 w-full flex items-center justify-center bg-gray-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-100/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          {product.productImage ? (
            <Image
              src={product.productImage}
              alt={product.name}
              width={150}
              height={150}
              style={{ objectFit: 'contain' }}
              priority={false}
              loading="lazy"
              className="p-2 transition-all duration-500 group-hover:scale-110 drop-shadow-sm group-hover:drop-shadow-xl z-10 relative"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="relative p-4 bg-white">
          <div className="mb-2">
            <span className="inline-block bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              Hot Deal
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-gray-600 transition-colors leading-tight line-clamp-2">
            {capitalizeProductName(product.name)}
          </h3>
          <div className="flex items-baseline mt-2 mb-4">
            <span className="text-lg font-bold text-gray-900 lowercase">
              {product.price.toLocaleString()}/=
            </span>
          </div>
                      <button 
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              onClick={(e) => handleAddToCart(product, e)}
            >
            Add to basket
          </button>
        </div>
      </div>
    ));
  }, [products]);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-6 -mt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-light text-gray-800">Trending Deals</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (!loading && products.length === 0) {
    return null; // Don't render if no products available after loading
  }

  return (
    <section className="container mx-auto px-4 py-6 -mt-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-light text-gray-800">Trending Deals</h2>
        <a href="/trending-deals" className="text-orange-600 font-medium hover:underline flex items-center">
          VIEW ALL »
        </a>
      </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {productList}
      </div>
    </section>
  );
});

TrendingDeals.displayName = 'TrendingDeals';

export default TrendingDeals; 