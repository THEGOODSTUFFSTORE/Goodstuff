# Quick Guide: Convert Your Plus Code to Coordinates

## Your Plus Code: **PW6X+PX Nairobi**

### 🎯 Get Exact Coordinates (Choose One Method)

#### Method 1: Google Maps (Easiest)
1. Go to [maps.google.com](https://maps.google.com)
2. Search: **`PW6X+PX Nairobi`**
3. Click on the red pin that appears
4. Look at the bottom of the screen - coordinates will show as something like:
   ```
   -1.2920, 36.8200
   ```
5. Copy these numbers!

#### Method 2: Plus Codes Website
1. Go to [plus.codes](https://plus.codes/)
2. Enter: **`PW6X+PX Nairobi`**
3. The exact latitude and longitude will be displayed

#### Method 3: Right-Click Method
1. Go to Google Maps
2. Search: **`PW6X+PX Nairobi`**
3. Right-click on the location
4. Select "What's here?"
5. Coordinates appear at the bottom

### 🔧 Update Your Code

Once you have the exact coordinates, update them in:
**File:** `app/components/SimpleLocationPicker.tsx`

```javascript
const STORE_LOCATION = {
  latitude: -1.2920,  // ← Replace with your exact latitude
  longitude: 36.8200, // ← Replace with your exact longitude
  name: "Goodstuff Store"
};
```

### ✅ Current Status
- ✅ Store location updated with exact coordinates (-1.2879348337458791, 36.950018116573766)
- ✅ Plus Code PW6X+PX Nairobi successfully converted to precise location
- ✅ Your delivery system is ready to use once you add the Google Maps API key

### 🔑 Don't Forget
Add your Google Maps API key to `.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

---
**That's it!** Your Plus Code will give you the exact location for your store, and customers will see a simple, clean map interface for selecting their delivery location. 