import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, Loader2, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationSelectorProps {
  onLocationSelect: (location: LocationData) => void;
  onLogout?: () => void;
  currentLocation?: LocationData | null;
}

export interface LocationData {
  type: 'pincode' | 'city' | 'coordinates';
  value: string;
  displayName: string;
  coordinates?: { lat: number; lng: number };
  pincode?: string;
}

const LocationSelector = ({ onLocationSelect, onLogout, currentLocation }: LocationSelectorProps) => {
  const [pincode, setPincode] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(currentLocation || null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { toast } = useToast();

  const popularCities = [
    { name: "Mumbai", pincode: "400001" },
    { name: "Delhi", pincode: "110001" }, 
    { name: "Bangalore", pincode: "560001" },
    { name: "Hyderabad", pincode: "500001" },
    { name: "Chennai", pincode: "600001" },
    { name: "Pune", pincode: "411001" },
    { name: "Kolkata", pincode: "700001" },
    { name: "Ahmedabad", pincode: "380001" }
  ];

  const handleCityClick = (city: { name: string; pincode: string }) => {
    const locationData: LocationData = {
      type: 'city',
      value: city.name,
      displayName: city.name,
      pincode: city.pincode
    };
    setSelectedLocation(locationData);
    onLocationSelect(locationData);
  };

  const handlePincodeSubmit = () => {
    if (pincode.length === 6) {
      const locationData: LocationData = {
        type: 'pincode',
        value: pincode,
        displayName: `Pincode: ${pincode}`,
        pincode: pincode
      };
      setSelectedLocation(locationData);
      onLocationSelect(locationData);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get address (you can replace this with a real service)
          const locationData: LocationData = {
            type: 'coordinates',
            value: `${latitude},${longitude}`,
            displayName: `Current Location`,
            coordinates: { lat: latitude, lng: longitude }
          };
          
          setSelectedLocation(locationData);
          onLocationSelect(locationData);
          
          toast({
            title: "Location detected",
            description: "Successfully got your current location"
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to process location",
            variant: "destructive"
          });
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        let message = "Failed to get location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
        }
        
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
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
            {currentLocation ? 'Change your location' : 'Where should we deliver?'}
          </CardTitle>
          <p className="text-muted-foreground">
            {currentLocation 
              ? `Currently delivering to: ${currentLocation.displayName}`
              : 'Set your location to find local cooks'
            }
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Location Button */}
          <div className="space-y-3">
            <Button
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              className="w-full"
              variant="warm"
            >
              {isLoadingLocation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting location...
                </>
              ) : (
                <>
                  <Navigation className="mr-2 h-4 w-4" />
                  Use Current Location
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

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
                type="number"
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
                  key={city.name}
                  variant={selectedLocation?.value === city.name ? "warm" : "outline"}
                  onClick={() => handleCityClick(city)}
                  className="w-full"
                >
                  {city.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationSelector;