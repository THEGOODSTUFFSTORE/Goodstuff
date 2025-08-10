# Google Maps Setup for Delivery Location Picker

## Overview
The delivery system now uses a simplified Google Maps integration for location selection. Users can:
- Search for addresses using Google Places Autocomplete
- Click on the map to select a location
- Drag markers to adjust their exact location
- Use their current location automatically
- See both store location (blue pin) and delivery location (red pin) on the map

## Required API Key

You need a Google Maps API key with the following APIs enabled:
- **Maps JavaScript API** - For displaying the map
- **Places API** - For address search and autocomplete
- **Geocoding API** - For converting coordinates to addresses

## Setup Steps

### 1. Get Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Add API Key to Environment

Add your API key to your environment variables:

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBA414fQslLT0USRtFquDFexP6IyfjwIwM
```

**Important**: The API key must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

### 3. Configure Store Location

#### Using Plus Codes
If you have a Plus Code for your store location (like "PW6X+PX Nairobi"):

1. **Get Exact Coordinates from Plus Code:**
   - **Option A:** Go to [Google Maps](https://maps.google.com), search for your Plus Code
   - **Option B:** Visit [plus.codes](https://plus.codes/) and enter your Plus Code
   - **Option C:** In Google Maps, right-click on your location and select "What's here?"

2. **Convert Plus Code to Coordinates:**
   ```
   Example: PW6X+PX Nairobi
   1. Open Google Maps
   2. Search: "PW6X+PX Nairobi"
   3. Click on the location
   4. Copy the coordinates shown (usually as -1.2920, 36.8200)
   ```

3. **Update Store Location in Code:**
   
Update the coordinates in `app/components/SimpleLocationPicker.tsx`:

```typescript
const STORE_LOCATION = {
  latitude: -1.2879348337458791, // Exact coordinates from Plus Code PW6X+PX Nairobi
  longitude: 36.950018116573766, // Exact coordinates from Plus Code PW6X+PX Nairobi
  name: "Goodstuff Store" // Your store name
};
```

#### Manual Coordinate Entry
If you don't have a Plus Code:

```typescript
const STORE_LOCATION = {
  latitude: -1.2921, // Replace with your store's latitude
  longitude: 36.8219, // Replace with your store's longitude
  name: "Goodstuff Store" // Your store name
};
```

## Features

### For Users
- **Simple Interface**: Clean, intuitive location selection
- **Multiple Selection Methods**: Search, click, drag, or use current location
- **Visual Feedback**: Clear pins showing store and delivery locations
- **Address Display**: Shows selected address in readable format
- **No Complex Information**: Delivery fees calculated behind the scenes

### For Developers
- **Automatic Delivery Calculation**: Distance and fees calculated automatically
- **Error Handling**: Graceful fallbacks for location access issues
- **TypeScript Support**: Full type safety with Google Maps APIs
- **Responsive Design**: Works on both desktop and mobile devices

## Delivery Fee Calculation

The system automatically calculates delivery fees based on distance from your store using the existing delivery tier system:
- Within 5km: Ksh 200
- 5-10km: Ksh 400
- 10-20km: Ksh 600
- 20-50km: Ksh 1000
- Beyond 50km: Ksh 1500

Users only see the final delivery fee in their order summary - no complex distance calculations or tier explanations are shown.

## Troubleshooting

### Map Not Loading
- Check that your API key is correctly set in environment variables
- Ensure the Maps JavaScript API is enabled
- Verify your API key restrictions allow your domain

### Search Not Working
- Ensure Places API is enabled
- Check browser console for any API errors
- Verify API key has sufficient quota

### Location Access Denied
- The component gracefully handles denied location access
- Users can still manually search or click on the map
- Clear error messages guide users to alternative methods

## Development Notes

- The component requires `@types/google.maps` for TypeScript support
- API key must be public-facing (`NEXT_PUBLIC_`) as it's used in browser
- Consider implementing API key restrictions for production use
- The component is designed to replace `LocationBasedDeliveryForm` with a simpler interface 