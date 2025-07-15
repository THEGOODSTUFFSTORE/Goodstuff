'use client'

import { useEffect } from 'react'
import { useCartStore, useUserStore } from '@/lib/store'

export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    useCartStore.persist.rehydrate()
    useUserStore.persist.rehydrate()
  }, [])

  return children
} 