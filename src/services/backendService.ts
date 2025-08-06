import { LocationData } from '@/components/LocationSelector';
import { Cook, LocationBasedRecommendation } from './locationService';

export interface BackendLocationResponse {
  cooks: Cook[];
  recommendations: LocationBasedRecommendation[];
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: { lat: number; lng: number };
  isDefault?: boolean;
}

export interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: string;
    quantity: number;
    cookId: string;
    cookName: string;
  }>;
  deliveryAddress: Address;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered';
  createdAt: string;
}

class BackendService {
  private baseUrl = 'http://localhost:8080/api'; // Replace with your backend URL

  async getCooksByLocation(location: LocationData): Promise<Cook[]> {
    try {
      const response = await fetch(`${this.baseUrl}/cooks/by-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cooks');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching cooks:', error);
      // Fallback to mock data
      return this.getMockCooks(location);
    }
  }

  async getLocationRecommendations(location: LocationData): Promise<LocationBasedRecommendation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/recommendations/by-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback to mock data
      return this.getMockRecommendations();
    }
  }

  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/addresses`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }
  }

  async saveAddress(userId: string, address: Omit<Address, 'id'>): Promise<Address> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  }

  async placeOrder(order: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  // Mock data fallbacks
  private getMockCooks(location: LocationData): Cook[] {
    // Return mock data based on location
    return [
      {
        id: "1",
        name: "Sunita Auntie",
        rating: 4.8,
        speciality: "North Indian",
        area: "Bandra West",
        price: "₹120/meal",
        reviews: 156,
        time: "45 min",
        image: "/src/assets/cook-profile.jpg",
        tags: ["Homestyle", "Healthy", "Vegetarian"],
        serviceAreas: ["400050", "400051", "400052", "Mumbai", "Bandra"]
      },
      {
        id: "2", 
        name: "Kamala Ben",
        rating: 4.9,
        speciality: "Gujarati Thali",
        area: "Andheri East",
        price: "₹100/meal",
        reviews: 203,
        time: "30 min",
        image: "/src/assets/cook-profile.jpg",
        tags: ["Traditional", "Pure Veg", "Jain Friendly"],
        serviceAreas: ["400069", "400093", "Mumbai", "Andheri"]
      }
    ];
  }

  private getMockRecommendations(): LocationBasedRecommendation[] {
    return [
      {
        dishName: "Butter Chicken with Naan",
        cookName: "Sunita Auntie",
        cookId: "1",
        popularity: 95,
        image: "/src/assets/hero-tiffin.jpg",
        price: "₹180"
      },
      {
        dishName: "Gujarati Dal Dhokli",
        cookName: "Kamala Ben", 
        cookId: "2",
        popularity: 88,
        image: "/src/assets/hero-tiffin.jpg",
        price: "₹120"
      }
    ];
  }
}

export const backendService = new BackendService();