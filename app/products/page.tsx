import { Suspense } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductsList from './ProductsList';

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Suspense fallback={<ProductsLoadingSkeleton />}>
        <ProductsList />
      </Suspense>
      <Footer />
    </div>
  );
}

function ProductsLoadingSkeleton() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-12 bg-red-700/50 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-6 bg-red-700/50 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

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
    </>
  );
} 