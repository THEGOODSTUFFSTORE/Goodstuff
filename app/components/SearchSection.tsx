'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Product } from '@/lib/types';
import { capitalizeProductName } from '@/lib/utils';

export default function SearchSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Beverage categories with their routes and gradient backgrounds
  const beverageCategories = [
    {
      name: 'Wine',
      image: '/wine.webp',
      gradient: 'from-red-500 to-red-300',
      href: '/wine'
    },
    {
      name: 'Gin',
      image: '/gin.webp',
      gradient: 'from-orange-500 to-orange-300',
      href: '/gin'
    },
    {
      name: 'Whisky',
      image: '/whisky.webp',
      gradient: 'from-amber-600 to-yellow-400',
      href: '/bourbon'
    },
    {
      name: 'Vodka',
      image: '/vodka.webp',
      gradient: 'from-lime-500 to-yellow-300',
      href: '/vodka'
    },
    {
      name: 'Beer',
      image: '/beer.webp',
      gradient: 'from-green-500 to-green-300',
      href: '/beer'
    },
    {
      name: 'Brandy',
      image: '/brandy.webp',
      gradient: 'from-yellow-400 to-gray-300',
      href: '/cognac'
    },
    {
      name: 'Tequila',
      image: '/tequila.webp',
      gradient: 'from-yellow-500 to-orange-300',
      href: '/tequila'
    },
    {
      name: 'Rum',
      image: '/rum.webp',
      gradient: 'from-yellow-400 to-gray-300',
      href: '/rum'
    },
    {
      name: 'Liqueur',
      image: '/liqueur.webp',
      gradient: 'from-purple-500 to-pink-400',
      href: '/cream-liquers'
    },
    {
      name: 'Market',
      image: '/market.webp',
      gradient: 'from-blue-500 to-green-500',
      href: '/market'
    }
  ];

  // Debounced search function
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (query.trim().length === 0) {
        setSearchResults([]);
        setShowResults(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const products = await response.json();
          
          // Filter products based on search query
          const filteredProducts = products.filter((product: Product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.subcategory?.toLowerCase().includes(query.toLowerCase()) ||
            (product.brand && product.brand.toLowerCase().includes(query.toLowerCase())) ||
            (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
          );

          setSearchResults(filteredProducts.slice(0, 8)); // Limit to 8 results
          setShowResults(true);
        }
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Handle search input changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, debouncedSearch]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (productId: string) => {
    setShowResults(false);
    setSearchQuery('');
    router.push(`/products/${productId}`);
  };

  const handleViewAllResults = () => {
    setShowResults(false);
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleCategoryClick = (href: string) => {
    router.push(href);
  };

  return (
    <section className="bg-gray-50 py-12" ref={searchRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Drink</h2>
            <p className="text-lg text-gray-600 mb-8">Search our extensive collection or browse by category</p>
            
            <div className="relative max-w-2xl mx-auto">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for wines, spirits, brands..."
                value={searchQuery}
                onChange={handleSearchInput}
                className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="relative w-12 h-12 flex-shrink-0 mr-4">
                            <Image
                              src={product.productImage || '/wine.webp'}
                              alt={product.name}
                              fill
                              style={{ objectFit: 'contain' }}
                              className="rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 truncate">{capitalizeProductName(product.name)}</h4>
                            <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                            <p className="text-xs font-medium text-red-600 lowercase">
                              {product.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="p-4 border-t border-gray-200">
                        <button
                          onClick={handleViewAllResults}
                          className="w-full text-center text-red-600 hover:text-red-800 font-medium"
                        >
                          View all results →
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No products found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Beverage Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-4 sm:gap-6">
            {beverageCategories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category.href)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className={`bg-gradient-to-br ${category.gradient} rounded-2xl p-6 text-center shadow-md group-hover:shadow-xl transition-shadow duration-300`}>
                  <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={60}
                      height={60}
                      className="rounded-full mx-auto"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white drop-shadow-sm">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 