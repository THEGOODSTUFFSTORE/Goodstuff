import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductById, getProductsBySection, getProductsByCategory } from '@/lib/api';

// GET /api/products - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    const type = searchParams.get('type'); // trending, popular, new_arrivals, wine, non-wine
    const category = searchParams.get('category');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    
    // If ID is provided, fetch single product
    if (productId) {
      const product = await getProductById(productId);
      
      if (!product) {
        console.log(`Product not found with ID: ${productId}`);
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(product);
    }

    // Handle section-based queries efficiently
    if (type === 'trending') {
      const products = await getProductsBySection('trending_deals', 6);
      console.log(`Fetched ${products.length} trending products`);
      return NextResponse.json(products);
    } else if (type === 'popular') {
      const products = await getProductsBySection('popular', 6);
      console.log(`Fetched ${products.length} popular products`);
      return NextResponse.json(products);
    } else if (type === 'new_arrivals') {
      const products = await getProductsBySection('new_arrivals', 6);
      console.log(`Fetched ${products.length} new arrival products`);
      return NextResponse.json(products);
    }

    // Handle category-based queries
    if (category && category !== 'all') {
      const products = await getProductsByCategory(category, pageSize);
      console.log(`Fetched ${products.length} products for category: ${category}`);
      return NextResponse.json(products);
    }
    
    // For wine/non-wine filtering, we still need to fetch and filter
    if (type === 'wine' || type === 'non-wine') {
      const products = await getProducts(pageSize);
      let filteredProducts;
      
      if (type === 'wine') {
        filteredProducts = products.filter(
          (item: any) =>
            item.category.toLowerCase().includes('wine') ||
            item.subcategory?.toLowerCase().includes('wine')
        );
        console.log(`Filtered ${filteredProducts.length} wine products`);
      } else {
        filteredProducts = products.filter(
          (item: any) =>
            !item.category.toLowerCase().includes('wine') &&
            !item.subcategory?.toLowerCase().includes('wine')
        );
        console.log(`Filtered ${filteredProducts.length} non-wine products`);
      }
      
      return NextResponse.json(filteredProducts);
    }
    
    // Default: fetch all products with pagination
    const products = await getProducts(pageSize);
    console.log(`Fetched ${products.length} products from database`);
    
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      details: error
    });
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}