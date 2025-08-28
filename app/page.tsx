import React from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Hero from './components/Hero'
import Navbar from './components/Navbar'

// Dynamic imports for better code splitting
const SearchSection = dynamic(() => import('./components/SearchSection'), {
  loading: () => <div className="h-32 bg-gray-50 animate-pulse" />,
})

const NewArrivals = dynamic(() => import('./components/NewArrivals'), {
  loading: () => (
    <section className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
        ))}
      </div>
    </section>
  ),
})

const TrendingDeals = dynamic(() => import('./components/TrendingDeals'), {
  loading: () => (
    <section className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
        ))}
      </div>
    </section>
  ),
})

const PopularWines = dynamic(() => import('./components/PopularWines'), {
  loading: () => (
    <section className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
        ))}
      </div>
    </section>
  ),
})

const Footer = dynamic(() => import('./components/Footer'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse" />,
})

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home page',
}

function page() {
  return (
    <div>
      <Navbar />
      <Hero />
      <div 
        className="min-h-screen bg-hero-mobile bg-fixed"
        style={{
          backgroundImage: 'url(/hero.jpg)',
        }}
      >
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <SearchSection />
            <NewArrivals />
            <TrendingDeals />
            <PopularWines />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default page