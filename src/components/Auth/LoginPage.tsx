import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { springBootAuth } from "@/services/springBootAuth";
import SocialAuthButtons from "./SocialAuthButtons";

interface LoginPageProps {
  onLogin: (token: string, user: any) => void;
  onSwitchToSignup: () => void;
  onBack: () => void;
}

const LoginPage = ({ onLogin, onSwitchToSignup, onBack }: LoginPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await springBootAuth.login({ email, password });
      springBootAuth.saveAuthData(data.token, data.user);
      onLogin(data.token, data.user);
      toast({
        title: "Login successful!",
        description: "Welcome to Nani ki Rasoi",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSuccess = (token: string, user: any) => {
    springBootAuth.saveAuthData(token, user);
    onLogin(token, user);
    toast({
      title: "Login successful!",
      description: "Welcome to Nani ki Rasoi",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <SocialAuthButtons onSuccess={handleSocialSuccess} disabled={isLoading} />
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToSignup}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
            <button
              onClick={onBack}
              className="text-sm text-muted-foreground hover:underline"
            >
              Back to home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;