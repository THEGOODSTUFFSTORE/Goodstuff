'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-lg text-gray-600">
            Something went wrong while loading this page.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">Error Details:</p>
          <p className="text-xs text-gray-400 font-mono break-all">
            {error.digest || error.message || 'Unknown error occurred'}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Home
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-400">
          <p>If this problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
}
