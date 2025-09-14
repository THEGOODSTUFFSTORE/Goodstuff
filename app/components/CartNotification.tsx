'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function CartNotification() {
  const [isClient, setIsClient] = useState(false)
  const cartStore = isClient ? useCartStore() : { totalItems: 0 }
  const { totalItems } = cartStore

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || totalItems === 0) return null

  return (
    <Link
      href="/basket"
      className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50 flex items-center space-x-2"
    >
      <ShoppingBag className="h-6 w-6" />
      <span className="font-medium">{totalItems}</span>
    </Link>
  )
} 