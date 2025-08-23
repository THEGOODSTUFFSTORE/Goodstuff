'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AddToBasketButton from './AddToBasketButton';
import { Product } from '@/lib/types';
import { capitalizeProductName } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
  categoryLabel?: string;
  categoryColor?: string;
}

export default function ProductCard({ 
  product, 
  showCategory = true, 
  categoryLabel = "Premium",
  categoryColor = "bg-[#A76545]"
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden group">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative bg-gray-50 p-6 h-64 flex items-center justify-center">
          <Image
            src={product.productImage || '/wine.webp'}
            alt={product.name}
            width={150}
            height={150}
            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
            onError={(e: any) => {
              e.target.src = '/wine.webp';
            }}
          />
          {showCategory && (
            <div className={`absolute top-4 right-4 ${categoryColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
              {categoryLabel}
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#A76545] transition-colors">
            {capitalizeProductName(product.name)}
          </h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-[#A76545] lowercase">
              Ksh {product.price.toLocaleString()}/=
            </span>
          </div>
        </div>
      </Link>
      <div className="px-6 pb-6">
        <AddToBasketButton productId={product.id} />
      </div>
    </div>
  );
}
