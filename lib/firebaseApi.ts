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
  limit 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { Product } from './types';

// Collection reference
const PRODUCTS_COLLECTION = 'products';

// Helper function to convert Firestore data to Product type
const convertFirestoreData = (doc: any): Product => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    slug: data.slug,
    category: data.category,
    subcategory: data.subcategory,
    productImage: data.productImage,
    price: data.price,
    description: data.description,
    detailedDescription: data.detailedDescription,
    tastingNotes: data.tastingNotes,
    additionalNotes: data.additionalNotes,
    origin: data.origin,
    alcoholContent: data.alcoholContent,
    volume: data.volume,
    brand: data.brand,
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