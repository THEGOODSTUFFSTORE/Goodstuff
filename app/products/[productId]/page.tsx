import { Suspense } from 'react';
import { getProductById } from '@/lib/api';
import ProductDetails from './ProductDetails';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { FaSpinner } from 'react-icons/fa';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.productId);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center bg-white rounded-xl shadow-lg p-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 text-lg">The product you're looking for doesn't exist.</p>
            <a href="/products" className="mt-6 inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
              Browse Products
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
            <div className="text-center">
              <FaSpinner className="w-8 h-8 text-red-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading product...</p>
            </div>
          </div>
        }
      >
        <ProductDetails product={product} />
      </Suspense>
      <Footer />
    </div>
  );
}
