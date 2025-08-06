/// <reference path="../../types/google-maps.d.ts" />
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Plus, Home, Briefcase, Navigation } from 'lucide-react';
import { Address, backendService } from '@/services/backendService';
import { googleMapsService } from '@/services/googleMapsService';
import { useToast } from '@/hooks/use-toast';

interface AddressSelectorProps {
  onAddressSelect: (address: Address) => void;
  onCancel: () => void;
  userId: string;
}

const AddressSelector = ({ onAddressSelect, onCancel, userId }: AddressSelectorProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // New address form state
  const [newAddress, setNewAddress] = useState<{
    type: 'home' | 'work' | 'other';
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: { lat: number; lng: number };
  }>({
    type: 'home',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    coordinates: { lat: 0, lng: 0 }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<google.maps.places.AutocompletePrediction[]>([]);

  useEffect(() => {
    loadAddresses();
    googleMapsService.initialize();
  }, [userId]);

  const loadAddresses = async () => {
    try {
      const userAddresses = await backendService.getUserAddresses(userId);
      setAddresses(userAddresses);
      
      if (userAddresses.length === 0) {
        setShowAddForm(true);
      } else {
        const defaultAddress = userAddresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load addresses",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = async (value: string) => {
    setSearchQuery(value);
    
    if (value.length > 2) {
      try {
        const results = await googleMapsService.searchPlaces(value);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching places:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handlePlaceSelect = async (prediction: google.maps.places.AutocompletePrediction) => {
    try {
      const placeDetails = await googleMapsService.getPlaceDetails(prediction.place_id);
      
      if (placeDetails) {
        const addressComponents = googleMapsService.extractAddressComponents(placeDetails.address_components);
        
        setNewAddress({
          ...newAddress,
          addressLine1: addressComponents.addressLine1,
          city: addressComponents.city,
          state: addressComponents.state,
          pincode: addressComponents.pincode,
          coordinates: {
            lat: placeDetails.geometry.location.lat,
            lng: placeDetails.geometry.location.lng
          }
        });
        
        setSearchQuery(placeDetails.formatted_address);
        setSearchResults([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get place details",
        variant: "destructive"
      });
    }
  };

  const handleSaveAddress = async () => {
    try {
      const savedAddress = await backendService.saveAddress(userId, {
        ...newAddress,
        isDefault: addresses.length === 0
      });
      
      setAddresses([...addresses, savedAddress]);
      setSelectedAddressId(savedAddress.id);
      setShowAddForm(false);
      
      toast({
        title: "Success",
        description: "Address saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive"
      });
    }
  };

  const handleConfirm = () => {
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (selectedAddress) {
      onAddressSelect(selectedAddress);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Delivery Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showAddForm && addresses.length > 0 && (
          <>
            <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={address.id} className="flex items-center gap-2 font-medium">
                      {address.type === 'home' && <Home className="h-4 w-4" />}
                      {address.type === 'work' && <Briefcase className="h-4 w-4" />}
                      {address.type === 'other' && <MapPin className="h-4 w-4" />}
                      {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                      {address.isDefault && <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Default</span>}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                      {address.landmark && `, Near ${address.landmark}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <Button
              variant="outline"
              onClick={() => setShowAddForm(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>

            <div className="flex gap-3">
              <Button onClick={handleConfirm} disabled={!selectedAddressId} className="flex-1">
                Confirm Address
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </>
        )}

        {showAddForm && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Search Address</Label>
              <div className="relative">
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Start typing your address..."
                  className="pr-10"
                />
                <Navigation className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div
                        key={result.place_id}
                        className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                        onClick={() => handlePlaceSelect(result)}
                      >
                        <div className="font-medium">{result.structured_formatting.main_text}</div>
                        <div className="text-sm text-muted-foreground">
                          {result.structured_formatting.secondary_text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="type">Address Type</Label>
              <Select value={newAddress.type} onValueChange={(value) => setNewAddress({...newAddress, type: value as 'home' | 'work' | 'other'})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})}
                  placeholder="House/Flat no, Building name"
                />
              </div>
              <div>
                <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                <Input
                  id="addressLine2"
                  value={newAddress.addressLine2}
                  onChange={(e) => setNewAddress({...newAddress, addressLine2: e.target.value})}
                  placeholder="Area, Street name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="landmark">Landmark (Optional)</Label>
              <Input
                id="landmark"
                value={newAddress.landmark}
                onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                placeholder="Near famous place"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  placeholder="City"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                  placeholder="State"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                  placeholder="Pincode"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSaveAddress}
                disabled={!newAddress.addressLine1 || !newAddress.city || !newAddress.pincode}
                className="flex-1"
              >
                Save Address
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddForm(false);
                  if (addresses.length === 0) {
                    onCancel();
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressSelector;