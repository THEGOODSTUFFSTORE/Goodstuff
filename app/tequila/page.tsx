import React from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaGlassWhiskey } from 'react-icons/fa';
import { GiMartini } from 'react-icons/gi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import CategoryClient from '@/app/components/CategoryClient';

export default function TequilaPage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-lime-100 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <GiMartini className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6">
              Tequila Collection
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Authentic tequilas from the heart of Mexico
            </p>
            <div className="mt-8 text-lg text-black/80">
              Premium tequilas available • Free delivery for orders above Ksh. 3000
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
              <li className="text-gray-700 font-medium">Tequila</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Background Image Section */}
      <div 
        className="min-h-screen bg-fixed relative"
        style={{
          backgroundImage: 'url(/tequillaimage.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Semi-transparent overlay for better text legibility */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        <CategoryClient
          category="tequila"
          categoryName="Tequila"
          categoryColor="bg-black"
          backgroundImage="/tequillaimage.jpg"
          description="From blanco to añejo, discover authentic Mexican tequilas"
          educationSections={[
            {
              title: "Tequila Types",
              description: "Learn about blanco, reposado, añejo, and extra añejo tequila varieties."
            },
            {
              title: "Mexican Heritage",
              description: "Discover the rich tradition and craftsmanship of tequila making in Mexico."
            },
            {
              title: "Cocktail Classics",
              description: "Master classic tequila cocktails like Margarita, Paloma, and Tequila Sunrise."
            }
          ]}
        />
      </div>

      <Footer />
    </div>
  );
}