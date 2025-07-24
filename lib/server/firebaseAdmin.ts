import { adminDb } from '../firebase-admin';
import { Order } from '../types';

// Generate a human-readable order number
const generateOrderNumber = async (): Promise<string> => {
  try {
    // Get current year and month for formatting
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    // Try to get the last order number to increment
    const counterRef = adminDb.collection('counters').doc('orderCounter');
    const counterDoc = await counterRef.get();
    
    let nextNumber = 1;
    if (counterDoc.exists) {
      const data = counterDoc.data();
      nextNumber = (data?.count || 0) + 1;
    }
    
    // Increment counter
    await counterRef.set({ count: nextNumber }, { merge: true });
    
    // Format: GS24120001 (GS + Year + Month + 4-digit number)
    const orderNumber = `GS${year}${month}${nextNumber.toString().padStart(4, '0')}`;
    
    return orderNumber;
  } catch (error) {
    console.error('Error generating order number:', error);
    // Fallback to timestamp-based number if counter fails
    const timestamp = Date.now().toString().slice(-8);
    return `GS${timestamp}`;
  }
};

// Create a new order (server-side)
export const createOrderServer = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>): Promise<Order> => {
  try {
    console.log('Attempting to create order with Admin SDK...');
    
    // Generate a human-readable order number
    const orderNumber = await generateOrderNumber();
    console.log('Generated order number:', orderNumber);
    
    const orderWithNumber = {
      ...orderData,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const docRef = await adminDb.collection('orders').add(orderWithNumber);
    
    console.log('Order document created, fetching the new document...');
    const newDoc = await docRef.get();
    const data = newDoc.data();
    
    if (!data) {
      throw new Error('Created document is empty');
    }

    console.log('Order created successfully with ID:', docRef.id, 'and order number:', orderNumber);
    return {
      id: newDoc.id,
      ...data
    } as Order;
  } catch (error) {
    console.error('Error creating order:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
      orderData
    });
    throw error;
  }
};

// Update an order (server-side)
export const updateOrderServer = async (id: string, orderData: Partial<Order>): Promise<void> => {
  try {
    console.log('Attempting to update order with Admin SDK...', { id, orderData });
    
    // First check if the document exists
    const docRef = adminDb.collection('orders').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.log('Document does not exist, creating it...');
    }

    // Use set with merge option instead of update
    await docRef.set({
      ...orderData,
      updatedAt: new Date().toISOString(),
    }, { merge: true }); // merge: true will only update the specified fields
    
    console.log('Order updated successfully');
  } catch (error) {
    console.error('Error updating order:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof Error && 'code' in error ? (error as any).code : undefined,
      id,
      orderData
    });
    throw error;
  }
}; 