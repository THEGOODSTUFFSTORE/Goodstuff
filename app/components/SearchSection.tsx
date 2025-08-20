'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Product } from '@/lib/types';

export default function SearchSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="bg-gray-50 py-12" ref={searchRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Drink</h2>
          </div>
          
          <div className="relative">
            {/* Search Input */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for wines, spirits, brands..."
                value={searchQuery}
                onChange={handleSearchInput}
                className="w-full pl-12 pr-12 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              )}
            </div>

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
                          <h4 className="font-medium text-gray-900 truncate capitalize">{product.name}</h4>
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
      </div>
    </section>
  );
} 