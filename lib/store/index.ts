import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { Product, CartItem, Order } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

interface UserStore {
  isAuthenticated: boolean
  user: any | null
  setUser: (user: any) => void
  logout: () => void
}

interface OrderStore {
  orders: Order[]
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order['status']) => void
}

// Cart Store
export const useCartStore = create<CartStore>()(
  devtools(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      addItem: (product: Product, quantity: number = 1) => {
        const items = get().items
        const existingItem = items.find(item => item.product.id === product.id)

        if (existingItem) {
          const updatedItems = items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
          set({
            items: updatedItems,
            totalItems: get().totalItems + quantity,
            totalAmount: get().totalAmount + (product.price * quantity)
          })
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            product,
            quantity,
            addedAt: new Date()
          }
          set({
            items: [...items, newItem],
            totalItems: get().totalItems + quantity,
            totalAmount: get().totalAmount + (product.price * quantity)
          })
        }
      },
      removeItem: (productId: string) => {
        const items = get().items
        const itemToRemove = items.find(item => item.product.id === productId)
        
        if (itemToRemove) {
          set({
            items: items.filter(item => item.product.id !== productId),
            totalItems: get().totalItems - itemToRemove.quantity,
            totalAmount: get().totalAmount - (itemToRemove.product.price * itemToRemove.quantity)
          })
        }
      },
      updateQuantity: (productId: string, quantity: number) => {
        const items = get().items
        const updatedItems = items.map(item => {
          if (item.product.id === productId) {
            const quantityDiff = quantity - item.quantity
            set({
              totalItems: get().totalItems + quantityDiff,
              totalAmount: get().totalAmount + (item.product.price * quantityDiff)
            })
            return { ...item, quantity }
          }
          return item
        })
        set({ items: updatedItems })
      },
      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0
        })
      }
    })
  )
)

// User Store
export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false })
    })
  )
)

// Order Store
export const useOrderStore = create<OrderStore>()(
  devtools(
    (set) => ({
      orders: [],
      setOrders: (orders) => set({ orders }),
      addOrder: (order) => set((state) => ({ 
        orders: [order, ...state.orders]
      })),
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(order =>
          order.id === orderId
            ? { ...order, status }
            : order
        )
      }))
    })
  )
) 