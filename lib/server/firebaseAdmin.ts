import { adminDb, isAdminReady } from '../firebase-admin';
import { Order } from '../types';

// Helper function to ensure admin is ready
const ensureAdminReady = () => {
  if (!isAdminReady() || !adminDb) {
    throw new Error('Firebase Admin is not initialized. Please check server configuration.');
  }
};

// Generate a human-readable order number
const generateOrderNumber = async (): Promise<string> => {
  try {
    ensureAdminReady();
    
    // Get current year and month for formatting
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    // Try to get the last order number to increment
    const counterRef = adminDb!.collection('counters').doc('orderCounter');
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
    ensureAdminReady();
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
    
    const docRef = await adminDb!.collection('orders').add(orderWithNumber);
    
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
    ensureAdminReady();
    console.log('Attempting to update order with Admin SDK...', { id, orderData });
    
    // First check if the document exists
    const docRef = adminDb!.collection('orders').doc(id);
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

// Link guest orders to a user account when they sign up/login
export const linkGuestOrdersToUser = async (userEmail: string, userId: string): Promise<number> => {
  try {
    ensureAdminReady();
    console.log('Linking guest orders to user:', { userEmail, userId });
    
    // Find all guest orders with the user's email
    const guestOrdersSnapshot = await adminDb!.collection('orders')
      .where('userId', '==', 'guest')
      .where('userEmail', '==', userEmail)
      .get();
    
    console.log(`Found ${guestOrdersSnapshot.size} guest orders to link`);
    
    const batch = adminDb!.batch();
    let linkedCount = 0;
    
    guestOrdersSnapshot.docs.forEach(doc => {
      const orderRef = adminDb!.collection('orders').doc(doc.id);
      batch.update(orderRef, {
        userId: userId,
        updatedAt: new Date().toISOString(),
        linkedToUser: true,
        linkedAt: new Date().toISOString()
      });
      linkedCount++;
    });
    
    if (linkedCount > 0) {
      await batch.commit();
      console.log(`Successfully linked ${linkedCount} guest orders to user ${userId}`);
    }
    
    return linkedCount;
  } catch (error) {
    console.error('Error linking guest orders to user:', error);
    throw error;
  }
};

// Get orders by user (includes both user orders and linked guest orders)
export const getOrdersByUserServer = async (userId: string, userEmail?: string): Promise<Order[]> => {
  try {
    ensureAdminReady();
    console.log('Fetching orders for user:', { userId, userEmail });
    
    const orders: Order[] = [];
    const orderIds = new Set<string>();
    
    // Get orders with matching userId
    const userOrdersSnapshot = await adminDb!.collection('orders')
      .where('userId', '==', userId)
      .get();
    
    userOrdersSnapshot.docs.forEach(doc => {
      if (!orderIds.has(doc.id)) {
        orders.push({ id: doc.id, ...doc.data() } as Order);
        orderIds.add(doc.id);
      }
    });
    
    // If email is provided, also get guest orders with that email
    if (userEmail) {
      const guestOrdersSnapshot = await adminDb!.collection('orders')
        .where('userId', '==', 'guest')
        .where('userEmail', '==', userEmail)
        .get();
      
      guestOrdersSnapshot.docs.forEach(doc => {
        if (!orderIds.has(doc.id)) {
          orders.push({ id: doc.id, ...doc.data() } as Order);
          orderIds.add(doc.id);
        }
      });
    }
    
    // Sort by creation date
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log(`Found ${orders.length} total orders for user`);
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

// Reduce product inventory when order is paid
export const reduceProductInventory = async (orderItems: any[]): Promise<void> => {
  try {
    ensureAdminReady();
    console.log('Starting inventory reduction for order items:', orderItems);
    
    const batch = adminDb!.batch();
    
    for (const item of orderItems) {
      const productRef = adminDb!.collection('products').doc(item.productId);
      const productDoc = await productRef.get();
      
      if (productDoc.exists) {
        const productData = productDoc.data();
        const currentStock = productData?.stockQuantity || 0;
        const orderedQuantity = item.quantity;
        const newStock = Math.max(0, currentStock - orderedQuantity); // Prevent negative stock
        
        console.log(`Reducing inventory for product ${item.productId}: ${currentStock} - ${orderedQuantity} = ${newStock}`);
        
        // Automatically update product status based on stock
        let newStatus = productData?.status || 'active';
        if (newStock === 0) {
          newStatus = 'out_of_stock';
        } else if (newStock <= 10 && newStatus === 'out_of_stock') {
          newStatus = 'active'; // Reactivate if stock is restored
        }
        
        batch.update(productRef, {
          stockQuantity: newStock,
          status: newStatus,
          updatedAt: new Date().toISOString()
        });
      } else {
        console.warn(`Product ${item.productId} not found, skipping inventory reduction`);
      }
    }
    
    await batch.commit();
    console.log('Inventory reduction completed successfully');
  } catch (error) {
    console.error('Error reducing product inventory:', error);
    throw error;
  }
}; 