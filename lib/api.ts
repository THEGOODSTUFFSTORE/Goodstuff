import { adminDb } from './firebase-admin';
import { collection, getDocs, query, where, doc, getDoc, orderBy, limit, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { Product } from './types';
import { getFallbackProducts } from './fallback-data';

// In-memory cache for products
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to check cache validity
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

// Helper function to get from cache
function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

// Helper function to set cache
function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Helper function to safely check if Firebase Admin is available
function isFirebaseAdminAvailable(): boolean {
  try {
    return typeof window === 'undefined' && adminDb !== null && adminDb !== undefined;
  } catch (error) {
    console.warn('Firebase Admin availability check failed:', error);
    return false;
  }
}

// Helper function to transform Contentful image URL
const getProductImageUrl = (contentfulImage: any): string => {
  if (!contentfulImage?.fields?.file?.url) {
    return '/wine.webp'; // fallback image
  }
  return `https:${contentfulImage.fields.file.url}`;
};

// Optimized fetch all products with caching and pagination
export async function getProducts(pageSize: number = 1000, lastDoc?: QueryDocumentSnapshot): Promise<Product[]> {
  try {
    // Use Admin SDK on the server to avoid initializing client SDK during build
    if (isFirebaseAdminAvailable() && adminDb) {
      let q = adminDb.collection('products').orderBy('createdAt', 'desc').limit(pageSize);
      if (lastDoc) {
        // Admin SDK pagination uses startAfter with field value; skipping for simplicity in server path                                                                                                         
      }
      const snapshot = await q.get();
      const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product))
        .filter((p: any) => (p.status || 'active') !== 'inactive' && (p.status || 'active') !== 'discontinued');
      return products;
    }
    const { db } = await import('./firebase');
    const productsRef = collection(db, 'products');
    let q = query(
      productsRef, 
      orderBy('createdAt', 'desc'), 
      limit(pageSize)
    );

    // If we have a lastDoc, start after it for pagination
    if (lastDoc) {
      q = query(
        productsRef, 
        orderBy('createdAt', 'desc'), 
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product)).filter((p: any) => (p.status || 'active') !== 'inactive' && (p.status || 'active') !== 'discontinued');

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array as fallback for all products
    console.log('Using empty array fallback for all products');
    return [];
  }
}

// Optimized fetch products by category with caching
export async function getProductsByCategory(category: string, pageSize: number = 1000): Promise<Product[]> {
  try {
    // Special handling for whisky category to include bourbon products
    const categoriesToFetch = category === 'whisky' ? ['whisky', 'bourbon'] : [category];
    let allProducts: Product[] = [];
    
    if (isFirebaseAdminAvailable() && adminDb) {
      for (const cat of categoriesToFetch) {
        const snapshot = await adminDb
          .collection('products')
          .where('category', '==', cat)
          .orderBy('createdAt', 'desc')
          .limit(pageSize)
          .get();
        const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product))
          .filter((p: any) => (p.status || 'active') !== 'inactive' && (p.status || 'active') !== 'discontinued');
        allProducts = [...allProducts, ...products];
      }
      return allProducts;
    }
    
    const { db } = await import('./firebase');
    for (const cat of categoriesToFetch) {
      const productsRef = collection(db, 'products');
      const q = query(
        productsRef, 
        where('category', '==', cat),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      const querySnapshot = await getDocs(q);

      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product)).filter((p: any) => (p.status || 'active') !== 'inactive' && (p.status || 'active') !== 'discontinued');
      
      allProducts = [...allProducts, ...products];
    }

    return allProducts;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    // Return fallback data when Firebase fails
    console.log(`Using fallback data for category: ${category}`);
    return getFallbackProducts(category);
  }
}

// Optimized fetch a single product by ID with caching
export async function getProductById(id: string): Promise<Product | null> {
  try {
    if (!id) {
      console.error('Invalid product ID provided:', id);
      return null;
    }
    console.log('Fetching product with ID:', id);
    if (isFirebaseAdminAvailable() && adminDb) {
      const adminDoc = await adminDb.collection('products').doc(id).get();
      if (!adminDoc.exists) {
        console.error('Product document does not exist for ID:', id);
        return null;
      }
      const product = { id: adminDoc.id, ...adminDoc.data() } as Product;
      const productStatus = (product as any).status;
      if (productStatus === 'inactive' || productStatus === 'discontinued') {
        return null;
      }
      return product;
    }
    const { db } = await import('./firebase');
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const productData = docSnap.data();
      console.log('Product data fetched successfully:', productData);
      const product = {
        id: docSnap.id,
        ...productData
      } as Product;
      const productStatus = (product as any).status;
      if (productStatus === 'inactive' || productStatus === 'discontinued') {
        return null;
      }

      return product;
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

// Optimized function to get products by sections (trending, popular, etc.)
export async function getProductsBySection(section: string, itemLimit: number = 6): Promise<Product[]> {
  try {
    const cacheKey = `products_section_${section}_${itemLimit}`;
    const cached = getFromCache<Product[]>(cacheKey);
    if (cached) {
      console.log(`Returning cached products for section: ${section}`);
      return cached;
    }
    if (isFirebaseAdminAvailable() && adminDb) {
      const snapshot = await adminDb
        .collection('products')
        .where('sections', 'array-contains', section)
        .orderBy('createdAt', 'desc')
        .limit(itemLimit)
        .get();
      const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setCache(cacheKey, products);
      return products;
    }
    const { db } = await import('./firebase');
    const productsRef = collection(db, 'products');
    // Optimized query with database-level sorting (requires composite index)
    const q = query(
      productsRef,
      where('sections', 'array-contains', section),
      orderBy('createdAt', 'desc'),
      limit(itemLimit)
    );
    
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));

    // Cache the results
    setCache(cacheKey, products);

    return products;
  } catch (error) {
    console.error(`Error fetching products for section ${section}:`, error);
    return [];
  }
}

// Clear cache function for manual cache invalidation
export function clearProductsCache(): void {
  cache.clear();
  console.log('Products cache cleared');
} 