"use client";
import React from 'react';
import Link from 'next/link';
import { FaGlassWhiskey } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CategoryClient from '@/app/components/CategoryClient';

export default function SpiritPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <FaGlassWhiskey className="h-16 w-16 text-purple-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              Spirit Collection
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Premium spirits from around the world
            </p>
            <div className="mt-8 text-lg text-black/80">
              Premium spirits available • Free delivery for orders above Ksh. 3000
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
              <li className="text-gray-700 font-medium">Spirits</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Background Image Section */}
      <div 
        className="min-h-screen bg-fixed relative"
        style={{
          backgroundImage: 'url(/spirit.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Semi-transparent overlay for better text legibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        <CategoryClient
          category="spirit"
          categoryName="Spirits"
          categoryColor="bg-black"
          backgroundImage="/spirit.jpg"
          description="Discover our curated collection of premium spirits from renowned distilleries"
          educationSections={[
            {
              title: "Spirit Categories",
              description: "Learn about different spirit categories and their unique characteristics."
            },
            {
              title: "Distillation Process",
              description: "Discover the art and science behind spirit distillation."
            },
            {
              title: "Tasting Guide",
              description: "Master the art of spirit tasting and appreciation."
            }
          ]}
        />
      </div>

      <Footer />
    </div>
  );
}