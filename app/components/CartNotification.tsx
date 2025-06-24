"use client";
import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useCart } from '@/lib/cartContext';

interface CartNotificationProps {
  show: boolean;
  onClose: () => void;
  productName?: string;
}

export default function CartNotification({ show, onClose, productName }: CartNotificationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 z-50 transform transition-all duration-500 ease-out">
      <div className="bg-white border border-green-200 rounded-xl shadow-2xl p-4 max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <FaCheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-grow">
            <p className="text-gray-900 font-semibold">Added to cart!</p>
            {productName && (
              <p className="text-gray-600 text-sm">{productName}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook to manage cart notifications
export function useCartNotification() {
  const [notification, setNotification] = useState<{
    show: boolean;
    productName?: string;
  }>({ show: false });

  const showNotification = (productName?: string) => {
    setNotification({ show: true, productName });
  };

  const hideNotification = () => {
    setNotification({ show: false });
  };

  return {
    notification,
    showNotification,
    hideNotification,
  };
} 