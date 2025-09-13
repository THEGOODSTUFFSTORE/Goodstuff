"use client";
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';
import ProductCard from '@/app/components/ProductCard';
import Link from 'next/link';

interface CategoryClientProps {
  category: string;
  categoryName: string;
  categoryColor: string;
  backgroundImage: string;
  description: string;
  educationSections: Array<{
    title: string;
    description: string;
  }>;
}

export default function CategoryClient({
  category,
  categoryName,
  categoryColor,
  backgroundImage,
  description,
  educationSections
}: CategoryClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const productsRef = collection(db, 'products');
        const q = query(
          productsRef,
          where('category', '==', category),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        setProducts(fetchedProducts);
      } catch (err) {
        console.error(`Error fetching ${category} products:`, err);
        setError(`Failed to load ${categoryName} products`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, categoryName]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Products Grid */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Premium {categoryName} Selection</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              categoryColor={categoryColor}
            />
          ))}
        </div>

        {/* Quick Access to All Products */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse All {categoryName}</h3>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Browse our complete {categoryName.toLowerCase()} collection
            </p>
            <Link href={`/products?category=${category}`}>
              <button className={`${categoryColor} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity`}>
                View All {products.length} {categoryName}
              </button>
            </Link>
          </div>
        </div>

        {/* Education Sections */}
        {educationSections.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {educationSections.map((section, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-bold text-black mb-3">{section.title}</h4>
                <p className="text-gray-600 text-sm">
                  {section.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
