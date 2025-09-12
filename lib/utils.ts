import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeProductName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// --- Search helpers ---
/**
 * Normalize text for search: lowercase, remove diacritics, collapse whitespace
 */
export function normalizeForSearch(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .toString()
    .normalize('NFD')
    // Remove combining diacritical marks (widely supported)
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Tokenize normalized text into words
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text.split(' ').filter(Boolean);
}

type SearchableProduct = {
  name?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  description?: string;
};

function buildProductSearchIndex(product: SearchableProduct) {
  const name = normalizeForSearch(product.name);
  const brand = normalizeForSearch(product.brand);
  const category = normalizeForSearch(product.category);
  const subcategory = normalizeForSearch(product.subcategory);
  const description = normalizeForSearch(product.description);

  return {
    name,
    brand,
    category,
    subcategory,
    description,
    nameTokens: tokenize(name),
    brandTokens: tokenize(brand),
    categoryTokens: tokenize(category),
    subcategoryTokens: tokenize(subcategory)
  };
}

/**
 * Score how well a product matches a query. Higher is better. Return -Infinity for no match.
 * Rules:
 * - For 1-char queries: only word-prefix matches count (avoid noisy substring matches)
 * - For 2-3 chars: prefer word-prefix; allow substring with lower score
 * - For 4+ chars: allow substring across fields
 */
export function scoreProductForQuery(product: SearchableProduct, rawQuery: string): number {
  const query = normalizeForSearch(rawQuery);
  if (!query) return -Infinity;

  const index = buildProductSearchIndex(product);
  const tokens = tokenize(query);
  if (tokens.length === 0) return -Infinity;

  const isShort = query.length === 1;
  const isMedium = query.length >= 2 && query.length <= 3;

  let score = 0;
  let matched = false;

  const addScore = (amount: number) => {
    score += amount;
    matched = true;
  };

  const fields = [
    { key: 'name', value: index.name, tokens: index.nameTokens, weightPrefix: 100, weightSub: 40 },
    { key: 'brand', value: index.brand, tokens: index.brandTokens, weightPrefix: 70, weightSub: 30 },
    { key: 'category', value: index.category, tokens: index.categoryTokens, weightPrefix: 60, weightSub: 25 },
    { key: 'subcategory', value: index.subcategory, tokens: index.subcategoryTokens, weightPrefix: 55, weightSub: 20 },
    { key: 'description', value: index.description, tokens: [], weightPrefix: 10, weightSub: 10 }
  ];

  // Evaluate token-by-token to ensure all tokens influence scoring
  for (const token of tokens) {
    let tokenMatched = false;

    for (const field of fields) {
      // Word-prefix match
      const hasPrefixMatch = field.tokens.some(t => t.startsWith(token));
      if (hasPrefixMatch) {
        const exactWord = field.tokens.includes(token);
        addScore(field.weightPrefix + (exactWord ? 10 : 0));
        tokenMatched = true;
        continue;
      }

      // Substring match
      if (!isShort && field.value && field.value.includes(token)) {
        addScore(field.weightSub);
        tokenMatched = true;
      }
    }

    // If any token fails to match on short queries, consider it a non-match
    if (!tokenMatched && (isShort || isMedium)) {
      return -Infinity;
    }
  }

  return matched ? score : -Infinity;
}

/**
 * Filter and rank products by query.
 */
export function searchProducts<T extends SearchableProduct>(products: T[], rawQuery: string): T[] {
  const scored = products
    .map(p => ({ p, s: scoreProductForQuery(p, rawQuery) }))
    .filter(item => item.s !== -Infinity)
    .sort((a, b) => b.s - a.s);
  return scored.map(item => item.p);
}

/**
 * Format shipping address to display human-readable information
 * Filters out plus codes, coordinates, and technical details
 */
export function formatShippingAddress(shippingAddress: any): string {
  if (!shippingAddress) return 'Address not specified';
  
  const parts = [];
  
  // Helper function to clean plus codes and extract readable parts
  const cleanPlusCode = (location: string): string[] => {
    if (!location) return [];
    
    const cleanParts = [];
    
    // If it's a Plus Code like "QWJ5+XQX, Nairobi, Kenya"
    if (location.includes('+') && location.includes(',')) {
      const locationParts = location.split(',').map((part: string) => part.trim());
      
      for (const part of locationParts) {
        // Skip Plus Codes but keep readable parts
        if (part && !part.includes('+') && !part.match(/^[A-Z0-9]{4}\+[A-Z0-9]{3}$/)) {
          cleanParts.push(part);
        }
      }
    } else if (!location.includes('+')) {
      // If no plus code, just clean and add
      cleanParts.push(location.trim());
    }
    
    return cleanParts;
  };

  // Helper function to extract readable address components
  const extractReadableComponents = (address: string): string[] => {
    if (!address) return [];
    
    const components = [];
    
    // Split by common separators and clean each part
    const parts = address.split(/[,;]/).map(part => part.trim());
    
    for (const part of parts) {
      // Skip coordinates, plus codes, and empty parts
      if (part && 
          !part.match(/^-?\d+\.?\d*$/) && // Skip pure numbers/coordinates
          !part.includes('+') && // Skip plus codes
          !part.match(/^[A-Z0-9]{4}\+[A-Z0-9]{3}$/) && // Skip plus code pattern
          part.length > 2) { // Skip very short parts
        components.push(part);
      }
    }
    
    return components;
  };

  // Priority 1: Use exactLocation if it's human-readable
  if (shippingAddress.exactLocation) {
    const cleanExactLocation = cleanPlusCode(shippingAddress.exactLocation);
    if (cleanExactLocation.length > 0) {
      parts.push(...cleanExactLocation);
    }
  }
  
  // Priority 2: Use deliveryAddress if it's human-readable
  if (shippingAddress.deliveryAddress) {
    const cleanDeliveryAddress = cleanPlusCode(shippingAddress.deliveryAddress);
    if (cleanDeliveryAddress.length > 0) {
      parts.push(...cleanDeliveryAddress);
    }
  }
  
  // Priority 3: Use customLocation if available
  if (shippingAddress.customLocation) {
    const cleanCustomLocation = extractReadableComponents(shippingAddress.customLocation);
    if (cleanCustomLocation.length > 0) {
      parts.push(...cleanCustomLocation);
    }
  }
  
  // Priority 4: Use city and area if available
  if (shippingAddress.city) {
    parts.push(shippingAddress.city);
  }
  
  if (shippingAddress.area) {
    parts.push(shippingAddress.area);
  }
  
  // Priority 5: If we have coordinates but no readable address, create a descriptive location
  if (parts.length === 0 && shippingAddress.latitude && shippingAddress.longitude) {
    const distance = shippingAddress.distance || 0;
    if (distance > 0) {
      parts.push(`Approximately ${distance.toFixed(1)}km from store`);
    } else {
      parts.push('Location coordinates available');
    }
  }
  
  // Remove duplicates while preserving order
  const uniqueParts = [];
  const seen = new Set();
  
  for (const part of parts) {
    const normalizedPart = part.toLowerCase().trim();
    if (normalizedPart && !seen.has(normalizedPart)) {
      seen.add(normalizedPart);
      uniqueParts.push(part);
    }
  }
  
  return uniqueParts.length > 0 ? uniqueParts.join(', ') : 'Address not specified';
}
