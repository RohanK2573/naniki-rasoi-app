import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, Heart } from "lucide-react";
import heroImage from "@/assets/hero-tiffin.jpg";
import cookImage from "@/assets/cook-profile.jpg";
import { LocationData } from "@/components/LocationSelector";
import { locationService, Cook, LocationBasedRecommendation } from "@/services/locationService";

interface HomePageProps {
  selectedLocation: LocationData | null;
  onCookSelect: (cookId: string) => void;
  onLogout?: () => void;
  onLocationChange: () => void;
}

const HomePage = ({ selectedLocation, onCookSelect, onLogout, onLocationChange }: HomePageProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [availableCooks, setAvailableCooks] = useState<Cook[]>([]);
  const [recommendations, setRecommendations] = useState<LocationBasedRecommendation[]>([]);

  useEffect(() => {
    if (selectedLocation) {
      const cooks = locationService.getCooksByLocation(selectedLocation);
      const recs = locationService.getLocationRecommendations(selectedLocation);
      setAvailableCooks(cooks);
      setRecommendations(recs);
    }
  }, [selectedLocation]);

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
                Delivering to {selectedLocation?.displayName || 'Select location'}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="bg-primary-foreground text-primary"
                onClick={onLocationChange}
              >
                Change Location
              </Button>
              {onLogout && (
                <Button 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                  onClick={onLogout}
                >
                  Logout
                </Button>
              )}
            </div>
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
        {/* Location-based Recommendations */}
        {recommendations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular in Your Area</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((rec) => (
                <Card key={rec.dishName} className="hover:shadow-warm transition-shadow cursor-pointer">
                  <img
                    src={rec.image}
                    alt={rec.dishName}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{rec.dishName}</h3>
                    <p className="text-sm text-muted-foreground mb-2">by {rec.cookName}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-warm">{rec.price}</span>
                      <Badge variant="secondary">{rec.popularity}% loved</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

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

        {/* Available Cooks */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Available Cooks {selectedLocation && `(${availableCooks.length} found)`}
          </h2>
          {availableCooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No cooks available in your area yet.</p>
              <Button variant="warm" onClick={onLocationChange}>
                Try Different Location
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCooks.map((cook) => (
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
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;