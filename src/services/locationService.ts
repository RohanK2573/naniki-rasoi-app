import { LocationData } from '@/components/LocationSelector';

export interface Cook {
  id: string;
  name: string;
  rating: number;
  speciality: string;
  area: string;
  price: string;
  reviews: number;
  time: string;
  image: string;
  tags: string[];
  serviceAreas: string[]; // Pincodes or areas they deliver to
  coordinates?: { lat: number; lng: number };
}

export interface LocationBasedRecommendation {
  dishName: string;
  cookName: string;
  cookId: string;
  popularity: number;
  image: string;
  price: string;
}

// Mock data - in real app, this would come from your backend
const mockCooks: Cook[] = [
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
  },
  {
    id: "3",
    name: "Meera Sharma",
    rating: 4.7,
    speciality: "South Indian",
    area: "Powai",
    price: "₹110/meal",
    reviews: 89,
    time: "40 min", 
    image: "/src/assets/cook-profile.jpg",
    tags: ["Authentic", "Sambar Rice", "Rasam"],
    serviceAreas: ["400076", "Mumbai", "Powai"]
  },
  {
    id: "4",
    name: "Priya Devi",
    rating: 4.6,
    speciality: "Bengali",
    area: "Salt Lake",
    price: "₹130/meal",
    reviews: 67,
    time: "50 min",
    image: "/src/assets/cook-profile.jpg",
    tags: ["Fish Curry", "Authentic", "Traditional"],
    serviceAreas: ["700064", "700091", "Kolkata", "Salt Lake"]
  },
  {
    id: "5",
    name: "Rajesh Uncle",
    rating: 4.5,
    speciality: "Punjabi",
    area: "Karol Bagh",
    price: "₹140/meal",
    reviews: 234,
    time: "35 min",
    image: "/src/assets/cook-profile.jpg",
    tags: ["Butter Chicken", "Dal Makhani", "Naan"],
    serviceAreas: ["110005", "110060", "Delhi", "Karol Bagh"]
  }
];

const mockRecommendations: LocationBasedRecommendation[] = [
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
  },
  {
    dishName: "Sambar Rice with Rasam",
    cookName: "Meera Sharma",
    cookId: "3",
    popularity: 82,
    image: "/src/assets/hero-tiffin.jpg",
    price: "₹110"
  }
];

export class LocationService {
  
  // Filter cooks based on location
  getCooksByLocation(location: LocationData): Cook[] {
    if (!location) return mockCooks;

    return mockCooks.filter(cook => {
      switch (location.type) {
        case 'pincode':
          return cook.serviceAreas.includes(location.value);
        
        case 'city':
          return cook.serviceAreas.some(area => 
            area.toLowerCase().includes(location.value.toLowerCase())
          );
        
        case 'coordinates':
          // For coordinates, you'd typically calculate distance
          // For now, return all cooks as mock implementation
          return true;
        
        default:
          return true;
      }
    });
  }

  // Get location-based recommendations
  getLocationRecommendations(location: LocationData): LocationBasedRecommendation[] {
    // In real app, this would be based on popular dishes in the area
    const availableCooks = this.getCooksByLocation(location);
    
    return mockRecommendations.filter(rec => 
      availableCooks.some(cook => cook.id === rec.cookId)
    );
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(
    lat1: number, lng1: number, 
    lat2: number, lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degToRad(lat2 - lat1);
    const dLng = this.degToRad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private degToRad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Mock reverse geocoding - in real app, use Google Maps API or similar
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }, 1000);
    });
  }
}

export const locationService = new LocationService();