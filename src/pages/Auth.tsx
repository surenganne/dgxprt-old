import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";

const Auth = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <BackgroundEffects />
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 flex items-center gap-2 text-primary-purple hover:text-primary-purple/90 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>
      
      <div className="w-full max-w-md p-8 space-y-8 bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-purple/10">
        <div className="text-center space-y-6">
          <img 
            src="/dg-only-logo.png" 
            alt="DGXPRT Logo" 
            className="h-16 w-auto mx-auto mb-4 drop-shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-purple to-primary-blue bg-clip-text text-transparent">
              Welcome to DGXPRT
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to access your chemical management dashboard
            </p>
          </div>
        </div>
        
        <SupabaseAuth 
          supabaseClient={supabase} 
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary-purple))',
                  brandAccent: 'rgb(var(--primary-blue))',
                  brandButtonText: 'white',
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '0.5rem',
                  buttonBorderRadius: '0.5rem',
                  inputBorderRadius: '0.5rem',
                },
              }
            },
            style: {
              button: {
                border: '1px solid transparent',
                fontWeight: '500',
                transition: 'all 150ms ease',
              },
              anchor: {
                color: 'rgb(var(--primary-purple))',
                transition: 'opacity 150ms ease',
              },
              input: {
                backgroundColor: 'transparent',
                border: '1px solid rgb(var(--border))',
              },
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Auth;