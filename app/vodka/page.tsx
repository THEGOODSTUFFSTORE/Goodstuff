import React from 'react';
import Link from 'next/link';
import { FaWineBottle } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CategoryClient from '@/app/components/CategoryClient';

export default function VodkaPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-gray-100 text-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaWineBottle className="w-16 h-16 mx-auto mb-6 text-black/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Vodka Collection
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Premium vodkas from traditional to contemporary craft distilleries
            </p>
            <div className="mt-8 text-lg text-black/80">
              Premium vodkas available • Free delivery for orders above Ksh. 3000
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
                <Link href="/" className="text-gray-500 hover:text-black transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Vodka</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Background Image Section */}
      <div 
        className="min-h-screen bg-fixed relative"
        style={{
          backgroundImage: 'url(/vodka.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Semi-transparent overlay for better text legibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        <CategoryClient
          category="vodka"
          categoryName="Vodka"
          categoryColor="bg-black"
          backgroundImage="/vodka.jpeg"
          description="From classic Russian to modern craft vodkas, find your perfect spirit"
          educationSections={[
            {
              title: "Cocktail Recipes",
              description: "Discover classic and modern vodka cocktail recipes for every occasion."
            },
            {
              title: "Vodka Types",
              description: "Learn about different vodka styles from grain to potato-based varieties."
            },
            {
              title: "Serving Guide",
              description: "Master the art of serving vodka at the perfect temperature and presentation."
            }
          ]}
        />
      </div>

      <Footer />
    </div>
  );
} 