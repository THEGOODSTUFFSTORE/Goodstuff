import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaGlassWhiskey } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import AddToBasketButton from '@/app/components/AddToBasketButton';
import { getProductsByCategory } from '@/lib/api';
import { Product } from '@/lib/types';

export default async function BourbonPage() {
  // Get all bourbon products
  const bourbonProducts = await getProductsByCategory('bourbon');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#A76545] to-[#8B4513] text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaGlassWhiskey className="w-16 h-16 mx-auto mb-6 text-white/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Whisky Collection
            </h1>
            <p className="text-xl sm:text-2xl text-[#F5DEB3] max-w-3xl mx-auto">
              Experience the finest Kentucky and American whiskies
            </p>
            <div className="mt-8 text-lg text-[#F5DEB3]">
              {bourbonProducts.length} whiskies available • Free delivery for products above Ksh. 5000
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
                <Link href="/" className="text-gray-500 hover:text-[#A76545] transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Whisky</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Whisky Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From small-batch to single barrel, discover America's native spirit
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bourbonProducts.map((product: Product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative h-48 w-full flex items-center justify-center bg-gray-50">
                  <Image
                    src={product.productImage || '/wine.webp'}
                    alt={product.name}
                    width={150}
                    height={150}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-800 line-clamp-2 capitalize">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline mt-2">
                    <span className="text-xl font-bold text-[#A76545]">
                      Ksh {product.price.toLocaleString()}/-
                    </span>
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <AddToBasketButton productId={product.id} />
              </div>
            </div>
          ))}
        </div>

        {/* No products found */}
        {bourbonProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No whiskies available</h3>
            <p className="text-gray-600 mb-8">
              Please check back later for our whisky collection.
            </p>
            <Link
              href="/products"
              className="bg-[#A76545] text-white px-6 py-3 rounded-lg hover:bg-[#8B4513] transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Whisky Education */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h4 className="text-xl font-bold text-[#A76545] mb-3">Whisky History</h4>
            <p className="text-gray-600 text-sm">
              Learn about the rich history and traditions of whisky making.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h4 className="text-xl font-bold text-[#A76545] mb-3">Tasting Guide</h4>
            <p className="text-gray-600 text-sm">
              Discover how to appreciate the complex flavors of whisky.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h4 className="text-xl font-bold text-[#A76545] mb-3">Classic Cocktails</h4>
            <p className="text-gray-600 text-sm">
              Master the art of whisky-based cocktails like the Old Fashioned.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 