import React from 'react'
import { Metadata } from 'next'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import SearchSection from './components/SearchSection'
import CategoryGrid from './components/Categories'
import TrendingDeals from './components/TrendingDeals'
import PopularWines from './components/PopularWines'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home page',
}


function page() {
  return (
    <div>
      <Navbar />
      <Hero />
      <SearchSection />
      <TrendingDeals />
      <PopularWines />
      <Footer />
    </div>
  )
}

export default page