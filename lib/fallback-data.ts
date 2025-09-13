// Fallback data for when Firebase is not available
export const fallbackProducts = {
  whisky: [
    {
      id: 'fallback-whisky-1',
      name: 'Premium Whisky Collection',
      price: 2500,
      category: 'whisky',
      subcategory: 'premium',
      description: 'A curated selection of premium whiskies from around the world',
      image: '/whisky.webp',
      status: 'active',
      stock: 10,
      createdAt: new Date().toISOString()
    }
  ],
  wine: [
    {
      id: 'fallback-wine-1',
      name: 'Premium Wine Collection',
      price: 1800,
      category: 'wine',
      subcategory: 'premium',
      description: 'A curated selection of premium wines from renowned vineyards',
      image: '/wine.webp',
      status: 'active',
      stock: 15,
      createdAt: new Date().toISOString()
    }
  ],
  gin: [
    {
      id: 'fallback-gin-1',
      name: 'Premium Gin Collection',
      price: 2200,
      category: 'gin',
      subcategory: 'premium',
      description: 'A curated selection of premium gins with unique botanical profiles',
      image: '/gin.webp',
      status: 'active',
      stock: 12,
      createdAt: new Date().toISOString()
    }
  ],
  vodka: [
    {
      id: 'fallback-vodka-1',
      name: 'Premium Vodka Collection',
      price: 2000,
      category: 'vodka',
      subcategory: 'premium',
      description: 'A curated selection of premium vodkas',
      image: '/vodka.webp',
      status: 'active',
      stock: 8,
      createdAt: new Date().toISOString()
    }
  ],
  beer: [
    {
      id: 'fallback-beer-1',
      name: 'Premium Beer Collection',
      price: 800,
      category: 'beer',
      subcategory: 'premium',
      description: 'A curated selection of premium beers',
      image: '/beer.webp',
      status: 'active',
      stock: 20,
      createdAt: new Date().toISOString()
    }
  ],
  rum: [
    {
      id: 'fallback-rum-1',
      name: 'Premium Rum Collection',
      price: 2100,
      category: 'rum',
      subcategory: 'premium',
      description: 'A curated selection of premium rums',
      image: '/rum.webp',
      status: 'active',
      stock: 10,
      createdAt: new Date().toISOString()
    }
  ],
  tequila: [
    {
      id: 'fallback-tequila-1',
      name: 'Premium Tequila Collection',
      price: 2300,
      category: 'tequila',
      subcategory: 'premium',
      description: 'A curated selection of premium tequilas',
      image: '/tequila.webp',
      status: 'active',
      stock: 8,
      createdAt: new Date().toISOString()
    }
  ],
  cognac: [
    {
      id: 'fallback-cognac-1',
      name: 'Premium Cognac Collection',
      price: 3500,
      category: 'cognac',
      subcategory: 'premium',
      description: 'A curated selection of premium cognacs',
      image: '/cognac.webp',
      status: 'active',
      stock: 6,
      createdAt: new Date().toISOString()
    }
  ],
  cider: [
    {
      id: 'fallback-cider-1',
      name: 'Premium Cider Collection',
      price: 1200,
      category: 'cider',
      subcategory: 'premium',
      description: 'A curated selection of premium ciders',
      image: '/cider.webp',
      status: 'active',
      stock: 15,
      createdAt: new Date().toISOString()
    }
  ],
  'cream-liquers': [
    {
      id: 'fallback-cream-1',
      name: 'Premium Cream Liqueurs Collection',
      price: 1900,
      category: 'cream-liquers',
      subcategory: 'premium',
      description: 'A curated selection of premium cream liqueurs',
      image: '/cream-liquers.webp',
      status: 'active',
      stock: 12,
      createdAt: new Date().toISOString()
    }
  ],
  mixers: [
    {
      id: 'fallback-mixers-1',
      name: 'Premium Mixers Collection',
      price: 500,
      category: 'mixers',
      subcategory: 'premium',
      description: 'A curated selection of premium mixers',
      image: '/mixers.webp',
      status: 'active',
      stock: 25,
      createdAt: new Date().toISOString()
    }
  ]
};

export function getFallbackProducts(category: string) {
  return fallbackProducts[category as keyof typeof fallbackProducts] || [];
}
