import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductById } from '@/lib/api';

// GET /api/products - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    const type = searchParams.get('type'); // trending, popular, new_arrivals, wine, non-wine
    
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
      // Filter products marked as trending
      filteredProducts = products.filter(
        (item: any) => item.sections?.includes('trending_deals')
      ).slice(0, 6);
    } else if (type === 'popular') {
      // Filter products marked as popular
      filteredProducts = products.filter(
        (item: any) => item.sections?.includes('popular')
      ).slice(0, 6);
    } else if (type === 'new_arrivals') {
      // Filter products marked as new arrivals
      filteredProducts = products.filter(
        (item: any) => item.sections?.includes('new_arrivals')
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