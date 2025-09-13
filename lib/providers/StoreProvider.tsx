'use client'
import { useEffect } from 'react'
import { useCartStore, useUserStore } from '@/lib/store'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Only rehydrate on client side
    if (typeof window !== 'undefined') {
      try {
        useCartStore.persist.rehydrate()
        useUserStore.persist.rehydrate()
      } catch (error) {
        console.warn('Store rehydration failed:', error)
      }
    }
  }, [])

  return <>{children}</>
} 