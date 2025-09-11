'use client';

import React from 'react';
import { useCartStore } from '@/lib/store';
import { Product } from '@/lib/types';

interface AddToBasketButtonProps {
  product: Product;
  className?: string;
}

export default function AddToBasketButton({ product, className }: AddToBasketButtonProps) {
  const { addItem } = useCartStore();

  const handleAddToBasket = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  // Standardized button styling - this will be consistent across all product cards
  const defaultClassName = "w-full bg-[#000000] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl";

  return (
    <button 
      className={className || defaultClassName}
      onClick={handleAddToBasket}
    >
      Add to basket
    </button>
  );
}