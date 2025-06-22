import client from './contentful';
import { Product, ContentfulProduct } from './types';

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
    const response = await client.getEntries<ContentfulProduct>({
      content_type: 'product',
      order: ['-sys.createdAt'],
      limit: 100,
    });

    return response.items.map((item) => ({
      id: item.sys.id,
      name: item.fields.name,
      slug: item.fields.slug,
      category: item.fields.category,
      subcategory: item.fields.subcategory,
      productImage: getProductImageUrl(item.fields.productImage),
      price: item.fields.price,
      description: item.fields.description,
      detailedDescription: item.fields.detailedDescription,
      tastingNotes: item.fields.tastingNotes,
      additionalNotes: item.fields.additionalNotes,
      origin: item.fields.origin,
      alcoholContent: item.fields.alcoholContent,
      volume: item.fields.volume,
      brand: item.fields.brand,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const response = await client.getEntries({
      content_type: 'product',
      'fields.category': category,
      order: ['-sys.createdAt'],
      limit: 100,
    }) as any;

    return response.items.map((item: any) => ({
      id: item.sys.id,
      name: item.fields.name,
      slug: item.fields.slug,
      category: item.fields.category,
      subcategory: item.fields.subcategory,
      productImage: getProductImageUrl(item.fields.productImage),
      price: item.fields.price,
      description: item.fields.description,
      detailedDescription: item.fields.detailedDescription,
      tastingNotes: item.fields.tastingNotes,
      additionalNotes: item.fields.additionalNotes,
      origin: item.fields.origin,
      alcoholContent: item.fields.alcoholContent,
      volume: item.fields.volume,
      brand: item.fields.brand,
    }));
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

// Fetch a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await client.getEntry<ContentfulProduct>(id);
    return {
      id: response.sys.id,
      name: response.fields.name,
      slug: response.fields.slug,
      category: response.fields.category,
      subcategory: response.fields.subcategory,
      productImage: getProductImageUrl(response.fields.productImage),
      price: response.fields.price,
      description: response.fields.description,
      detailedDescription: response.fields.detailedDescription,
      tastingNotes: response.fields.tastingNotes,
      additionalNotes: response.fields.additionalNotes,
      origin: response.fields.origin,
      alcoholContent: response.fields.alcoholContent,
      volume: response.fields.volume,
      brand: response.fields.brand,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
} 