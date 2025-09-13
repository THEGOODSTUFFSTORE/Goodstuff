import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
            <p className="text-gray-600">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-block w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Home
            </Link>
            
            <Link
              href="/products"
              className="inline-block w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Need help? <Link href="/contact" className="text-red-600 hover:text-red-500">Contact us</Link></p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}


