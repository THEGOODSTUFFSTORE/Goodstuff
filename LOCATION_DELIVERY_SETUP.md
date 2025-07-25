# Location-Based Delivery System

This document explains how the location-based delivery fee calculation works and how to enhance it with real geocoding services.

## Current Implementation

The system currently includes:

### 1. Core Components
- **LocationBasedDeliveryForm**: Main component that handles user location and calculates delivery fees
- **lib/geocoding.ts**: Utility functions for distance calculation, geocoding, and delivery fee calculation
- **Updated checkout page**: Uses the new location-based system

### 2. Features
- **GPS Location Detection**: Uses browser geolocation API to get user's current position
- **Manual Address Entry**: Allows users to enter addresses manually
- **Distance Calculation**: Uses Haversine formula to calculate distance between coordinates
- **Tiered Delivery Fees**: Configurable fee structure based on distance ranges
- **Error Handling**: Comprehensive error handling for location services

### 3. Current Fee Structure
```
Within 5km: Ksh 200
5-10km: Ksh 400
10-20km: Ksh 600
20-50km: Ksh 1000
Beyond 50km: Ksh 1500
```

## Configuration

### Store Location
Update the store location in `app/components/LocationBasedDeliveryForm.tsx`:

```typescript
const STORE_LOCATION = {
  latitude: -1.2921, // Replace with your actual store latitude
  longitude: 36.8219, // Replace with your actual store longitude
  name: "Your Store Name"
};
```

### Delivery Fee Tiers
Modify the delivery tiers in `lib/geocoding.ts`:

```typescript
export const DEFAULT_DELIVERY_TIERS: DeliveryTier[] = [
  { maxDistance: 5, fee: 200, label: "Within 5km" },
  { maxDistance: 10, fee: 400, label: "5-10km" },
  // Add or modify tiers as needed
];
```

## Enhancing with Real Geocoding Services

### Option 1: Google Maps API

1. **Get API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Geocoding API and Maps JavaScript API
   - Create an API key with appropriate restrictions

2. **Install Dependencies**:
   ```bash
   npm install @types/google.maps
   ```

3. **Add Environment Variable**:
   ```bash
   # .env.local
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. **Update Geocoding Functions**:
   Uncomment and modify the Google Maps functions in `lib/geocoding.ts`:

   ```typescript
   export async function geocodeWithGoogle(address: string): Promise<Coordinates | null> {
     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
     if (!apiKey) {
       console.error('Google Maps API key not found');
       return null;
     }
     
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
   ```

5. **Update Component Functions**:
   Replace the placeholder geocoding functions in `LocationBasedDeliveryForm.tsx`:

   ```typescript
   import { geocodeWithGoogle, reverseGeocodeWithGoogle } from '@/lib/geocoding';
   
   // In getCurrentLocation function:
   const addressData = await reverseGeocodeWithGoogle(latitude, longitude);
   
   // In handleManualAddressSubmit function:
   const coordinates = await geocodeWithGoogle(manualAddress);
   ```

### Option 2: Mapbox API

1. **Get API Key**:
   - Sign up at [Mapbox](https://www.mapbox.com/)
   - Get your access token

2. **Add Environment Variable**:
   ```bash
   # .env.local
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_access_token_here
   ```

3. **Implement Mapbox Geocoding**:
   ```typescript
   export async function geocodeWithMapbox(address: string): Promise<Coordinates | null> {
     const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
     if (!accessToken) {
       console.error('Mapbox access token not found');
       return null;
     }
     
     try {
       const response = await fetch(
         `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${accessToken}`
       );
       const data = await response.json();
       
       if (data.features && data.features.length > 0) {
         const [longitude, latitude] = data.features[0].center;
         return { latitude, longitude };
       }
       return null;
     } catch (error) {
       console.error('Mapbox geocoding error:', error);
       return null;
     }
   }
   ```

### Option 3: OpenCage API

1. **Get API Key**:
   - Sign up at [OpenCage](https://opencagedata.com/)
   - Get your API key

2. **Implement OpenCage Geocoding**:
   ```typescript
   export async function geocodeWithOpenCage(address: string): Promise<Coordinates | null> {
     const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
     if (!apiKey) {
       console.error('OpenCage API key not found');
       return null;
     }
     
     try {
       const response = await fetch(
         `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`
       );
       const data = await response.json();
       
       if (data.results && data.results.length > 0) {
         const result = data.results[0];
         return {
           latitude: result.geometry.lat,
           longitude: result.geometry.lng
         };
       }
       return null;
     } catch (error) {
       console.error('OpenCage geocoding error:', error);
       return null;
     }
   }
   ```

## Advanced Features

### 1. Route-Based Distance Calculation
For more accurate delivery fees, consider using routing APIs:

```typescript
// Example with Google Maps Directions API
export async function getRouteDistance(origin: Coordinates, destination: Coordinates): Promise<number> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`
    );
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const distance = data.routes[0].legs[0].distance.value; // in meters
      return distance / 1000; // convert to kilometers
    }
    return 0;
  } catch (error) {
    console.error('Route calculation error:', error);
    return 0;
  }
}
```

### 2. Dynamic Delivery Fees
Implement time-based or demand-based pricing:

```typescript
export function calculateDynamicDeliveryFee(distance: number, timeOfDay: number, demand: number): number {
  const baseFee = calculateDeliveryFee(distance);
  
  // Peak hours multiplier (6-9 AM, 5-8 PM)
  const peakHourMultiplier = (timeOfDay >= 6 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 20) ? 1.5 : 1;
  
  // High demand multiplier
  const demandMultiplier = demand > 80 ? 1.3 : 1;
  
  return Math.round(baseFee * peakHourMultiplier * demandMultiplier);
}
```

### 3. Delivery Zone Restrictions
Add zone-based restrictions:

```typescript
export function isDeliveryAllowed(coordinates: Coordinates, allowedZones: Coordinates[][]): boolean {
  // Implement point-in-polygon algorithm to check if coordinates are within allowed zones
  return true; // Simplified implementation
}
```

## Testing

### Manual Testing
1. Test GPS location detection on different devices
2. Test manual address entry with various address formats
3. Test error handling (location denied, timeout, etc.)

### Automated Testing
```typescript
// Example test for distance calculation
import { calculateDistance } from '@/lib/geocoding';

describe('Distance Calculation', () => {
  it('should calculate distance between two points correctly', () => {
    const distance = calculateDistance(-1.2921, 36.8219, -1.3000, 36.8300);
    expect(distance).toBeCloseTo(1.0, 1); // Within 0.1km accuracy
  });
});
```

## Troubleshooting

### Common Issues

1. **Location Access Denied**:
   - Ensure HTTPS is used in production
   - Provide clear instructions to users about enabling location access

2. **Geocoding API Errors**:
   - Check API key validity
   - Verify API usage limits
   - Implement fallback geocoding services

3. **Inaccurate Distance Calculation**:
   - Consider using route-based distance instead of straight-line distance
   - Account for road networks and traffic

### Performance Optimization

1. **Caching**:
   - Cache geocoding results to reduce API calls
   - Implement local storage for frequently used addresses

2. **Rate Limiting**:
   - Implement debouncing for address input
   - Add rate limiting for API calls

## Security Considerations

1. **API Key Security**:
   - Use environment variables for API keys
   - Implement proper API key restrictions
   - Consider using server-side geocoding for sensitive operations

2. **Input Validation**:
   - Validate address inputs to prevent injection attacks
   - Sanitize user inputs before geocoding

## Cost Optimization

1. **API Usage**:
   - Monitor API usage and set up billing alerts
   - Implement caching to reduce redundant calls
   - Consider using free tier limits effectively

2. **Alternative Services**:
   - Use free services like OpenStreetMap Nominatim for basic geocoding
   - Implement multiple providers with fallbacks

This location-based delivery system provides a solid foundation that can be enhanced based on your specific business needs and budget constraints. 