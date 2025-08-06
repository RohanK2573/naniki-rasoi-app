/// <reference path="../types/google-maps.d.ts" />
import { Loader } from '@googlemaps/js-api-loader';

export interface GooglePlaceResult {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

class GoogleMapsService {
  private loader: Loader;
  private map: google.maps.Map | null = null;
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private placesService: google.maps.places.PlacesService | null = null;

  constructor() {
    this.loader = new Loader({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your API key
      version: 'weekly',
      libraries: ['places']
    });
  }

  async initialize(): Promise<void> {
    try {
      await this.loader.load();
      this.autocompleteService = new google.maps.places.AutocompleteService();
      
      // Create a dummy div for places service
      const dummyDiv = document.createElement('div');
      this.map = new google.maps.Map(dummyDiv);
      this.placesService = new google.maps.places.PlacesService(this.map);
    } catch (error) {
      console.error('Error loading Google Maps:', error);
    }
  }

  async searchPlaces(query: string): Promise<google.maps.places.AutocompletePrediction[]> {
    if (!this.autocompleteService) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!this.autocompleteService) {
        resolve([]);
        return;
      }

      this.autocompleteService.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: 'IN' }, // Restrict to India
          types: ['address']
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            resolve(predictions);
          } else {
            resolve([]);
          }
        }
      );
    });
  }

  async getPlaceDetails(placeId: string): Promise<GooglePlaceResult | null> {
    if (!this.placesService) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      if (!this.placesService) {
        resolve(null);
        return;
      }

      this.placesService.getDetails(
        {
          placeId: placeId,
          fields: ['place_id', 'formatted_address', 'geometry', 'address_components']
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            resolve(place as GooglePlaceResult);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  createMap(container: HTMLElement, center: { lat: number; lng: number }, zoom: number = 15): google.maps.Map {
    return new google.maps.Map(container, {
      center,
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
  }

  addMarker(map: google.maps.Map, position: { lat: number; lng: number }, title?: string): google.maps.Marker {
    return new google.maps.Marker({
      position,
      map,
      title,
    });
  }

  extractAddressComponents(addressComponents: any[]): {
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  } {
    const components = {
      addressLine1: '',
      city: '',
      state: '',
      pincode: ''
    };

    for (const component of addressComponents) {
      const types = component.types;
      
      if (types.includes('street_number') || types.includes('route')) {
        components.addressLine1 += component.long_name + ' ';
      } else if (types.includes('locality') || types.includes('sublocality')) {
        components.city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        components.state = component.long_name;
      } else if (types.includes('postal_code')) {
        components.pincode = component.long_name;
      }
    }

    components.addressLine1 = components.addressLine1.trim();
    return components;
  }
}

export const googleMapsService = new GoogleMapsService();