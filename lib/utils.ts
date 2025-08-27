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
