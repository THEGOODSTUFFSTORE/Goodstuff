"use client";
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { calculateDistance, calculateDeliveryFee, DEFAULT_DELIVERY_TIERS } from '@/lib/geocoding';

interface SimpleLocationPickerProps {
  onDeliveryFeeChange: (fee: number) => void;
  onLocationChange: (location: {
    latitude: number;
    longitude: number;
    address: string;
    distance: number;
  }) => void;
}

// Store location - The Good Stuff Liquor Store Limited, Naivas, Eastern Bypass, Nairobi
const STORE_LOCATION = {
  latitude: -1.2879348337458791, // PW6X+GXH Eastern Bypass, Nairobi
  longitude: 36.950018116573766, // PW6X+GXH Eastern Bypass, Nairobi
  name: "The Good Stuff Liquor Store Limited"
};

// Load Google Maps script
const loadGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
};

export default function SimpleLocationPicker({
  onDeliveryFeeChange,
  onLocationChange
}: SimpleLocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadGoogleMaps();
        
        if (!mapRef.current) return;

        // Initialize map centered on Nairobi
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: STORE_LOCATION.latitude, lng: STORE_LOCATION.longitude },
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        mapInstanceRef.current = map;

        // Add store marker
        new google.maps.Marker({
          position: { lat: STORE_LOCATION.latitude, lng: STORE_LOCATION.longitude },
          map: map,
          title: STORE_LOCATION.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          }
        });

        // Initialize delivery location marker (hidden initially)
        markerRef.current = new google.maps.Marker({
          map: map,
          draggable: true,
          title: 'Delivery Location',
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        });

        // Handle marker drag
        markerRef.current.addListener('dragend', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            handleLocationSelect(event.latLng.lat(), event.latLng.lng());
          }
        });

        // Handle map clicks
        map.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng && markerRef.current) {
            markerRef.current.setPosition(event.latLng);
            handleLocationSelect(event.latLng.lat(), event.latLng.lng());
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
        toast.error('Failed to load map. Please refresh and try again.');
        setIsLoading(false);
      }
    };

    initializeMap();
  }, []);

  // Handle location selection
  const handleLocationSelect = async (lat: number, lng: number) => {
    try {
      // Get address from coordinates using Google Maps Geocoder
      const geocoder = new google.maps.Geocoder();
      let address = '';
      let humanReadableAddress = '';

      // First attempt: Get detailed address
      try {
        const response = await geocoder.geocode({ 
          location: { lat, lng },
          language: 'en' // Ensure English language
        });
        
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          
          // Try to get the most readable address format
          if (result.formatted_address) {
            address = result.formatted_address;
            
            // Extract human-readable parts from the address
            const addressComponents = result.address_components;
            const readableParts = [];
            
            // Look for street number, route, sublocality, locality, administrative_area_level_1, country
            const streetNumber = addressComponents.find(comp => comp.types.includes('street_number'));
            const route = addressComponents.find(comp => comp.types.includes('route'));
            const sublocality = addressComponents.find(comp => comp.types.includes('sublocality'));
            const locality = addressComponents.find(comp => comp.types.includes('locality'));
            const area = addressComponents.find(comp => comp.types.includes('administrative_area_level_1'));
            const country = addressComponents.find(comp => comp.types.includes('country'));
            
            // Build human-readable address
            if (streetNumber && route) {
              readableParts.push(`${streetNumber.long_name} ${route.long_name}`);
            } else if (route) {
              readableParts.push(route.long_name);
            }
            
            if (sublocality) {
              readableParts.push(sublocality.long_name);
            }
            
            if (locality) {
              readableParts.push(locality.long_name);
            }
            
            if (area) {
              readableParts.push(area.long_name);
            }
            
            if (country) {
              readableParts.push(country.long_name);
            }
            
            humanReadableAddress = readableParts.join(', ');
          }
        }
      } catch (geocodeError) {
        console.warn('Primary geocoding failed:', geocodeError);
      }

      // Second attempt: If first attempt failed or returned plus codes, try reverse geocoding with different parameters
      if (!humanReadableAddress || humanReadableAddress.includes('+')) {
        try {
          const reverseResponse = await geocoder.geocode({
            location: { lat, lng },
            language: 'en'
          });
          
          if (reverseResponse.results && reverseResponse.results.length > 0) {
            const result = reverseResponse.results[0];
            
            // Build address from components
            const addressComponents = result.address_components;
            const readableParts = [];
            
            const streetNumber = addressComponents.find(comp => comp.types.includes('street_number'));
            const route = addressComponents.find(comp => comp.types.includes('route'));
            const sublocality = addressComponents.find(comp => comp.types.includes('sublocality'));
            const locality = addressComponents.find(comp => comp.types.includes('locality'));
            const area = addressComponents.find(comp => comp.types.includes('administrative_area_level_1'));
            const country = addressComponents.find(comp => comp.types.includes('country'));
            
            if (streetNumber && route) {
              readableParts.push(`${streetNumber.long_name} ${route.long_name}`);
            } else if (route) {
              readableParts.push(route.long_name);
            }
            
            if (sublocality) {
              readableParts.push(sublocality.long_name);
            }
            
            if (locality) {
              readableParts.push(locality.long_name);
            }
            
            if (area) {
              readableParts.push(area.long_name);
            }
            
            if (country) {
              readableParts.push(country.long_name);
            }
            
            if (readableParts.length > 0) {
              humanReadableAddress = readableParts.join(', ');
            }
          }
        } catch (reverseError) {
          console.warn('Reverse geocoding failed:', reverseError);
        }
      }

      // Fallback: If all geocoding attempts fail, create a descriptive location
      if (!humanReadableAddress) {
        // Try to get at least the area name
        try {
          const areaResponse = await geocoder.geocode({
            location: { lat, lng },
            language: 'en'
          });
          
          if (areaResponse.results && areaResponse.results.length > 0) {
            const result = areaResponse.results[0];
            const locality = result.address_components.find(comp => comp.types.includes('locality'));
            const area = result.address_components.find(comp => comp.types.includes('administrative_area_level_1'));
            
            if (locality && area) {
              humanReadableAddress = `${locality.long_name}, ${area.long_name}`;
            } else if (locality) {
              humanReadableAddress = locality.long_name;
            } else if (area) {
              humanReadableAddress = area.long_name;
            }
          }
        } catch (areaError) {
          console.warn('Area geocoding failed:', areaError);
        }
      }

      // Final fallback: Create a descriptive location with coordinates
      if (!humanReadableAddress) {
        const distance = calculateDistance(lat, lng, STORE_LOCATION.latitude, STORE_LOCATION.longitude);
        const direction = getDirection(lat, lng, STORE_LOCATION.latitude, STORE_LOCATION.longitude);
        humanReadableAddress = `${direction} of ${STORE_LOCATION.name} (${distance.toFixed(1)}km away)`;
      }

      // Use the human-readable address as the primary address
      const finalAddress = humanReadableAddress || address;
      setSelectedAddress(finalAddress);

      // Calculate distance and delivery fee
      const distance = calculateDistance(lat, lng, STORE_LOCATION.latitude, STORE_LOCATION.longitude);
      const deliveryFee = calculateDeliveryFee(distance, DEFAULT_DELIVERY_TIERS);

      // Update parent components
      onDeliveryFeeChange(deliveryFee);
      onLocationChange({
        latitude: lat,
        longitude: lng,
        address: finalAddress,
        distance
      });

      setDeliveryFee(deliveryFee);

      toast.success('Location selected successfully!');
    } catch (error) {
      console.error('Error getting address:', error);
      toast.error('Could not get address for this location');
    }
  };

  // Helper function to get direction from store
  const getDirection = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const deltaLat = lat1 - lat2;
    const deltaLng = lng1 - lng2;
    
    if (Math.abs(deltaLat) > Math.abs(deltaLng)) {
      return deltaLat > 0 ? 'North' : 'South';
    } else {
      return deltaLng > 0 ? 'East' : 'West';
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setIsUsingCurrentLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setIsUsingCurrentLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        if (markerRef.current && mapInstanceRef.current) {
          const location = { lat: latitude, lng: longitude };
          markerRef.current.setPosition(location);
          mapInstanceRef.current.setCenter(location);
          mapInstanceRef.current.setZoom(15);
          
          handleLocationSelect(latitude, longitude);
        }
        
        setIsUsingCurrentLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your location. ';
        
        if (error.code === 1) {
          errorMessage += 'Please allow location access and try again.';
        } else if (error.code === 2) {
          errorMessage += 'Location information is unavailable.';
        } else if (error.code === 3) {
          errorMessage += 'Location request timed out.';
        }
        
        toast.error(errorMessage);
        setIsUsingCurrentLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Initialize search box
  useEffect(() => {
    if (!isLoading && mapInstanceRef.current) {
      const searchInput = document.getElementById('location-search') as HTMLInputElement;
      if (searchInput) {
        const autocomplete = new google.maps.places.Autocomplete(searchInput, {
          componentRestrictions: { country: 'ke' }, // Restrict to Kenya
          fields: ['geometry', 'formatted_address']
        });

        autocomplete.bindTo('bounds', mapInstanceRef.current);
        autocompleteRef.current = autocomplete;

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const location = place.geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            if (markerRef.current && mapInstanceRef.current) {
              markerRef.current.setPosition({ lat, lng });
              mapInstanceRef.current.setCenter({ lat, lng });
              mapInstanceRef.current.setZoom(15);
              
              handleLocationSelect(lat, lng);
            }
          }
        });
      }
    }
  }, [isLoading]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="text-center text-red-600 p-4">
        Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div>
        <label htmlFor="location-search" className="block text-sm font-medium text-gray-700 mb-2">
          Search for your delivery location
        </label>
        <input
          id="location-search"
          type="text"
          placeholder="Enter address, landmark, or area..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
          disabled={isLoading}
        />
      </div>

      {/* Current Location Button */}
      <button
        onClick={getCurrentLocation}
        disabled={isLoading || isUsingCurrentLocation}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isUsingCurrentLocation ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Getting your location...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Use Current Location</span>
          </>
        )}
      </button>

      {/* Map */}
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-64 bg-gray-200 rounded-md"
          style={{ display: isLoading ? 'none' : 'block' }}
        />
        {isLoading && (
          <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-1">How to select your location:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Search for your address in the search box above</li>
          <li>Click on the map to place a pin at your location</li>
          <li>Drag the red pin to adjust your exact location</li>
          <li>Use "Current Location" to automatically detect your position</li>
        </ul>
      </div>

      {/* Selected Address Display */}
      {selectedAddress && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm font-medium text-green-800">Selected Location:</p>
          <p className="text-sm text-green-700">{selectedAddress}</p>
        </div>
      )}

      {/* Delivery Fee Display */}
      {deliveryFee > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm font-medium text-yellow-800">Delivery Fee:</p>
          <p className="text-sm text-yellow-700">Ksh {deliveryFee.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
} 