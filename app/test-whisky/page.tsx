"use client";
import React from 'react';

export default function TestWhiskyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gradient-to-r from-white to-gray-100 text-black py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Test Whisky Page
            </h1>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto">
              This is a test page to check if the basic structure works
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
