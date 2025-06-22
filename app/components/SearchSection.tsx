'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaSearch, FaTimes, FaFilter } from 'react-icons/fa';
import { Product } from '@/lib/types';

export default function SearchSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setAllProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Handle search input changes
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery, selectedCategory);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedCategory, allProducts]);

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

  const performSearch = (query: string, category: string) => {
    const filteredProducts = allProducts.filter(product => {
      const matchesQuery = 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(query.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(query.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(query.toLowerCase()));

      const matchesCategory = category === 'all' || 
        product.category.toLowerCase() === category.toLowerCase();

      return matchesQuery && matchesCategory;
    });

    setSearchResults(filteredProducts.slice(0, 8)); // Limit to 8 results for UI
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearching(true);
  };

  const handleProductClick = (productId: string) => {
    setShowResults(false);
    setSearchQuery('');
    router.push(`/products/${productId}`);
  };

  const handleViewAllResults = () => {
    setShowResults(false);
    router.push(`/products?search=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(allProducts.map(p => p.category.toLowerCase())))];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Drink
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search through our extensive collection of premium wines, spirits, and beverages
          </p>
        </div>

        <div className="max-w-4xl mx-auto" ref={searchRef}>
          {/* Search Bar */}
          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl shadow-xl p-2">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-gray-100 border-0 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 min-w-[140px]"
                >
                  <option value="all">All Categories</option>
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for wines, spirits, brands..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  className="w-full px-4 py-3 pl-12 pr-12 border-0 rounded-xl bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={() => handleViewAllResults()}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Search
              </button>
            </div>

            {/* Loading Indicator */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-b-2xl shadow-lg border-t p-4 z-10">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                  <span className="ml-2 text-gray-600">Searching...</span>
                </div>
              </div>
            )}

            {/* Search Results Dropdown */}
            {showResults && !isSearching && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-b-2xl shadow-2xl border-t z-20 max-h-96 overflow-y-auto">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Search Results ({searchResults.length})
                    </h3>
                    <button
                      onClick={handleViewAllResults}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image
                            src={product.productImage}
                            alt={product.name}
                            width={48}
                            height={48}
                            objectFit="contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {product.category} • {product.subcategory}
                          </p>
                          <p className="text-sm font-bold text-red-600">
                            Ksh {product.price.toLocaleString()}/-
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* No Results */}
            {showResults && !isSearching && searchResults.length === 0 && searchQuery && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-b-2xl shadow-lg border-t p-8 z-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaSearch className="text-gray-400 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or browse our categories
                  </p>
                  <button
                    onClick={() => router.push('/products')}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Browse All Products
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Suggestions */}
          <div className="mt-8">
            <p className="text-sm text-gray-600 text-center mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Wine', 'Whiskey', 'Beer', 'Champagne', 'Vodka', 'Gin'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    setSelectedCategory('all');
                  }}
                  className="bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 px-4 py-2 rounded-full text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 