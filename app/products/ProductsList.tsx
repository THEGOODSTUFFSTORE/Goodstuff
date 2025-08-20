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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchProducts = useCallback(async (loadMore = false) => {
    try {
      if (!loadMore) setLoading(true);
      else setLoadingMore(true);
      
      const categoryParam = searchParams.get('category');
      const searchParam = searchParams.get('search');
      
      // Build API URL with parameters
      const params = new URLSearchParams();
      if (categoryParam && categoryParam !== 'all') {
        params.append('category', categoryParam);
      }
      // Remove the pageSize limit to fetch all products
      // params.append('pageSize', '50'); // Removed this limit
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data: Product[] = await response.json();
      console.log('Fetched products data:', data);
      
      if (loadMore) {
        setProducts(prev => [...prev, ...data]);
      } else {
        setProducts(data);
      }
      
      // If we got fewer products than expected, we've reached the end
      if (data.length < 1000) {
        setHasMore(false);
      }
      
      if (categoryParam) {
        setSelectedCategory(categoryParam);
      }
      
      // Apply search filtering if needed
      let filtered = loadMore ? [...products, ...data] : data;
      if (searchParam) {
        filtered = filtered.filter((product: Product) =>
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
      if (!loadMore) {
        setProducts([]);
        setFilteredProducts([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [searchParams, products]);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]); // Remove fetchProducts from dependencies to avoid infinite loop

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

  const handleLoadMore = useCallback(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  // Memoize categories to prevent recalculation
  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(products.map(p => p.category.toLowerCase())))], 
    [products]
  );

  // Memoize product grid to prevent unnecessary re-renders
  const productGrid = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 group"
          onClick={() => handleProductClick(product.id)}
        >
          <div className="relative h-48 md:h-56 w-full flex items-center justify-center bg-gray-50 overflow-hidden">
            <Image
              src={product.productImage || '/wine.webp'}
              alt={product.name}
              width={200}
              height={200}
              style={{ objectFit: 'contain' }}
              priority={false}
              loading="lazy"
              className="transition-transform duration-300 group-hover:scale-110"
              onError={(e: any) => {
                console.error('Image load error:', e);
                e.target.src = '/wine.webp';
              }}
            />
          </div>
          <div className="p-4 md:p-6">
            <div className="mb-3">
              <span className="inline-block bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 h-12 md:h-14 overflow-hidden leading-tight capitalize">
              {product.name}
            </h3>
            <div className="flex items-baseline mb-4">
              <span className="text-lg md:text-xl font-bold text-red-600 lowercase">
                {product.price.toLocaleString()}
              </span>
            </div>
            <button 
              className="w-full bg-green-600 text-white py-2.5 md:py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:translate-y-[-1px]"
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-48 md:h-56 bg-gray-200"></div>
          <div className="p-4 md:p-6">
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-3 w-4/5"></div>
            <div className="h-6 bg-gray-200 rounded mb-4 w-3/5"></div>
            <div className="h-10 md:h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  ), []);

  return (
    <main className="flex-grow bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 md:mb-12 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Our Products
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              {loading ? 'Loading products...' : (
                <>
                  Showing {filteredProducts.length} products
                  {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                  {!hasMore && filteredProducts.length > 0 && ' (All products loaded)'}
                </>
              )}
            </p>
          </div>
          
          {/* Filter Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <label htmlFor="category" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Filter by category:
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full sm:w-auto min-w-[200px] border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Section */}
        <div className="relative">
          {loading ? (
            loadingSkeleton
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <>
                  {productGrid}
                  
                  {/* Load More Button */}
                  {hasMore && selectedCategory === 'all' && (
                    <div className="mt-8 md:mt-12 text-center">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingMore ? 'Loading...' : 'Load More Products'}
                      </button>
                    </div>
                  )}
                  
                  {/* Results Count */}
                  <div className="mt-8 md:mt-12 text-center">
                    <p className="text-gray-600 text-sm md:text-base">
                      {!hasMore && selectedCategory === 'all' 
                        ? `All ${filteredProducts.length} products loaded` 
                        : `Showing ${filteredProducts.length} products`
                      }
                    </p>
                  </div>
                </>
              ) : (
                /* No Products Found */
                <div className="text-center py-16 md:py-24">
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0H4m16 0l-2-2m0 0l-2-2m2 2l2-2M4 13l2-2m-2 2l2 2m-2-2l-2-2" />
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-8 text-sm md:text-base">
                      We couldn't find any products matching your criteria. Try adjusting your filters or browse all products.
                    </p>
                    <button 
                      onClick={() => handleCategoryChange('all')}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:translate-y-[-1px]"
                    >
                      View All Products
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
});

ProductsList.displayName = 'ProductsList';

export default ProductsList; 