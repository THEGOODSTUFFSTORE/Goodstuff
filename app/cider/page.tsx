import React from 'react';
import Link from 'next/link';
import { FaApple } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CategoryClient from '@/app/components/CategoryClient';

export default function CiderPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-lime-100 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <FaApple className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              Cider Collection
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Refreshing ciders from traditional to modern craft varieties
            </p>
            <div className="mt-8 text-lg text-black/80">
              Premium ciders available • Free delivery for orders above Ksh. 3000
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
              <li className="text-gray-700 font-medium">Cider</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Background Image Section */}
      <div 
        className="min-h-screen bg-fixed relative"
        style={{
          backgroundImage: 'url(/cider.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Semi-transparent overlay for better text legibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        <CategoryClient
          category="cider"
          categoryName="Cider"
          categoryColor="bg-black"
          backgroundImage="/cider.jpg"
          description="From dry to sweet, discover refreshing ciders for every taste"
          educationSections={[
            {
              title: "Cider Types",
              description: "Learn about dry, semi-dry, and sweet cider varieties and their characteristics."
            },
            {
              title: "Craft Cider",
              description: "Discover the art of craft cider making and traditional techniques."
            },
            {
              title: "Food Pairing",
              description: "Master the art of pairing cider with food for the perfect dining experience."
            }
          ]}
        />
      </div>

      <Footer />
    </div>
  );
}