import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { Product, Order, OrderItem, Customer } from './types';

// Collection references
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

// Helper function to convert Firestore data to Product type
const convertFirestoreData = (doc: any): Product => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    slug: data.slug,
    category: data.category,
    subcategory: data.subcategory,
    type: data.type,
    productImage: data.productImage,
    price: data.price,
    stockQuantity: data.stockQuantity || 0,
    description: data.description,
    detailedDescription: data.detailedDescription,
    tastingNotes: data.tastingNotes,
    additionalNotes: data.additionalNotes,
    origin: data.origin,
    alcoholContent: data.alcoholContent,
    volume: data.volume,
    brand: data.brand,
    status: data.status,
    sections: data.sections || [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

// Helper function to convert Firestore data to Order type
const convertOrderData = (doc: any): Order => {
  const data = doc.data();
  return {
    id: doc.id,
    orderNumber: data.orderNumber || data.id, // Fallback to document ID for older orders
    userId: data.userId,
    userEmail: data.userEmail,
    items: data.items,
    totalItems: data.totalItems,
    totalAmount: data.totalAmount,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    shippingAddress: data.shippingAddress,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus,
    trackingNumber: data.trackingNumber,
    pesapalOrderTrackingId: data.pesapalOrderTrackingId,
    pesapalPaymentStatus: data.pesapalPaymentStatus,
  };
};

// Helper function to convert Firestore data to Customer type
const convertCustomerData = (user: any, orders: Order[]): Customer => {
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const lastOrder = orders.length > 0 ? orders[0].createdAt : null;

  return {
    id: user.uid,
    name: user.displayName || 'N/A',
    email: user.email || 'N/A',
    phone: user.phoneNumber || 'N/A',
    joinDate: user.metadata.creationTime,
    totalOrders: orders.length,
    totalSpent: totalSpent,
    lastOrder: lastOrder,
    status: user.disabled ? 'inactive' : 'active'
  };
};

// Upload product image to Firebase Storage
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
  try {
    // Create optimized storage path
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const fileName = `${productId}-${timestamp}.${fileExtension}`;
    const storageRef = ref(storage, `products/${fileName}`);

    // Add metadata for better caching and performance
    const metadata = {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000', // Cache for 1 year
    };

    // Upload with metadata
    await uploadBytes(storageRef, file, metadata);
    
    // Get download URL with a short timeout to ensure faster response
    const downloadURL = await Promise.race([
      getDownloadURL(storageRef),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout')), 10000)
      )
    ]) as string;

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Delete product image from Firebase Storage
export const deleteProductImage = async (imageUrl: string) => {
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    const newDoc = await getDoc(docRef);
    return convertFirestoreData(newDoc);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(convertFirestoreData);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, PRODUCTS_COLLECTION),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      )
    );
    return querySnapshot.docs.map(convertFirestoreData);
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertFirestoreData(docSnap);
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Update a product
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    const newDoc = await getDoc(docRef);
    return convertOrderData(newDoc);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get all orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(convertOrderData);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

// Get orders by user ID
export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, ORDERS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
    );
    return querySnapshot.docs.map(convertOrderData);
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    return [];
  }
};

// Get a single order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return convertOrderData(docSnap);
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

// Update an order
export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    await updateDoc(docRef, {
      ...orderData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Get order statistics
export const getOrderStats = async (): Promise<{ totalOrders: number; totalRevenue: number }> => {
  try {
    const querySnapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    const orders = querySnapshot.docs.map(convertOrderData);
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    return { totalOrders, totalRevenue };
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return { totalOrders: 0, totalRevenue: 0 };
  }
}; 

// Get all customers with their order data
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    // Get all users from Firebase Auth
    // This part of the code was removed as per the edit hint.
    // The original code used firebase-admin.listUsers() which is server-side.
    // For client-side, we would typically fetch users from Firebase Auth directly
    // or use a different method if available.
    // For now, we'll return an empty array or throw an error if not implemented.
    console.warn('getCustomers function is not fully implemented for client-side use.');
    return [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

// Get customer by ID with their order data
export const getCustomerById = async (userId: string): Promise<Customer | null> => {
  try {
    // Get user from Firebase Auth
    // This part of the code was removed as per the edit hint.
    // The original code used firebase-admin.getUser() which is server-side.
    // For client-side, we would typically fetch users from Firebase Auth directly
    // or use a different method if available.
    // For now, we'll return null or throw an error if not implemented.
    console.warn('getCustomerById function is not fully implemented for client-side use.');
    return null;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
};

// Update customer status (active/inactive)
export const updateCustomerStatus = async (userId: string, disabled: boolean): Promise<void> => {
  try {
    // This part of the code was removed as per the edit hint.
    // The original code used firebase-admin.updateUser() which is server-side.
    // For client-side, we would typically update users directly in Firebase Auth
    // or use a different method if available.
    // For now, we'll return or throw an error if not implemented.
    console.warn('updateCustomerStatus function is not fully implemented for client-side use.');
  } catch (error) {
    console.error('Error updating customer status:', error);
    throw error;
  }
}; 