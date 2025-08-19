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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {!denied ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Are you 18 years or older?</h2>
            <p className="text-sm text-gray-600 mb-6">You must be of legal drinking age to enter this site.</p>
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Yes, I am 18+
              </button>
              <button
                onClick={handleDeny}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access denied</h2>
            <p className="text-sm text-gray-600 mb-6">Sorry, you must be at least 18 years old to use this site.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setDenied(false);
                  setShowPrompt(true);
                }}
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Try Again
              </button>
              <a
                href="https://www.google.com"
                className="inline-block rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Leave site
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 