"use client";
import { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const AgeVerificationModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showDeniedMessage, setShowDeniedMessage] = useState(false);

  useEffect(() => {
    // Check if user has already verified their age
    const hasVerified = localStorage.getItem('ageVerified');
    
    if (!hasVerified) {
      // Show modal after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleYes = () => {
    setIsClosing(true);
    localStorage.setItem('ageVerified', 'true');
    
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  const handleNo = () => {
    setShowDeniedMessage(true);
  };

  const handleLeave = () => {
    // Redirect to a different website or show a message
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`}>
      <div className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {!showDeniedMessage ? (
          // Age verification form
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Age Verification Required</h2>
              <p className="text-gray-600 text-sm">
                The Goodstuff contains products intended for adults. Please confirm your age to continue.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Are you 18 years or older?
              </h3>
              <p className="text-red-700 text-sm">
                You must be of legal drinking age to access this website.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleYes}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Yes, I'm 18+
              </button>
              <button
                onClick={handleNo}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                No, I'm under 18
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              By clicking "Yes", you confirm that you are of legal drinking age in your jurisdiction.
            </p>
          </div>
        ) : (
          // Access denied message
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
              <p className="text-gray-600">
                Sorry, you must be 18 years or older to access The Goodstuff website.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">
                This website contains products intended for adults only. Please return when you reach the legal drinking age.
              </p>
            </div>

            <button
              onClick={handleLeave}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Leave Website
            </button>

            <p className="text-xs text-gray-500 mt-4">
              Thank you for your understanding.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeVerificationModal; 