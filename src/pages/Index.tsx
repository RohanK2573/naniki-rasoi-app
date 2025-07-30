import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import CitySelector from "@/components/CitySelector";
import HomePage from "@/components/HomePage";
import CookProfile from "@/components/CookProfile";
import LoginPage from "@/components/Auth/LoginPage";
import SignupPage from "@/components/Auth/SignupPage";

type AppState = "splash" | "city-selection" | "home" | "cook-profile" | "login" | "signup";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("splash");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCookId, setSelectedCookId] = useState("");
  const [user, setUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth token on app load
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setAuthToken(token);
      setUser(JSON.parse(savedUser));
    }
  }, []);

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

  const handleLogin = (token: string, userData: any) => {
    setAuthToken(token);
    setUser(userData);
    setAppState("city-selection");
  };

  const handleSignup = (token: string, userData: any) => {
    setAuthToken(token);
    setUser(userData);
    setAppState("city-selection");
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
    setAppState("splash");
  };

  const handleAuthBack = () => {
    setAppState("splash");
  };

  return (
    <>
      {appState === "splash" && (
        <SplashScreen 
          onComplete={handleSplashComplete}
          onLogin={() => setAppState("login")}
          onSignup={() => setAppState("signup")}
          user={user}
          onLogout={handleLogout}
        />
      )}
      {appState === "login" && (
        <LoginPage 
          onLogin={handleLogin}
          onSwitchToSignup={() => setAppState("signup")}
          onBack={handleAuthBack}
        />
      )}
      {appState === "signup" && (
        <SignupPage 
          onSignup={handleSignup}
          onSwitchToLogin={() => setAppState("login")}
          onBack={handleAuthBack}
        />
      )}
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
