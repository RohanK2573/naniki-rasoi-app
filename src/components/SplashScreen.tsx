import { useEffect, useState } from "react";
import logoImage from "@/assets/logo.jpg";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-warm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
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
        <p className="text-primary-foreground/80 text-lg">
          Ghar jaisa khana, sirf aapke liye
        </p>
        <div className="mt-8">
          <div className="w-16 h-1 bg-primary-foreground/50 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;