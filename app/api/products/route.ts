import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { Product } from '@/lib/types';

// GET /api/products - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Bypass product cache via querystring cache-buster (optional)
    const _ = searchParams.get('_');
    const productId = searchParams.get('id');
    const type = searchParams.get('type'); // trending, popular, new_arrivals, wine, non-wine
    const category = searchParams.get('category');
    const pageSize = parseInt(searchParams.get('pageSize') || '1000'); // Increased default from 50 to 1000
    
    // If ID is provided, fetch single product via Admin SDK
    if (productId) {
      if (!adminDb) {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
      }
      const doc = await adminDb.collection('products').doc(productId).get();
      if (!doc.exists) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      const product = { id: doc.id, ...doc.data() } as Product;
      if ((product as any).status === 'inactive' || (product as any).status === 'discontinued') {
        return NextResponse.json({ error: 'Product not available' }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    // Handle section-based queries efficiently
    if (type === 'trending') {
      if (!adminDb) return NextResponse.json([], { status: 200 });
      const snapshot = await adminDb
        .collection('products')
        .where('sections', 'array-contains', 'trending_deals')
        .orderBy('createdAt', 'desc')
        .limit(6)
        .get();
      const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)).filter((p: any) => p.status !== 'inactive' && p.status !== 'discontinued');
      console.log(`Fetched ${products.length} trending products`);
      return NextResponse.json(products);
    } else if (type === 'popular') {
      if (!adminDb) return NextResponse.json([], { status: 200 });
      const snapshot = await adminDb
        .collection('products')
        .where('sections', 'array-contains', 'popular')
        .orderBy('createdAt', 'desc')
        .limit(6)
        .get();
      const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)).filter((p: any) => p.status !== 'inactive' && p.status !== 'discontinued');
      console.log(`Fetched ${products.length} popular products`);
      return NextResponse.json(products);
    } else if (type === 'new_arrivals') {
      if (!adminDb) return NextResponse.json([], { status: 200 });
      const snapshot = await adminDb
        .collection('products')
        .where('sections', 'array-contains', 'new_arrivals')
        .orderBy('createdAt', 'desc')
        .limit(6)
        .get();
      const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)).filter((p: any) => p.status !== 'inactive' && p.status !== 'discontinued');
      console.log(`Fetched ${products.length} new arrival products`);
      return NextResponse.json(products);
    }

    // Handle category-based queries
    if (category && category !== 'all') {
      if (!adminDb) return NextResponse.json([], { status: 200 });
      
      // Special handling for whisky category to include bourbon products
      const categoriesToFetch = category === 'whisky' ? ['whisky', 'bourbon'] : [category];
      let allProducts: Product[] = [];
      
      for (const cat of categoriesToFetch) {
        const snapshot = await adminDb
          .collection('products')
          .where('category', '==', cat)
          .orderBy('createdAt', 'desc')
          .limit(pageSize)
          .get();
        const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)).filter((p: any) => p.status !== 'inactive' && p.status !== 'discontinued');
        allProducts = [...allProducts, ...products];
      }
      
      console.log(`Fetched ${allProducts.length} products for category: ${category}`);
      return NextResponse.json(allProducts);
    }
    
    // For wine/non-wine filtering, we still need to fetch and filter
    if (type === 'wine' || type === 'non-wine') {
      if (!adminDb) return NextResponse.json([], { status: 200 });
      const snapshot = await adminDb
        .collection('products')
        .orderBy('createdAt', 'desc')
        .limit(pageSize)
        .get();
      const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)).filter((p: any) => p.status !== 'inactive' && p.status !== 'discontinued');
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
      
      return NextResponse.json(filteredProducts.filter((p: any) => p.status !== 'inactive' && p.status !== 'discontinued'));
    }
    
    // Default: fetch all products with pagination
    if (!adminDb) return NextResponse.json([], { status: 200 });
    const snapshot = await adminDb
      .collection('products')
      .orderBy('createdAt', 'desc')
      .limit(pageSize)
      .get();
    const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product)).filter((p: any) => p.status !== 'inactive' && p.status !== 'discontinued');
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