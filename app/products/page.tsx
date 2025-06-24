'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useCart } from '@/lib/cartContext';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProducts(data);
        
        // Check for URL parameters
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');
        
        if (categoryParam) {
          setSelectedCategory(categoryParam);
        }
        
        // Apply filtering based on URL params
        let filtered = data;
        
        // Filter by category
        if (categoryParam && categoryParam !== 'all') {
          filtered = filtered.filter((product: Product) =>
            product.category.toLowerCase() === categoryParam.toLowerCase()
          );
        }
        
        // Filter by search query
        if (searchParam) {
          filtered = filtered.filter((product: Product) =>
            product.name.toLowerCase().includes(searchParam.toLowerCase()) ||
            product.category.toLowerCase().includes(searchParam.toLowerCase()) ||
            product.subcategory.toLowerCase().includes(searchParam.toLowerCase()) ||
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
    };

    fetchProducts();
  }, [searchParams]);

  const filterProducts = (productList: Product[], category: string) => {
    if (category === 'all') {
      setFilteredProducts(productList);
    } else {
      const filtered = productList.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    filterProducts(products, category);
    
    // Update URL without page reload
    const newUrl = category === 'all' ? '/products' : `/products?category=${category}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Get unique categories from products
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category.toLowerCase())))];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
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
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              All Products
            </h1>
            <p className="text-xl sm:text-2xl text-red-100 max-w-3xl mx-auto">
              Discover our complete collection of premium wines, spirits, and beverages
            </p>
            <div className="mt-8 text-lg text-red-200">
              {filteredProducts.length} products available • Free delivery in Nairobi
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
                <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Products</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
                    {product.price}/-
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

        {/* No products found */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No products found</h3>
            <p className="text-gray-600 mb-8">
              Try selecting a different category or browse all products.
            </p>
            <button
              onClick={() => handleCategoryChange('all')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Show All Products
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 