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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-warm min-h-screen">
      <div className="text-center px-6 max-w-md mx-auto">
        <div className="mb-8 animate-pulse">
          <img
            src={logoImage}
            alt="Nani ki Rasoi"
            className="w-32 h-32 mx-auto rounded-full shadow-warm"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          Nani ki Rasoi
        </h1>
        <p className="text-white/90 text-lg mb-8 drop-shadow">
          Ghar jaisa khana, sirf aapke liye
        </p>
        
        {showAuth && (
          <div className="animate-fade-in space-y-6">
            {user ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-lg text-white/95 font-medium drop-shadow">
                  Welcome back, {user.firstName || user.name || 'User'}!
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <Button 
                    onClick={onComplete}
                    size="lg" 
                    variant="default"
                    className="w-full text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white text-primary hover:bg-white/90 font-semibold"
                  >
                    Continue to App
                  </Button>
                  <Button 
                    onClick={onLogout}
                    variant="outline"
                    size="lg" 
                    className="w-full text-lg px-8 py-6 rounded-xl border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 backdrop-blur-sm font-semibold bg-white/10"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <Button 
                  onClick={onLogin}
                  size="lg" 
                  variant="default"
                  className="w-full text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white text-primary hover:bg-white/90 font-semibold"
                >
                  Login to Your Account
                </Button>
                <Button 
                  onClick={onSignup}
                  variant="outline"
                  size="lg" 
                  className="w-full text-lg px-8 py-6 rounded-xl border-2 border-white text-white hover:bg-white/20 hover:border-white backdrop-blur-sm font-semibold bg-white/10 hover:bg-white/30"
                >
                  Create New Account
                </Button>
                <p className="text-white/70 text-sm mt-2">
                  Join thousands of food lovers already using our app
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;