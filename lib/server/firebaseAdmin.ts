import { adminDb } from '../firebase-admin';
import { Order } from '../types';

// Create a new order (server-side)
export const createOrderServer = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
  try {
    console.log('Attempting to create order with Admin SDK...');
    const docRef = await adminDb.collection('orders').add({
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    console.log('Order document created, fetching the new document...');
    const newDoc = await docRef.get();
    const data = newDoc.data();
    
    if (!data) {
      throw new Error('Created document is empty');
    }

    console.log('Order created successfully with ID:', docRef.id);
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