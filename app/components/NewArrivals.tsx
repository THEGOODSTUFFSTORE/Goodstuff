'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store';
import React from 'react';

const NewArrivals = React.memo(() => {
  const router = useRouter();
  const { addItem: addToCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?type=new_arrivals');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        console.log('Fetched new arrivals:', data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
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
        className="relative bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 group border border-gray-100 hover:border-blue-200"
        onClick={() => handleProductClick(product.id)}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        {/* New badge */}
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          NEW
        </div>
        
        <div className="relative h-48 w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent group-hover:from-blue-50/20 group-hover:to-green-50/20 transition-all duration-500"></div>
          <Image
            src={product.productImage || '/wine.webp'}
            alt={product.name}
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
        <div className="relative p-4 bg-gradient-to-br from-white via-gray-50/30 to-white">
          <div className="mb-2">
            <span className="inline-block bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 shadow-sm">
              Fresh Arrival
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-800 h-12 overflow-hidden capitalize mb-2 group-hover:text-blue-700 transition-colors leading-tight">
            {product.name}
          </h3>
          <div className="flex items-baseline mt-2 mb-4">
            <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent lowercase">
              KES {product.price.toLocaleString()}
            </span>
          </div>
          <button 
            className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
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
      <section className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-light text-gray-800">New Arrivals</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
    <section className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-light text-gray-800">New Arrivals</h2>
        <a href="/products" className="text-orange-600 font-medium hover:underline flex items-center">
          VIEW ALL »
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {productList}
      </div>
    </section>
  );
});

NewArrivals.displayName = 'NewArrivals';

export default NewArrivals; 