"use client";
import React, { useState, useEffect } from 'react';

interface LocationArea {
  locations: string[];
  fee: number;
}

interface CityAreas {
  [key: string]: LocationArea;
}

interface City {
  name: string;
  areas: CityAreas;
}

interface DeliveryLocations {
  [key: string]: City;
}

// This is sample data - you should replace with your actual delivery fee data
const DELIVERY_LOCATIONS: DeliveryLocations = {
  Nairobi: {
    name: "Nairobi",
    areas: {
      "CBD": {
        locations: ["City Square", "Railways", "Moi Avenue"],
        fee: 200
      },
      "Westlands": {
        locations: ["Sarit Centre", "The Oval", "Westgate"],
        fee: 300
      },
      "Kilimani": {
        locations: ["Yaya Centre", "Adlife Plaza", "Kilimani Centre"],
        fee: 300
      }
    }
  },
  Nakuru: {
    name: "Nakuru",
    areas: {
      "CBD": {
        locations: ["Kenyatta Avenue", "Mburu Gichua Road", "Oginga Odinga Road"],
        fee: 400
      },
      "Section 58": {
        locations: ["Pipeline Area", "Stem Hotel", "KFA Grounds"],
        fee: 450
      },
      "Milimani": {
        locations: ["State House Road", "Crater Crescent", "Milimani Resort"],
        fee: 500
      }
    }
  }
};

interface DeliveryLocationFormProps {
  onDeliveryFeeChange: (fee: number) => void;
  onLocationChange: (location: {
    city: string;
    area: string;
    exactLocation: string;
    customLocation: string;
  }) => void;
}

export default function DeliveryLocationForm({
  onDeliveryFeeChange,
  onLocationChange
}: DeliveryLocationFormProps) {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [customLocation, setCustomLocation] = useState<string>('');

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    setSelectedArea('');
    setSelectedLocation('');
    setCustomLocation('');
    onDeliveryFeeChange(0);
  }, [selectedCity]);

  useEffect(() => {
    setSelectedLocation('');
    setCustomLocation('');
    if (selectedCity && selectedArea) {
      const fee = DELIVERY_LOCATIONS[selectedCity].areas[selectedArea]?.fee || 0;
      onDeliveryFeeChange(fee);
      onLocationChange({
        city: selectedCity,
        area: selectedArea,
        exactLocation: selectedLocation,
        customLocation
      });
    }
  }, [selectedArea]);

  useEffect(() => {
    if (selectedCity && selectedArea && selectedLocation) {
      onLocationChange({
        city: selectedCity,
        area: selectedArea,
        exactLocation: selectedLocation,
        customLocation
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedCity && selectedArea && customLocation) {
      onLocationChange({
        city: selectedCity,
        area: selectedArea,
        exactLocation: selectedLocation,
        customLocation
      });
    }
  }, [customLocation]);

  return (
    <div className="space-y-4">
      {/* City Selection */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <select
          id="city"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          required
        >
          <option value="">Select a city</option>
          {Object.keys(DELIVERY_LOCATIONS).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Area Selection */}
      {selectedCity && (
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
            Area
          </label>
          <select
            id="area"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            required
          >
            <option value="">Select an area</option>
            {Object.keys(DELIVERY_LOCATIONS[selectedCity].areas).map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Known Location Selection */}
      {selectedCity && selectedArea && (
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Known Landmarks
          </label>
          <select
            id="location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option value="">Select a landmark (optional)</option>
            {DELIVERY_LOCATIONS[selectedCity].areas[selectedArea].locations.map((loc: string) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Custom Location Input */}
      {selectedCity && selectedArea && (
        <div>
          <label htmlFor="customLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Exact Location Details
          </label>
          <textarea
            id="customLocation"
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            placeholder="Please provide detailed directions to your location (e.g., building name, street name, nearby landmarks)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            rows={3}
            required
          />
        </div>
      )}

      {selectedCity && selectedArea && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Delivery Fee: Ksh {DELIVERY_LOCATIONS[selectedCity].areas[selectedArea].fee}
          </p>
        </div>
      )}
    </div>
  );
} 