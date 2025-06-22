import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductById } from '@/lib/api';

// GET /api/products - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    const type = searchParams.get('type'); // trending, popular, wine, non-wine
    
    // If ID is provided, fetch single product
    if (productId) {
      const product = await getProductById(productId);
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(product);
    }
    
    // Otherwise, fetch all products
    const products = await getProducts();
    
    // Apply filtering based on type parameter
    let filteredProducts = products;
    
    if (type === 'wine') {
      filteredProducts = products.filter(
        (item: any) =>
          item.category.toLowerCase().includes('wine') ||
          item.subcategory.toLowerCase().includes('wine')
      );
    } else if (type === 'non-wine') {
      filteredProducts = products.filter(
        (item: any) =>
          !item.category.toLowerCase().includes('wine') &&
          !item.subcategory.toLowerCase().includes('wine')
      );
    } else if (type === 'trending') {
      // For trending, you could implement logic like:
      // - Exclude wines (since they have their own section)
      // - Maybe filter by recent additions, high ratings, etc.
      filteredProducts = products.filter(
        (item: any) =>
          !item.category.toLowerCase().includes('wine') &&
          !item.subcategory.toLowerCase().includes('wine')
      ).slice(0, 6);
    } else if (type === 'popular') {
      // For popular wines specifically
      filteredProducts = products.filter(
        (item: any) =>
          item.category.toLowerCase().includes('wine') ||
          item.subcategory.toLowerCase().includes('wine')
      ).slice(0, 6);
    }
    
    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}