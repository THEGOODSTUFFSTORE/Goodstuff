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
        const cartAny = useCartStore as any
        const userAny = useUserStore as any
        cartAny?.persist?.rehydrate?.()
        userAny?.persist?.rehydrate?.()
      } catch (error) {
        console.warn('Store rehydration failed:', error)
      }
    }
  }, [])

  return <>{children}</>
} 