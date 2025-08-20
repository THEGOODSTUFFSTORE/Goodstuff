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
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
        onClick={() => handleProductClick(product.id)}
      >
        <div className="relative h-48 w-full flex items-center justify-center bg-gray-50">
          <Image
            src={product.productImage || '/wine.webp'}
            alt={product.name}
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
          <h3 className="text-base font-semibold text-gray-800 h-12 overflow-hidden">
            {product.name}
          </h3>
          <div className="flex items-baseline mt-2">
            <span className="text-lg font-bold text-red-600 lowercase">
              {product.price.toLocaleString()}
            </span>
          </div>
          <button 
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
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