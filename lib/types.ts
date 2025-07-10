export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  productImage: string;
  price: number;
  description?: string;
  detailedDescription?: string;
  tastingNotes?: string;
  additionalNotes?: string;
  origin?: string;
  alcoholContent?: string;
  volume?: string;
  brand?: string;
  status?: string;
  sections?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Wine {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  type: string;
  vintage: string;
  description?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  publishDate: string;
  tags: string[];
}

// Cart-related types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Order-related types
export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  priceAtOrder: number;
  category: string;
  subcategory: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  totalItems: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  trackingNumber?: string;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
} 