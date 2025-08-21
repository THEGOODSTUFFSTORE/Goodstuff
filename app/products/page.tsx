import { Suspense } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductsList from './ProductsList';

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Premium Products Collection
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
              Discover our curated selection of premium wines, spirits, and specialty beverages
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </a>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-gray-900 font-medium">Products</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <Suspense fallback={<ProductsLoadingSkeleton />}>
        <ProductsList />
      </Suspense>
      
      <Footer />
    </div>
  );
}

function ProductsLoadingSkeleton() {
  return (
    <div className="flex-grow">
      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 md:mb-12 space-y-4 md:space-y-0">
            <div className="h-8 md:h-10 bg-gray-200 rounded w-48 md:w-64"></div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-full sm:w-48"></div>
            </div>
          </div>
          
          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
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
        </div>
      </div>
    </div>
  );
} 