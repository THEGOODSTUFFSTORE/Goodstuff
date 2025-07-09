import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { Product } from './types';

// Helper function to transform Contentful image URL
const getProductImageUrl = (contentfulImage: any): string => {
  if (!contentfulImage?.fields?.file?.url) {
    return '/wine.webp'; // fallback image
  }
  return `https:${contentfulImage.fields.file.url}`;
};

// Fetch all products
export async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'), limit(100));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

// Fetch a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Product;
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
} 