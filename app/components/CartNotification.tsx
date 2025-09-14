'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'

export default function CartNotification() {
  const totalItems = useCartStore((state) => state.totalItems)

  if (totalItems === 0) return null

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