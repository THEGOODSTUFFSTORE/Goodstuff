'use client';
import React from 'react';

import Link from 'next/link';
import { FaShieldAlt, FaGavel } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Read The Goodstuff Terms and Conditions. Learn about our policies, user agreements, and legal terms for using our platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <FaGavel className="w-20 h-20" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
              Please read these terms carefully before using our services
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
                <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">Terms & Conditions</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Last Updated */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-800">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center mb-6">
                <FaShieldAlt className="w-8 h-8 text-blue-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Welcome to The Goodstuff. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access our service.
              </p>
            </div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {/* Age Verification */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. Age Verification & Legal Requirements</h3>
                <div className="text-gray-700 space-y-4">
                  <p>
                    You must be at least 18 years old to purchase alcoholic beverages from The Goodstuff. By using our services, you confirm that you meet this age requirement.
                  </p>
                  <p>
                    We reserve the right to request proof of age at any time during the ordering process or upon delivery. Failure to provide valid identification may result in order cancellation.
                  </p>
                  <p>
                    All alcohol sales are subject to Kenyan law and regulations. We comply with all applicable local, national, and international laws regarding the sale and distribution of alcoholic beverages.
                  </p>
                </div>
              </div>

              {/* Account Terms */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">2. Account Terms</h3>
                <div className="text-gray-700 space-y-4">
                  <p>
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                  </p>
                  <p>
                    You are responsible for safeguarding the password and for maintaining the security of your account. You agree not to disclose your password to any third party.
                  </p>
                  <p>
                    You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                  </p>
                </div>
              </div>

              {/* Orders and Payments */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">3. Orders and Payments</h3>
                <div className="text-gray-700 space-y-4">
                  <p>
                    All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason at any time.
                  </p>
                  <p>
                    Prices are subject to change without notice. The price charged will be the price displayed at the time of order confirmation.
                  </p>
                  <p>
                    Payment must be made in full before delivery. We accept various payment methods as displayed on our platform.
                  </p>
                  <p>
                    All prices are in Kenyan Shillings (KES) and include applicable taxes unless otherwise stated.
                  </p>
                </div>
              </div>

              {/* Delivery Terms */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">4. Delivery Terms</h3>
                <div className="text-gray-700 space-y-4">
                  <p>
                    Delivery is available within our service areas. Delivery times are estimates and may vary due to factors beyond our control.
                  </p>
                  <p>
                    Someone who is 18 years or older must be present to receive alcohol deliveries. Valid identification may be required.
                  </p>
                  <p>
                    If no one is available to receive the delivery, we may attempt redelivery or hold the order for pickup. Additional charges may apply.
                  </p>
                  <p>
                    Risk of loss and title for products pass to you upon delivery to the specified address.
                  </p>
                </div>
              </div>

              {/* Returns and Refunds */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">5. Returns and Refunds</h3>
                <div className="text-gray-700 space-y-4">
                  <p>
                    Due to the nature of alcoholic beverages, we generally do not accept returns unless the product is defective or damaged.
                  </p>
                  <p>
                    If you receive a damaged or defective product, please contact us within 24 hours of delivery for a replacement or refund.
                  </p>
                  <p>
                    Refunds will be processed using the original payment method within 5-10 business days after approval.
                  </p>
                </div>
              </div>

              {/* Prohibited Uses */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">6. Prohibited Uses</h3>
                <div className="text-gray-700 space-y-4">
                  <p>You may not use our service:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                    <li>To transmit viruses or any other type of malicious code</li>
                  </ul>
                </div>
              </div>

              {/* Limitation of Liability */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h3>
                <div className="text-gray-700 space-y-4">
                  <p>
                    In no case shall The Goodstuff, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.
                  </p>
                  <p>
                    Our liability is limited to the maximum extent permitted by law.
                  </p>
                </div>
              </div>

              {/* Intellectual Property */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">8. Intellectual Property</h3>
                <div className="text-gray-700 space-y-4">
                  <p>
                    The service and its original content, features, and functionality are and will remain the exclusive property of The Goodstuff and its licensors.
                  </p>
                  <p>
                    The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used without our prior written consent.
                  </p>
                </div>
              </div>

              {/* Changes to Terms */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">9. Changes to Terms</h3>
                <div className="text-gray-700 space-y-4">
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                  <p>
                    Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">10. Contact Information</h3>
                <div className="text-gray-700 space-y-4">
                  <p>
                    If you have any questions about these Terms and Conditions, please contact us:
                  </p>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> tgsliquorstore@gmail.com</li>
                    <li><strong>Phone:</strong> 0742829072</li>
                    <li><strong>Address:</strong> Nairobi, Kenya</li>
                  </ul>
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