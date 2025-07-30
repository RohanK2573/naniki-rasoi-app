import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
  onLogin: () => void;
  onSignup: () => void;
  user: any | null;
  onLogout: () => void;
}

const SplashScreen = ({ onComplete, onLogin, onSignup, user, onLogout }: SplashScreenProps) => {
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAuth(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-warm">
      <div className="text-center">
        <div className="mb-8 animate-pulse">
          <img
            src={logoImage}
            alt="Nani ki Rasoi"
            className="w-32 h-32 mx-auto rounded-full shadow-warm"
          />
        </div>
        <h1 className="text-4xl font-bold text-primary-foreground mb-2">
          Nani ki Rasoi
        </h1>
        <p className="text-primary-foreground/80 text-lg mb-8">
          Ghar jaisa khana, sirf aapke liye
        </p>
        
        {showAuth && (
          <div className="animate-fade-in">
            {user ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-lg text-primary-foreground/90">Welcome back, {user.firstName}!</p>
                <div className="flex gap-4">
                  <Button 
                    onClick={onComplete}
                    size="lg" 
                    className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Continue
                  </Button>
                  <Button 
                    onClick={onLogout}
                    variant="outline"
                    size="lg" 
                    className="text-lg px-8 py-6 rounded-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={onLogin}
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Button>
                <Button 
                  onClick={onSignup}
                  variant="outline"
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;