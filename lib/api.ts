import { db } from './firebase';
import { collection, getDocs, query, where, doc, getDoc, orderBy, limit, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';
import { Product } from './types';

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

// Helper function to transform Contentful image URL
const getProductImageUrl = (contentfulImage: any): string => {
  if (!contentfulImage?.fields?.file?.url) {
    return '/wine.webp'; // fallback image
  }
  return `https:${contentfulImage.fields.file.url}`;
};

// Optimized fetch all products with caching and pagination
export async function getProducts(pageSize: number = 50, lastDoc?: QueryDocumentSnapshot): Promise<Product[]> {
  try {
    const cacheKey = `products_${pageSize}_${lastDoc?.id || 'first'}`;
    const cached = getFromCache<Product[]>(cacheKey);
    if (cached) {
      console.log('Returning cached products');
      return cached;
    }

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
    } as Product));

    // Cache the results
    setCache(cacheKey, products);
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Optimized fetch products by category with caching
export async function getProductsByCategory(category: string, pageSize: number = 50): Promise<Product[]> {
  try {
    const cacheKey = `products_category_${category}_${pageSize}`;
    const cached = getFromCache<Product[]>(cacheKey);
    if (cached) {
      console.log(`Returning cached products for category: ${category}`);
      return cached;
    }

    const productsRef = collection(db, 'products');
    const q = query(
      productsRef, 
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
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
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

// Optimized fetch a single product by ID with caching
export async function getProductById(id: string): Promise<Product | null> {
  try {
    if (!id) {
      console.error('Invalid product ID provided:', id);
      return null;
    }

    const cacheKey = `product_${id}`;
    const cached = getFromCache<Product>(cacheKey);
    if (cached) {
      console.log(`Returning cached product: ${id}`);
      return cached;
    }

    console.log('Fetching product with ID:', id);
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const productData = docSnap.data();
      console.log('Product data fetched successfully:', productData);
      const product = {
        id: docSnap.id,
        ...productData
      } as Product;

      // Cache the result
      setCache(cacheKey, product);
      
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