import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome to DGXPRT</h1>
          <p className="text-muted-foreground">
            Sign in to access your chemical management dashboard
          </p>
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
                }
              }
            }
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Auth;