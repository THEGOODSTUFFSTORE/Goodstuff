import React from 'react';
import Link from 'next/link';
import { FaTruck, FaBox, FaClock, FaMapMarkerAlt, FaUndo, FaPhoneAlt } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: 'Learn about The Goodstuff shipping policies, delivery options, return procedures, and customer support. Fast and reliable delivery across Kenya.',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-white to-gray-100 text-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FaTruck className="w-20 h-20 text-black" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Shipping & Returns
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              Fast, reliable delivery and hassle-free returns
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
                <Link href="/" className="text-gray-500 hover:text-green-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Shipping & Returns</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <FaClock className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-700">Same day delivery available in Nairobi</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <FaBox className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Packaging</h3>
              <p className="text-gray-700">All items carefully packaged for safe delivery</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <FaUndo className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-700">Hassle-free returns for damaged items</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <FaTruck className="w-8 h-8 text-green-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Areas</h3>
                  <p className="text-gray-700 mb-4">
                    We currently deliver to the following areas:
                  </p>
                  <ul className="grid md:grid-cols-2 gap-2 text-gray-700">
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 text-green-600 mr-2" />
                      Nairobi Central Business District
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 text-green-600 mr-2" />
                      Westlands
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 text-green-600 mr-2" />
                      Karen
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 text-green-600 mr-2" />
                      Lavington
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 text-green-600 mr-2" />
                      Kilimani
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 text-green-600 mr-2" />
                      Kileleshwa
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 text-green-600 mr-2" />
                      Parklands
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="w-4 h-4 text-green-600 mr-2" />
                      South B & South C
                    </li>
                  </ul>
                  <p className="text-gray-700 mt-4">
                    Don't see your area? Contact us to check if we can deliver to your location.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Times</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Delivery Option</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Time Frame</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Same Day Delivery</td>
                          <td className="border border-gray-300 px-4 py-2">Within 2-4 hours</td>
                          <td className="border border-gray-300 px-4 py-2">70 KES/km + 200 KES rush fee</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">Next Day Delivery</td>
                          <td className="border border-gray-300 px-4 py-2">Next business day</td>
                          <td className="border border-gray-300 px-4 py-2">70 KES/km + 100 KES priority fee</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Standard Delivery</td>
                          <td className="border border-gray-300 px-4 py-2">2-3 business days</td>
                          <td className="border border-gray-300 px-4 py-2">70 KES/km (base rate)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="text-sm text-gray-600 mt-3 space-y-2">
                    <p>* Delivery fee: 70 KES per kilometer from our store to your address</p>
                    <p>* Minimum delivery fee: 70 KES (for distances less than 1km)</p>
                    <p>* Free delivery on orders over KES 5,000 within 5km of our store</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Age Verification</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      <strong>Important:</strong> Someone who is 18 years or older must be present to receive alcohol deliveries. 
                      Valid government-issued photo ID will be required. If no one of legal age is available, 
                      the delivery will not be completed and may be rescheduled.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Tracking */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <FaBox className="w-8 h-8 text-green-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">Order Tracking</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  Track your order status through these simple steps:
                </p>
                <ol className="space-y-3">
                  <li className="flex items-start">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    <div>
                      <strong className="text-gray-900">Order Confirmation:</strong>
                      <span className="text-gray-700"> You'll receive an email confirmation with your order details</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    <div>
                      <strong className="text-gray-900">Preparation:</strong>
                      <span className="text-gray-700"> Your order is being prepared for delivery</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    <div>
                      <strong className="text-gray-900">Out for Delivery:</strong>
                      <span className="text-gray-700"> Your order is on its way to you</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    <div>
                      <strong className="text-gray-900">Delivered:</strong>
                      <span className="text-gray-700"> Order successfully delivered</span>
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            {/* Returns Policy */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <FaUndo className="w-8 h-8 text-green-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">Returns & Refunds</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Policy</h3>
                  <p className="text-gray-700 mb-4">
                    Due to the nature of alcoholic beverages and food safety regulations, we have a limited return policy:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <strong>Damaged Items:</strong> We accept returns for products that arrive damaged or defective
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <strong>Wrong Items:</strong> If you receive the wrong product, we'll replace it at no cost
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <strong>Quality Issues:</strong> Products that don't meet our quality standards
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Return Process</h3>
                  <ol className="space-y-3">
                    <li className="flex items-start">
                      <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                      <div>
                        <strong className="text-gray-900">Contact Us:</strong>
                        <span className="text-gray-700"> Call us within 24 hours of delivery at +254 700 000 000</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                      <div>
                        <strong className="text-gray-900">Provide Details:</strong>
                        <span className="text-gray-700"> Share your order number and describe the issue</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                      <div>
                        <strong className="text-gray-900">Photo Evidence:</strong>
                        <span className="text-gray-700"> Send photos of damaged items via WhatsApp or email</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                      <div>
                        <strong className="text-gray-900">Resolution:</strong>
                        <span className="text-gray-700"> We'll arrange a replacement or refund within 24 hours</span>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    <strong>Note:</strong> We cannot accept returns for products that have been opened, consumed, 
                    or where the issue is not related to damage or our error. All returns are subject to 
                    inspection and approval.
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <FaPhoneAlt className="w-8 h-8 text-green-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">Customer Support</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaPhoneAlt className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Phone Support</p>
                        <p className="text-gray-700">+254 700 000 000</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaBox className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Email Support</p>
                        <p className="text-gray-700">support@thegoodstuff.co.ke</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">WhatsApp</p>
                        <p className="text-gray-700">+254 700 000 000</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Hours</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Monday - Friday:</strong> 8:00 AM - 8:00 PM</p>
                    <p><strong>Saturday:</strong> 9:00 AM - 6:00 PM</p>
                    <p><strong>Sunday:</strong> 10:00 AM - 5:00 PM</p>
                    <p className="text-sm text-gray-600 mt-3">
                      * Emergency support available 24/7 for delivery issues
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 