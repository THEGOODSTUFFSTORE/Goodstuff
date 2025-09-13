"use client";
import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { GiBottleCap } from 'react-icons/gi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CategoryClient from '@/app/components/CategoryClient';
import { FaGlassWhiskey } from 'react-icons/fa';

export default function RumPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <GiBottleCap className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              Rum Collection
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Premium rums from the Caribbean and beyond
            </p>
            <div className="mt-8 text-lg text-black/80">
              Premium rums available • Free delivery for orders above Ksh. 3000
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
              <li className="text-gray-700 font-medium">Rum</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Background Image Section */}
      <div 
        className="min-h-screen bg-fixed relative"
        style={{
          backgroundImage: 'url(/rumimage.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Semi-transparent overlay for better text legibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        <CategoryClient
          category="rum"
          categoryName="Rum"
          categoryColor="bg-black"
          backgroundImage="/rumimage.jpeg"
          description="From white to dark rums, discover the spirit of the Caribbean"
          educationSections={[
            {
              title: "Rum Types",
              description: "Learn about white, gold, dark, and spiced rum varieties and their characteristics."
            },
            {
              title: "Tropical Cocktails",
              description: "Master tropical rum cocktails like Piña Colada, Mojito, and Daiquiri."
            },
            {
              title: "Caribbean Heritage",
              description: "Discover the rich history and tradition of rum making in the Caribbean."
            }
          ]}
        />
      </div>

      <Footer />
    </div>
  );
}