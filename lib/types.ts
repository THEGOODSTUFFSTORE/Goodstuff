export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  productImage: string;
  price: number;
  stockQuantity: number;  // Track available stock quantity
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
  pesapalOrderTrackingId?: string;
  pesapalPaymentStatus?: PesapalPaymentStatus;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string | null;
  status: 'active' | 'inactive';
}

// Pesapal related types
export interface PesapalPaymentRequest {
  amount: number;
  currency: string;
  description: string;
  callback_url: string;
  notification_id: string;
  billing_address: {
    email_address: string;
    phone_number?: string;
    country_code?: string;
    first_name?: string;
    last_name?: string;
  };
  tracking_id: string;
}

export interface PesapalPaymentResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface PesapalPaymentStatus {
  payment_method: string;
  payment_status: 'COMPLETED' | 'FAILED' | 'PENDING';
  payment_account: string;
  payment_description: string;
  payment_code: string;
  amount: number;
  currency: string;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string;
} 