// Fallback data for when Firebase is not available
export const fallbackProducts = {
  whisky: [
    {
      id: 'fallback-whisky-1',
      name: 'Premium Whisky Collection',
      slug: 'premium-whisky-collection',
      price: 2500,
      category: 'whisky',
      subcategory: 'premium',
      type: 'collection',
      productImage: '/whisky.webp',
      stockQuantity: 10,
      description: 'A curated selection of premium whiskies from around the world',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  wine: [
    {
      id: 'fallback-wine-1',
      name: 'Premium Wine Collection',
      slug: 'premium-wine-collection',
      price: 1800,
      category: 'wine',
      subcategory: 'premium',
      type: 'collection',
      productImage: '/wine.webp',
      stockQuantity: 15,
      description: 'A curated selection of premium wines from renowned vineyards',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  gin: [
    {
      id: 'fallback-gin-1',
      name: 'Premium Gin Collection',
      slug: 'premium-gin-collection',
      price: 2200,
      category: 'gin',
      subcategory: 'premium',
      type: 'collection',
      productImage: '/gin.webp',
      stockQuantity: 12,
      description: 'A curated selection of premium gins with unique botanical profiles',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  vodka: [
    {
      id: 'fallback-vodka-1',
      name: 'Premium Vodka Collection',
      slug: 'premium-vodka-collection',
      price: 2000,
      category: 'vodka',
      subcategory: 'premium',
      type: 'collection',
      productImage: '/vodka.webp',
      stockQuantity: 8,
      description: 'A curated selection of premium vodkas',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  beer: [
    {
      id: 'fallback-beer-1',
      name: 'Premium Beer Collection',
      slug: 'premium-beer-collection',
      price: 800,
      category: 'beer',
      subcategory: 'premium',
      type: 'collection',
      productImage: '/beer.webp',
      stockQuantity: 20,
      description: 'A curated selection of premium beers',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  rum: [
    {
      id: 'fallback-rum-1',
      name: 'Premium Rum Collection',
      slug: 'premium-rum-collection',
      price: 2100,
      category: 'rum',
      subcategory: 'premium',
      type: 'collection',
      productImage: '/rum.webp',
      stockQuantity: 10,
      description: 'A curated selection of premium rums',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  tequila: [
    {
      id: 'fallback-tequila-1',
      name: 'Premium Tequila Collection',
      slug: 'premium-tequila-collection',
      price: 2300,
      category: 'tequila',
      subcategory: 'premium',
      type: 'collection',
      productImage: '/tequila.webp',
      stockQuantity: 8,
      description: 'A curated selection of premium tequilas',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  cognac: [
    {
      id: 'fallback-cognac-1',
      name: 'Premium Cognac Collection',
      slug: 'premium-cognac-collection',
      price: 3500,
      category: 'cognac',
      subcategory: 'premium',
      type: 'collection',
      productImage: '/cognac.webp',
      stockQuantity: 6,
      description: 'A curated selection of premium cognacs',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  cider: [
    {
      id: 'fallback-cider-1',
      name: 'Premium Cider Collection',
      slug: 'premium-cider-collection',
      price: 1200,
      category: 'cider',
      subcategory: 'premium',
      type: 'collection',
      productImage: '/cider.webp',
      stockQuantity: 15,
      description: 'A curated selection of premium ciders',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  'cream-liquers': [
    {
      id: 'fallback-cream-1',
      name: 'Premium Cream Liqueurs Collection',
      slug: 'premium-cream-liqueurs-collection',
      price: 1900,
      category: 'cream-liquers',
      subcategory: 'premium',
      type: 'collection',
      productImage: '/cream-liquers.webp',
      stockQuantity: 12,
      description: 'A curated selection of premium cream liqueurs',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  mixers: [
    {
      id: 'fallback-mixers-1',
      name: 'Premium Mixers Collection',
      slug: 'premium-mixers-collection',
      price: 500,
      category: 'mixers',
      subcategory: 'premium',
      type: 'collection',
      productImage: '/mixers.webp',
      stockQuantity: 25,
      description: 'A curated selection of premium mixers',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ]
};

export function getFallbackProducts(category: string) {
  return fallbackProducts[category as keyof typeof fallbackProducts] || [];
}
