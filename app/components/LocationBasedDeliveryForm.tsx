"use client";
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  calculateDistance, 
  getCurrentPosition, 
  geocodeAddress, 
  reverseGeocode,
  calculateDeliveryFee,
  DEFAULT_DELIVERY_TIERS,
  formatDistance
} from '@/lib/geocoding';

interface LocationBasedDeliveryFormProps {
  onDeliveryFeeChange: (fee: number) => void;
  onLocationChange: (location: {
    latitude: number;
    longitude: number;
    address: string;
    distance: number;
  }) => void;
}

// Store location (you should replace with your actual store coordinates)
const STORE_LOCATION = {
  latitude: -1.2921, // Nairobi coordinates - replace with your store's actual location
  longitude: 36.8219,
  name: "Goodstuff Store"
};

// Use delivery tiers from utility functions
const DELIVERY_TIERS = DEFAULT_DELIVERY_TIERS;

export default function LocationBasedDeliveryForm({
  onDeliveryFeeChange,
  onLocationChange
}: LocationBasedDeliveryFormProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [locationError, setLocationError] = useState<string>('');
  const [manualAddress, setManualAddress] = useState<string>('');
  const [useManualEntry, setUseManualEntry] = useState(false);

  // Helper function to get delivery fee (uses utility function)
  const getDeliveryFee = (distanceKm: number): number => {
    return calculateDeliveryFee(distanceKm, DELIVERY_TIERS);
  };

  // Get user's current location
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError('');

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Get address from coordinates using reverse geocoding
      const addressData = await reverseGeocode(latitude, longitude);
      
      const userLoc = { latitude, longitude, address: addressData.formattedAddress };
      setUserLocation(userLoc);

      // Calculate distance from store
      const calculatedDistance = calculateDistance(
        latitude,
        longitude,
        STORE_LOCATION.latitude,
        STORE_LOCATION.longitude
      );
      
      setDistance(calculatedDistance);
      
      // Calculate delivery fee
      const fee = getDeliveryFee(calculatedDistance);
      setDeliveryFee(fee);
      onDeliveryFeeChange(fee);
      
      // Notify parent component
      onLocationChange({
        latitude,
        longitude,
        address: addressData.formattedAddress,
        distance: calculatedDistance
      });

      toast.success('Location detected successfully!');
    } catch (error: any) {
      console.error('Error getting location:', error);
      let errorMessage = 'Unable to get your location. ';
      
      if (error.code === 1) {
        errorMessage += 'Please allow location access and try again.';
      } else if (error.code === 2) {
        errorMessage += 'Location information is unavailable.';
      } else if (error.code === 3) {
        errorMessage += 'Location request timed out.';
      } else {
        errorMessage += 'Please enter your address manually.';
      }
      
      setLocationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Handle manual address entry with geocoding
  const handleManualAddressSubmit = async () => {
    if (!manualAddress.trim()) {
      toast.error('Please enter a valid address');
      return;
    }

    setIsLoadingLocation(true);
    try {
      // Use geocoding utility to convert address to coordinates
      const coordinates = await geocodeAddress(manualAddress);
      
      if (!coordinates) {
        toast.error('Could not find location for this address');
        return;
      }
      
      const userLoc = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        address: manualAddress
      };
      
      setUserLocation(userLoc);
      
      const calculatedDistance = calculateDistance(
        coordinates.latitude,
        coordinates.longitude,
        STORE_LOCATION.latitude,
        STORE_LOCATION.longitude
      );
      
      setDistance(calculatedDistance);
      
      const fee = getDeliveryFee(calculatedDistance);
      setDeliveryFee(fee);
      onDeliveryFeeChange(fee);
      
      onLocationChange({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        address: manualAddress,
        distance: calculatedDistance
      });

      toast.success('Address added successfully!');
    } catch (error) {
      toast.error('Error processing address. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Location-Based Delivery</h3>
        <p className="text-sm text-blue-600">
          We'll calculate your delivery fee based on the distance from our store in {STORE_LOCATION.name}.
        </p>
      </div>

      {!useManualEntry ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoadingLocation ? 'Getting Location...' : 'Use My Current Location'}
          </button>

          <button
            type="button"
            onClick={() => setUseManualEntry(true)}
            className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            Enter Address Manually
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="manualAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Your Address
            </label>
            <textarea
              id="manualAddress"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="Enter your full address (street, area, city)"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              rows={3}
              required
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleManualAddressSubmit}
              disabled={isLoadingLocation || !manualAddress.trim()}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoadingLocation ? 'Processing...' : 'Calculate Delivery Fee'}
            </button>
            
            <button
              type="button"
              onClick={() => setUseManualEntry(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Use GPS Instead
            </button>
          </div>
        </div>
      )}

      {locationError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{locationError}</p>
        </div>
      )}

      {userLocation && distance !== null && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">Delivery Information</h4>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Address:</strong> {userLocation.address}</p>
            <p><strong>Distance from store:</strong> {formatDistance(distance)}</p>
            <p><strong>Delivery fee:</strong> Ksh {deliveryFee.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Show delivery tiers for reference */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Delivery Fee Structure</h4>
        <div className="text-sm text-gray-600 space-y-1">
          {DELIVERY_TIERS.map((tier, index) => (
            <div key={index} className="flex justify-between">
              <span>{tier.label}</span>
              <span>Ksh {tier.fee.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 