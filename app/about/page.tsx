import React from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaUserTie, FaAward, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { GiWineBottle } from 'react-icons/gi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about The Goodstuff - your premier destination for fine wines, spirits, and beverages in Kenya. Discover our story, mission, and commitment to quality.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-gray-100 text-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GiWineBottle className="w-20 h-20 text-black" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              About The Goodstuff
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Your premier destination for fine wines, spirits, and exceptional beverages
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="text-gray-500 hover:text-red-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">About Us</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Our Story Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
            </div>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-xl mb-6">
                Founded with a passion for exceptional beverages, The Goodstuff has been serving Kenya's discerning customers with the finest selection of wines, spirits, and specialty drinks.
              </p>
              <p className="mb-6">
                Our journey began with a simple vision: to make premium quality beverages accessible to everyone. We believe that great drinks bring people together, create memorable moments, and enhance life's celebrations.
              </p>
              <p className="mb-6">
                From carefully curated wine collections to premium spirits and craft beverages, we take pride in offering only the best products sourced from trusted suppliers around the world.
              </p>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <FaAward className="w-8 h-8 text-red-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To provide our customers with exceptional quality beverages and outstanding service, making every purchase a delightful experience. We are committed to building lasting relationships with our customers through trust, reliability, and excellence.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <GiWineBottle className="w-8 h-8 text-red-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">Our Values</h3>
              </div>
              <ul className="text-gray-700 space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Quality first - We never compromise on the products we offer
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Customer satisfaction - Your happiness is our priority
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Integrity - Honest and transparent in all our dealings
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Innovation - Constantly improving our services
                </li>
              </ul>
            </div>
          </div>

          {/* What We Offer */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Premium Wines",
                  description: "A carefully curated selection of wines from around the world, including reds, whites, rosés, and champagnes."
                },
                {
                  title: "Fine Spirits",
                  description: "Premium whiskeys, vodkas, gins, rums, tequilas, and other spirits from renowned distilleries."
                },
                {
                  title: "Specialty Beverages",
                  description: "Unique and hard-to-find beverages, craft beers, mixers, and specialty drinks for every occasion."
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
              <p className="text-gray-700">We'd love to hear from you. Contact us for any inquiries or assistance.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <FaMapMarkerAlt className="w-8 h-8 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-gray-700">Nairobi, Kenya</p>
              </div>
              <div className="flex flex-col items-center">
                <FaPhone className="w-8 h-8 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-700">0742829072</p>
              </div>
              <div className="flex flex-col items-center">
                <FaEnvelope className="w-8 h-8 text-red-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-700">tgsliquorstore@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 