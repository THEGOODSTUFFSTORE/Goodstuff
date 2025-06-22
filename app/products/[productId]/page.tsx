import React from 'react';
import { FaHeart, FaFacebookF, FaTwitter, FaWhatsapp, FaLink, FaCheckCircle, FaStar, FaShoppingCart, FaTruck, FaShieldAlt, FaUndoAlt } from 'react-icons/fa';
import { MdOutlineDeliveryDining, MdLocalShipping, MdSecurity } from "react-icons/md";
import { BiHeart } from 'react-icons/bi';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { Product } from '@/lib/types';

interface ProductDetailProps {
  params: {
    productId: string;
  };
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  // Await params in Next.js 15
  const { productId } = await params;
  
  // Fetch product data from API
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/products?id=${productId}`, { cache: 'no-store' });
  const product = await response.json();

  // Fallback data if product not found
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center bg-white rounded-xl shadow-lg p-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 text-lg">The product you're looking for doesn't exist.</p>
            <button className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
              Browse Products
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <a href="/" className="text-gray-500 hover:text-red-600 transition-colors">Home</a>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <a href="/Categories" className="text-gray-500 hover:text-red-600 transition-colors">{product.category}</a>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 font-medium">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            {/* Product Image Section */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-12 flex items-center justify-center">
              <div className="relative group">
                <img 
                  src={product.productImage} 
                  alt={product.name} 
                  className="max-w-full h-auto object-contain max-h-[600px] transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Premium
                </div>
              </div>
            </div>

            {/* Product Information Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Product Header */}
                <div className="space-y-2">
                  {product.brand && (
                    <p className="text-red-600 font-semibold text-lg uppercase tracking-wide">{product.brand}</p>
                  )}
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-5 h-5" />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">(24 reviews)</span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-4xl font-bold text-red-600">Ksh {product.price.toLocaleString()}</span>
                    <span className="text-gray-500 line-through text-xl">Ksh {Math.round(product.price * 1.2).toLocaleString()}</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Save 17%
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">Inclusive of all taxes • Free delivery</p>
                </div>

                {/* Product Quick Info */}
                {(product.origin || product.alcoholContent || product.volume) && (
                  <div className="grid grid-cols-2 gap-4">
                    {product.origin && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-500 text-sm font-medium">Origin</p>
                        <p className="text-gray-900 font-semibold">{product.origin}</p>
                      </div>
                    )}
                    {product.alcoholContent && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-500 text-sm font-medium">Alcohol</p>
                        <p className="text-gray-900 font-semibold">{product.alcoholContent}</p>
                      </div>
                    )}
                    {product.volume && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-500 text-sm font-medium">Volume</p>
                        <p className="text-gray-900 font-semibold">{product.volume}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Short Description */}
                {product.description && (
                  <div className="border-l-4 border-red-600 pl-6">
                    <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  <div className="flex space-x-4">
                    <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
                      <FaShoppingCart />
                      <span>Add to Cart</span>
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center">
                      <BiHeart className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <button className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                    Buy Now - Express Checkout
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <MdLocalShipping className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <p className="text-xs text-gray-600 font-medium">Fast Delivery</p>
                  </div>
                  <div className="text-center">
                    <MdSecurity className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-xs text-gray-600 font-medium">Secure Payment</p>
                  </div>
                  <div className="text-center">
                    <FaUndoAlt className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                    <p className="text-xs text-gray-600 font-medium">Easy Returns</p>
                  </div>
                </div>

                {/* Social Share */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <span className="text-gray-600 font-medium">Share:</span>
                  <div className="flex space-x-3">
                    <a href="#" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                      <FaFacebookF className="w-4 h-4" />
                    </a>
                    <a href="#" className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors">
                      <FaTwitter className="w-4 h-4" />
                    </a>
                    <a href="#" className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors">
                      <FaWhatsapp className="w-4 h-4" />
                    </a>
                    <a href="#" className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition-colors">
                      <FaLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Information Card */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
          <div className="flex items-center mb-6">
            <div className="bg-green-600 rounded-full p-3 mr-4">
              <FaTruck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">24/7 Express Delivery</h3>
              <p className="text-green-700">Get your order delivered lightning fast</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-green-600 w-5 h-5" />
              <span className="text-gray-700">Delivery in 20-50 minutes within Nairobi</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-green-600 w-5 h-5" />
              <span className="text-gray-700">Next-day country-wide delivery</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-green-600 w-5 h-5" />
              <span className="text-gray-700">Order before 4pm for same-day delivery</span>
            </div>
            <div className="flex items-center space-x-3">
              <FaCheckCircle className="text-green-600 w-5 h-5" />
              <span className="text-gray-700">Free delivery on orders over Ksh 5,000</span>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8" aria-label="Tabs">
              <a href="#" className="border-red-600 text-red-600 whitespace-nowrap py-6 px-1 border-b-2 font-semibold text-lg" aria-current="page">
                {product.detailedDescription ? 'Product Details' : 'Description'}
              </a>
              {product.tastingNotes && (
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-6 px-1 border-b-2 font-medium text-lg transition-colors">Tasting Notes</a>
              )}
              <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-6 px-1 border-b-2 font-medium text-lg transition-colors">Specifications</a>
              {product.additionalNotes && (
                <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-6 px-1 border-b-2 font-medium text-lg transition-colors">Additional Info</a>
              )}
              <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-6 px-1 border-b-2 font-medium text-lg transition-colors">Reviews <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">24</span></a>
            </nav>
          </div>

          <div className="p-8">
            {product.detailedDescription || product.tastingNotes || product.additionalNotes ? (
              <div className="space-y-8">
                {/* Detailed Description */}
                {product.detailedDescription && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-8 bg-red-600 mr-4 rounded"></span>
                      About {product.name}
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="whitespace-pre-line">{product.detailedDescription}</p>
                    </div>
                  </div>
                )}

                {/* Tasting Notes */}
                {product.tastingNotes && (
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-8 bg-amber-600 mr-4 rounded"></span>
                      Tasting Notes
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="whitespace-pre-line">{product.tastingNotes}</p>
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {product.additionalNotes && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-8 bg-blue-600 mr-4 rounded"></span>
                      Additional Information
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      <p className="whitespace-pre-line">{product.additionalNotes}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-8 bg-red-600 mr-4 rounded"></span>
                    Product Description
                  </h2>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p>{product.description || "Delight your senses with the harmonious blend of flavors from this exceptional product. This premium selection offers an intriguing journey of taste and quality."}</p>
                  </div>
                </div>
                
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-8 bg-amber-600 mr-4 rounded"></span>
                    Tasting Notes
                  </h2>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p>This product strikes a beautiful balance between richness and subtlety. Aromas of ripe fruits and spices give way to subtle undertones, delivering a powerful, lingering finish that's testament to its quality and craftsmanship.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Why Choose Oaks & Corks */}
            <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Oaks & Corks?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaTruck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast Delivery</h3>
                  <p className="text-gray-600 text-sm">Get your {product.name} delivered in under 30 minutes anywhere in Nairobi.</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaShieldAlt className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
                  <p className="text-gray-600 text-sm">Curated selection of the finest wines and spirits from around the world.</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Satisfaction Guaranteed</h3>
                  <p className="text-gray-600 text-sm">Not happy with your purchase? We offer hassle-free returns and exchanges.</p>
                </div>
              </div>
            </div>

            {/* Product Price Information */}
            <div className="mt-8 bg-red-50 rounded-xl p-6 border border-red-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-1 h-8 bg-red-600 mr-4 rounded"></span>
                {product.name} Pricing in Kenya
              </h2>
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">{product.category} / {product.subcategory}</span>
                  <span className="text-2xl font-bold text-red-600">Ksh {product.price.toLocaleString()}/-</span>
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
