// Geocoding utilities for location-based delivery
// You can enhance these functions with real geocoding services like Google Maps API

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  formattedAddress: string;
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Reverse geocoding - convert coordinates to address
export async function reverseGeocode(latitude: number, longitude: number): Promise<Address> {
  // TODO: Replace with actual geocoding service
  // Example with Google Maps API:
  // const response = await fetch(
  //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
  // );
  // const data = await response.json();
  // return parseGoogleMapsResponse(data);
  
  // For now, return a basic address format
  return {
    formattedAddress: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
  };
}

// Forward geocoding - convert address to coordinates
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  // TODO: Replace with actual geocoding service
  // Example with Google Maps API:
  // const response = await fetch(
  //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
  // );
  // const data = await response.json();
  // return parseGoogleMapsCoordinates(data);
  
  // For demonstration purposes, return coordinates within Nairobi area
  // In production, this should use a real geocoding service
  const baseLatitude = -1.2921; // Nairobi center
  const baseLongitude = 36.8219;
  
  // Add some random offset to simulate different locations
  const latOffset = (Math.random() - 0.5) * 0.1; // ~5km range
  const lngOffset = (Math.random() - 0.5) * 0.1;
  
  return {
    latitude: baseLatitude + latOffset,
    longitude: baseLongitude + lngOffset
  };
}

// Get user's current position using browser geolocation API
export function getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        ...options
      }
    );
  });
}

// Delivery fee calculation based on distance
export interface DeliveryTier {
  maxDistance: number;
  fee: number;
  label: string;
}

export const DEFAULT_DELIVERY_TIERS: DeliveryTier[] = [
  { maxDistance: 3, fee: 100, label: "0-3km" },
  { maxDistance: 5, fee: 200, label: "3-5km" }
];


export function calculateDeliveryFee(distance: number, tiers: DeliveryTier[] = DEFAULT_DELIVERY_TIERS): number {
  // For distances 0-3km: 100 KES
  if (distance <= 3) {
    return 100;
  }
  
  // For distances 3-5km: 200 KES
  if (distance <= 5) {
    return 200;
  }
  
  // For distances above 5km: 35 KES per km
  return 200 + Math.round((distance - 5) * 35);
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
}

// Format delivery fee calculation for display
export function formatDeliveryFeeCalculation(distance: number): string {
  const fee = calculateDeliveryFee(distance);
  
  if (distance <= 3) {
    return `0-3km: Ksh 100`;
  } else if (distance <= 5) {
    return `3-5km: Ksh 200`;
  } else {
    const additionalKm = distance - 5;
    const additionalFee = Math.round(additionalKm * 35);
    return `5km base (Ksh 200) + ${additionalKm.toFixed(1)}km × Ksh 35/km = Ksh ${fee.toLocaleString()}`;
  }
}

// Example usage with Google Maps API (commented out)
/*
// To use Google Maps API, install the types and add your API key:
// npm install @types/google.maps

export async function geocodeWithGoogle(address: string, apiKey: string): Promise<Coordinates | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export async function reverseGeocodeWithGoogle(lat: number, lng: number, apiKey: string): Promise<Address> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const components = result.address_components;
      
      return {
        street: getAddressComponent(components, 'route'),
        city: getAddressComponent(components, 'locality'),
        state: getAddressComponent(components, 'administrative_area_level_1'),
        country: getAddressComponent(components, 'country'),
        postalCode: getAddressComponent(components, 'postal_code'),
        formattedAddress: result.formatted_address
      };
    }
    
    return {
      formattedAddress: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      formattedAddress: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    };
  }
}

function getAddressComponent(components: any[], type: string): string | undefined {
  const component = components.find(comp => comp.types.includes(type));
  return component?.long_name;
}
*/ 