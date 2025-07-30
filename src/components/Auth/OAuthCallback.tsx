import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { springBootAuth } from "@/services/springBootAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface OAuthCallbackProps {
  onSuccess: (token: string, user: any) => void;
}

const OAuthCallback = ({ onSuccess }: OAuthCallbackProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const provider = searchParams.get('provider');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(decodeURIComponent(error));
        }

        if (!provider) {
          throw new Error('Provider not specified');
        }

        const data = await springBootAuth.handleOAuthCallback(provider);
        springBootAuth.saveAuthData(data.token, data.user);
        
        toast({
          title: "Login successful!",
          description: `Welcome to Nani ki Rasoi via ${provider}`,
        });

        onSuccess(data.token, data.user);
        navigate('/');
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'OAuth authentication failed';
        setError(errorMessage);
        toast({
          title: "Authentication failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, onSuccess, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Authenticating...</CardTitle>
            <CardDescription>Please wait while we complete your login</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">Authentication Failed</CardTitle>
            <CardDescription>There was an error with your login</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:underline font-medium"
            >
              Return to home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;