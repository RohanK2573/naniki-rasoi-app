import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import CitySelector from "@/components/CitySelector";
import HomePage from "@/components/HomePage";
import CookProfile from "@/components/CookProfile";

type AppState = "splash" | "city-selection" | "home" | "cook-profile";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("splash");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCookId, setSelectedCookId] = useState("");

  const handleSplashComplete = () => {
    setAppState("city-selection");
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setAppState("home");
  };

  const handleCookSelect = (cookId: string) => {
    setSelectedCookId(cookId);
    setAppState("cook-profile");
  };

  const handleBackToHome = () => {
    setAppState("home");
  };

  const handleSelectPlan = () => {
    // This will be implemented in future iterations
    console.log("Navigate to plan selection");
  };

  return (
    <>
      {appState === "splash" && <SplashScreen onComplete={handleSplashComplete} />}
      {appState === "city-selection" && <CitySelector onCitySelect={handleCitySelect} />}
      {appState === "home" && (
        <HomePage 
          selectedCity={selectedCity} 
          onCookSelect={handleCookSelect}
        />
      )}
      {appState === "cook-profile" && (
        <CookProfile 
          cookId={selectedCookId}
          onBack={handleBackToHome}
          onSelectPlan={handleSelectPlan}
        />
      )}
    </>
  );
};

export default Index;
