'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { Product } from '@/lib/types';

interface AddToBasketButtonProps {
  product: Product;
  className?: string;
}

export default function AddToBasketButton({ product, className }: AddToBasketButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddToBasket = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isClient) {
      addItem(product, 1);
    }
  };

  // Standardized button styling - this will be consistent across all product cards
  const defaultClassName = "w-full bg-[#000000] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed";
  const isOutOfStock = (product.status === 'out_of_stock') || (product.stockQuantity <= 0);

  // Don't render during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <button 
        className={className || defaultClassName}
        disabled={true}
        aria-disabled={true}
      >
        Add to basket
      </button>
    );
  }

  return (
    <button 
      className={className || defaultClassName}
      onClick={handleAddToBasket}
      disabled={isOutOfStock}
      aria-disabled={isOutOfStock}
      title={isOutOfStock ? 'Out of stock' : 'Add to basket'}
    >
      {isOutOfStock ? 'Out of stock' : 'Add to basket'}
    </button>
  );
}