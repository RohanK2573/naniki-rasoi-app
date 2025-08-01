import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";

interface CitySelectorProps {
  onCitySelect: (city: string) => void;
  onLogout?: () => void;
}

const CitySelector = ({ onCitySelect, onLogout }: CitySelectorProps) => {
  const [pincode, setPincode] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const popularCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", 
    "Chennai", "Pune", "Kolkata", "Ahmedabad"
  ];

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    onCitySelect(city);
  };

  const handlePincodeSubmit = () => {
    if (pincode.length === 6) {
      onCitySelect(`Pincode: ${pincode}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      {onLogout && (
        <Button 
          variant="outline"
          onClick={onLogout}
          className="absolute top-4 right-4 z-10"
        >
          Logout
        </Button>
      )}
      <Card className="w-full max-w-2xl shadow-warm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground mb-2">
            Where should we deliver?
          </CardTitle>
          <p className="text-muted-foreground">
            Select your city or enter pincode to find local cooks
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pincode Input */}
          <div className="space-y-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter your pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="pl-10"
                maxLength={6}
              />
              <Button
                onClick={handlePincodeSubmit}
                variant="warm"
                size="sm"
                className="absolute right-2 top-1.5"
                disabled={pincode.length !== 6}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Cities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {popularCities.map((city) => (
                <Button
                  key={city}
                  variant={selectedCity === city ? "warm" : "outline"}
                  onClick={() => handleCityClick(city)}
                  className="w-full"
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CitySelector;