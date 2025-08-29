"use client";

import { useState, useEffect } from 'react';

export default function AgeVerificationModal() {
  const [isMounted, setIsMounted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [denied, setDenied] = useState(false);

  const STORAGE_KEY = 'ageVerified';

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = typeof window !== 'undefined'
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
      if (stored === 'true') {
        setShowPrompt(false);
      } else {
        // Clear any old 'denied' values from localStorage to fix the issue
        // where users were permanently blocked
        if (stored === 'denied') {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        // If not verified or denied was stored before, show the prompt again
        // This gives users a fresh chance each visit
        setShowPrompt(true);
      }
    } catch {
      setShowPrompt(true);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const shouldLockScroll = showPrompt || denied;
    const previousOverflow = document.body.style.overflow;
    if (shouldLockScroll) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflow || '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMounted, showPrompt, denied]);

  const handleAccept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
    setShowPrompt(false);
    setDenied(false);
  };

  const handleDeny = () => {
    // Don't persist the denial - just show denied state for this session
    // This allows users to try again when they visit the site again
    setDenied(true);
    setShowPrompt(false);
  };

  if (!isMounted) return null;
  if (!showPrompt && !denied) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Vibrant gradient background with blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-white to-pink-200 backdrop-blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-2xl mx-4 text-center">
        {!denied ? (
          <div className="space-y-8">
            {/* Main welcome text */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-gray-800 tracking-tight leading-none">
                WELCOME!
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-700 tracking-wide">
                PLEASE CONFIRM YOU ARE OVER 18 TO CONTINUE
              </h2>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleAccept}
                className="group relative bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white font-bold text-xl px-8 py-4 rounded-xl shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 min-w-[160px]"
              >
                Yes
                <span className="text-white group-hover:translate-x-1 transition-transform duration-300">›</span>
              </button>
              
              <button
                onClick={handleDeny}
                className="bg-black hover:bg-gray-800 text-white font-bold text-xl px-8 py-4 rounded-xl shadow-2xl hover:shadow-black/25 transform hover:scale-105 transition-all duration-300 min-w-[160px]"
              >
                No
              </button>
            </div>

            {/* Privacy disclaimer */}
            <div className="mt-12 text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <p>
                BY SUBMITTING THIS FORM, YOU AGREE TO THE PRIVACY AND COOKIE POLICY OF THIS WEBSITE. 
                THIS WEBSITE WILL MAKE USE OF COOKIES. TO LEARN MORE, PLEASE READ OUR{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                  PRIVACY POLICY
                </a>{' '}
                AND{' '}
                <a href="/cookies" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                  COOKIE STATEMENT.
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Access denied message */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black text-red-600 tracking-tight leading-none">
                ACCESS DENIED
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-700 tracking-wide">
                SORRY, YOU MUST BE AT LEAST 18 YEARS OLD TO USE THIS SITE
              </h2>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => {
                  setDenied(false);
                  setShowPrompt(true);
                }}
                className="group relative bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:from-pink-600 hover:to-fuchsia-700 text-white font-bold text-xl px-8 py-4 rounded-xl shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 min-w-[160px]"
              >
                Try Again
                <span className="text-white group-hover:translate-x-1 transition-transform duration-300">›</span>
              </button>
              
              <a
                href="https://www.google.com"
                className="bg-black hover:bg-gray-800 text-white font-bold text-xl px-8 py-4 rounded-xl shadow-2xl hover:shadow-black/25 transform hover:scale-105 transition-all duration-300 min-w-[160px] inline-block"
              >
                Leave Site
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 