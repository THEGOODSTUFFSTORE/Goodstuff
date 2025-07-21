'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCartStore } from '@/lib/store';
import React from 'react';

const ProductsList = React.memo(() => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem: addToCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const categoryParam = searchParams.get('category');
      const searchParam = searchParams.get('search');
      
      // Build API URL with parameters
      const params = new URLSearchParams();
      if (categoryParam && categoryParam !== 'all') {
        params.append('category', categoryParam);
      }
      params.append('pageSize', '50'); // Limit initial load
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data: Product[] = await response.json();
      console.log('Fetched products data:', data);
      setProducts(data);
      
      if (categoryParam) {
        setSelectedCategory(categoryParam);
      }
      
      // Apply search filtering if needed
      let filtered = data;
      if (searchParam) {
        filtered = data.filter((product: Product) =>
          product.name.toLowerCase().includes(searchParam.toLowerCase()) ||
          product.category.toLowerCase().includes(searchParam.toLowerCase()) ||
          product.subcategory?.toLowerCase().includes(searchParam.toLowerCase()) ||
          (product.brand && product.brand.toLowerCase().includes(searchParam.toLowerCase())) ||
          (product.description && product.description.toLowerCase().includes(searchParam.toLowerCase()))
        );
      }
      
      setFilteredProducts(filtered);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filterProducts = useCallback((productList: Product[], category: string) => {
    if (category === 'all') {
      setFilteredProducts(productList);
    } else {
      const filtered = productList.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    filterProducts(products, category);
    
    // Update URL without page reload
    const newUrl = category === 'all' ? '/products' : `/products?category=${category}`;
    window.history.pushState({}, '', newUrl);
  }, [products, filterProducts]);

  const handleProductClick = useCallback((productId: string) => {
    router.push(`/products/${productId}`);
  }, [router]);

  const handleAddToCart = useCallback((product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  }, [addToCart]);

  // Memoize categories to prevent recalculation
  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(products.map(p => p.category.toLowerCase())))], 
    [products]
  );

  // Memoize product grid to prevent unnecessary re-renders
  const productGrid = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
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
            <div className="mb-2">
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <h3 className="text-base font-semibold text-gray-800 h-12 overflow-hidden">
              {product.name}
            </h3>
            <div className="flex items-baseline mt-2">
              <span className="text-xl font-bold text-red-600">
                Ksh {product.price.toLocaleString()}/-
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
      ))}
    </div>
  ), [filteredProducts, handleProductClick, handleAddToCart]);

  // Loading skeleton
  const loadingSkeleton = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(12)].map((_, index) => (
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
  ), []);

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <div className="flex items-center space-x-4">
          <label htmlFor="category" className="text-sm font-medium text-gray-700">
            Filter by category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? loadingSkeleton : (
        <>
          {filteredProducts.length > 0 ? (
            productGrid
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No products found</h3>
              <p className="text-gray-600 mb-8">
                We couldn't find any products matching your criteria.
              </p>
              <button 
                onClick={() => handleCategoryChange('all')}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                View All Products
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

ProductsList.displayName = 'ProductsList';

export default ProductsList; 