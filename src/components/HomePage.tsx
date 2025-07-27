import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Heart } from "lucide-react";
import heroImage from "@/assets/hero-tiffin.jpg";
import cookImage from "@/assets/cook-profile.jpg";

interface HomePageProps {
  selectedCity: string;
  onCookSelect: (cookId: string) => void;
}

const HomePage = ({ selectedCity, onCookSelect }: HomePageProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const featuredCooks = [
    {
      id: "1",
      name: "Sunita Auntie",
      rating: 4.8,
      speciality: "North Indian",
      area: "Bandra West",
      price: "₹120/meal",
      reviews: 156,
      time: "45 min",
      image: cookImage,
      tags: ["Homestyle", "Healthy", "Vegetarian"]
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
      image: cookImage,
      tags: ["Traditional", "Pure Veg", "Jain Friendly"]
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
      image: cookImage,
      tags: ["Authentic", "Sambar Rice", "Rasam"]
    }
  ];

  const foodCategories = [
    { name: "North Indian", icon: "🍛", count: 45 },
    { name: "South Indian", icon: "🥘", count: 32 },
    { name: "Gujarati", icon: "🍚", count: 28 },
    { name: "Bengali", icon: "🐟", count: 15 },
    { name: "Punjabi", icon: "🫓", count: 25 },
    { name: "Maharashtrian", icon: "🌾", count: 18 }
  ];

  const toggleFavorite = (cookId: string) => {
    setFavorites(prev => 
      prev.includes(cookId) 
        ? prev.filter(id => id !== cookId)
        : [...prev, cookId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-warm p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between text-primary-foreground">
            <div>
              <h1 className="text-2xl font-bold">Nani ki Rasoi</h1>
              <div className="flex items-center text-sm opacity-90">
                <MapPin className="h-4 w-4 mr-1" />
                Delivering in {selectedCity}
              </div>
            </div>
            <Button variant="outline" className="bg-primary-foreground text-primary">
              Change Location
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={heroImage}
          alt="Delicious home-cooked meals"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-white max-w-md">
              <h2 className="text-3xl font-bold mb-2">
                Ghar jaisa khana, delivered fresh
              </h2>
              <p className="text-lg opacity-90">
                Connect with local home cooks in your area
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Food Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse by Cuisine</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {foodCategories.map((category) => (
              <Card key={category.name} className="hover:shadow-card transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} cooks</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Cooks */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Cooks Near You</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCooks.map((cook) => (
              <Card key={cook.id} className="hover:shadow-warm transition-all duration-300 cursor-pointer">
                <div className="relative">
                  <img
                    src={cook.image}
                    alt={cook.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(cook.id);
                    }}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(cook.id) 
                          ? "fill-red-500 text-red-500" 
                          : "text-gray-600"
                      }`}
                    />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{cook.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{cook.speciality}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold">{cook.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {cook.area}
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    {cook.time}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {cook.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-lg">{cook.price}</span>
                      <p className="text-xs text-muted-foreground">{cook.reviews} reviews</p>
                    </div>
                    <Button 
                      variant="warm" 
                      size="sm"
                      onClick={() => onCookSelect(cook.id)}
                    >
                      View Menu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;