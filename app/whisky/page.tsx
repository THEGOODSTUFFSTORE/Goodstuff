"use client";
import React from 'react';
import Link from 'next/link';
import { FaGlassWhiskey } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CategoryClient from '@/app/components/CategoryClient';

export default function WhiskyPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-gray-100 text-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaGlassWhiskey className="w-16 h-16 mx-auto mb-6 text-black/80" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Whisky Collection
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Experience the finest whiskies from around the world
            </p>
            <div className="mt-8 text-lg text-black/80">
              Premium whiskies available • Free delivery for orders above Ksh. 3000
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
              <li className="text-gray-700 font-medium">Whisky</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Background Image Section */}
      <div 
        className="min-h-screen bg-fixed relative"
        style={{
          backgroundImage: 'url(/tequilla.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Semi-transparent overlay for better text legibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        <CategoryClient
          category="whisky"
          categoryName="Whisky"
          categoryColor="bg-black"
          backgroundImage="/tequilla.jpeg"
          description="Discover our curated collection of fine whiskies from renowned distilleries"
          educationSections={[
            {
              title: "Whisky History",
              description: "Learn about the rich history and tradition of whisky making across different regions."
            },
            {
              title: "Tasting Guide",
              description: "Master the art of whisky tasting with our comprehensive guide and expert tips."
            },
            {
              title: "Classic Cocktails",
              description: "Discover classic whisky cocktails and modern mixology techniques."
            }
          ]}
        />
      </div>

      <Footer />
    </div>
  );
} 