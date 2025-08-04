import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Clock, MapPin, Heart, Phone, MessageCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { springBootAuth } from "@/services/springBootAuth";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/Cart/CartDrawer";
import cookImage from "@/assets/cook-profile.jpg";

interface CookProfileProps {
  cookId: string;
  onBack: () => void;
  onSelectPlan: () => void;
  onLogout?: () => void;
}


const CookProfile = ({ cookId, onBack, onSelectPlan, onLogout }: CookProfileProps) => {
  const [selectedMealType, setSelectedMealType] = useState("lunch");
  const [cookData, setCookData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Fetch cook data from backend
  useEffect(() => {
    const fetchCookData = async () => {
      try {
        setLoading(true);
        // Uncomment when backend is ready
        // const data = await springBootAuth.fetchCookDetails(cookId);
        // setCookData(data);
        
        // Mock data for now - will be replaced with backend data
        setCookData({
          name: "Sunita Auntie",
          rating: 4.8,
          totalReviews: 156,
          speciality: "North Indian Home Style",
          area: "Bandra West, Mumbai",
          experience: "15+ years",
          image: cookImage,
          description: "I have been cooking traditional North Indian meals for my family for over 15 years. Now I want to share the love and taste of home-cooked food with more people. All my meals are prepared fresh daily with pure ingredients and lots of love.",
          tags: ["Homestyle", "Healthy", "No Preservatives", "Fresh Daily"]
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load cook details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCookData();
  }, [cookId, toast]);

  const menuItems = {
    lunch: [
      { name: "Dal Rice Combo", price: "₹120", description: "Yellow dal, jeera rice, pickle, papad" },
      { name: "Rajma Chawal", price: "₹140", description: "Rajma curry, steamed rice, salad" },
      { name: "Chole Bhature", price: "₹160", description: "Spicy chole, fresh bhature, onions" },
      { name: "Aloo Gobi Sabzi", price: "₹130", description: "Aloo gobi, 2 rotis, dal, rice" }
    ],
    dinner: [
      { name: "Paneer Butter Masala", price: "₹180", description: "Rich paneer curry, naan, rice" },
      { name: "Mixed Veg Curry", price: "₹150", description: "Seasonal vegetables, rotis, dal" },
      { name: "Palak Paneer", price: "₹170", description: "Fresh palak paneer, rotis, rice" }
    ]
  };

  const reviews = [
    {
      name: "Priya S.",
      rating: 5,
      comment: "Amazing taste! Just like my mom's cooking. The dal rice is perfect.",
      date: "2 days ago"
    },
    {
      name: "Rajesh M.",
      rating: 5,
      comment: "Very fresh and healthy food. Delivery is always on time.",
      date: "1 week ago"
    },
    {
      name: "Kavya P.",
      rating: 4,
      comment: "Good quantity and taste. Loved the rajma chawal!",
      date: "2 weeks ago"
    }
  ];

  const subscriptionPlans = [
    {
      type: "Daily",
      meals: "Lunch Only",
      price: "₹3,000",
      duration: "per month",
      savings: "",
      popular: false
    },
    {
      type: "Daily",
      meals: "Lunch + Dinner", 
      price: "₹5,400",
      duration: "per month",
      savings: "Save ₹600",
      popular: true
    },
    {
      type: "Weekly",
      meals: "Lunch Only",
      price: "₹840",
      duration: "per week",
      savings: "",
      popular: false
    }
  ];

  const handleAddToCart = (item: any) => {
    addToCart({
      id: `${item.name}-${selectedMealType}-${cookId}`,
      name: `${item.name} (${selectedMealType})`,
      price: item.price,
      cookId,
      cookName: cookData?.name || "Unknown Cook"
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading cook details...</p>
        </div>
      </div>
    );
  }

  if (!cookData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Cook not found</p>
          <Button onClick={onBack} className="mt-4">Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-warm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex gap-2">
              <CartDrawer className="bg-white/10 text-white border-white/30 hover:bg-white/20" />
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
          
          <div className="flex flex-col md:flex-row gap-6 text-primary-foreground">
            <img
              src={cookData.image}
              alt={cookData.name}
              className="w-32 h-32 rounded-full border-4 border-primary-foreground/20"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{cookData.name}</h1>
              <p className="text-lg opacity-90 mb-2">{cookData.speciality}</p>
              <div className="flex items-center gap-4 text-sm opacity-90 mb-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-300 text-yellow-300 mr-1" />
                  {cookData.rating} ({cookData.totalReviews} reviews)
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {cookData.area}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {cookData.experience}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {cookData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-primary-foreground text-primary">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" className="bg-primary-foreground text-primary">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                <Button variant="outline" className="bg-primary-foreground text-primary">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {cookData.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{cookData.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Menu</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant={selectedMealType === "lunch" ? "warm" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMealType("lunch")}
                  >
                    Lunch
                  </Button>
                  <Button 
                    variant={selectedMealType === "dinner" ? "warm" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMealType("dinner")}
                  >
                    Dinner
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {menuItems[selectedMealType as keyof typeof menuItems].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{item.price}</p>
                        <Button 
                          variant="food" 
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {reviews.map((review, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {subscriptionPlans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-warm' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-4 bg-primary">Most Popular</Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-center">
                      {plan.type} {plan.meals}
                    </CardTitle>
                    <div className="text-center">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.duration}</span>
                    </div>
                    {plan.savings && (
                      <Badge variant="secondary" className="self-center">{plan.savings}</Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant={plan.popular ? "warm" : "outline"} 
                      className="w-full"
                      onClick={onSelectPlan}
                    >
                      Select Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CookProfile;