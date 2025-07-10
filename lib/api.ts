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
    if (!id) {
      console.error('Invalid product ID provided:', id);
      return null;
    }

    console.log('Fetching product with ID:', id);
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const productData = docSnap.data();
      console.log('Product data fetched successfully:', productData);
      return {
        id: docSnap.id,
        ...productData
      } as Product;
    }
    console.error('Product document does not exist for ID:', id);
    return null;
  } catch (error) {
    console.error('Error fetching product:', {
      id,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
} 