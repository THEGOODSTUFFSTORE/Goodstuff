'use client';

import React from 'react';

interface AddToBasketButtonProps {
  productId: string;
  className?: string;
}

export default function AddToBasketButton({ productId, className }: AddToBasketButtonProps) {
  const handleAddToBasket = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart functionality will be handled by the cart store
    console.log('Adding product to basket:', productId);
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