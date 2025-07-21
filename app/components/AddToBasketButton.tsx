'use client';

import React from 'react';

interface AddToBasketButtonProps {
  productId: string;
  className?: string;
}

export default function AddToBasketButton({ productId, className = "mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300" }: AddToBasketButtonProps) {
  const handleAddToBasket = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart functionality will be handled by the cart store
    console.log('Adding product to basket:', productId);
  };

  return (
    <button 
      className={className}
      onClick={handleAddToBasket}
    >
      Add to basket
    </button>
  );
} 