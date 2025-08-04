import { useState, useEffect } from 'react';
import { LocationData } from '@/components/LocationSelector';

const LOCATION_STORAGE_KEY = 'naniki-rasoi-location';

export const useLocationStorage = () => {
  const [storedLocation, setStoredLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    const savedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (savedLocation) {
      try {
        setStoredLocation(JSON.parse(savedLocation));
      } catch (error) {
        console.error('Error parsing stored location:', error);
        localStorage.removeItem(LOCATION_STORAGE_KEY);
      }
    }
  }, []);

  const saveLocation = (location: LocationData) => {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
    setStoredLocation(location);
  };

  const clearLocation = () => {
    localStorage.removeItem(LOCATION_STORAGE_KEY);
    setStoredLocation(null);
  };

  return {
    storedLocation,
    saveLocation,
    clearLocation
  };
};