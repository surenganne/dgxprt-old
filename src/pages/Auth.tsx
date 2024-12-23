import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";
import { useTheme } from "@/components/ui/theme-provider";
import type { CSSProperties } from "react";

const Auth = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profile?.is_admin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    };

    checkUserAndRedirect();
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
                  brand: '#895AB7',
                  brandAccent: '#7a4ba3',
                }
              }
            },
            style: {
              button: {
                background: '#895AB7',
                color: 'white',
                border: '1px solid transparent',
                borderRadius: '8px',
                padding: '10px 20px',
                height: '42px',
                fontSize: '14px',
                fontWeight: '500',
                width: '100%',
                marginBottom: '10px',
                transition: 'all 150ms ease',
                transform: 'translateY(0)',
                '&:hover': {
                  background: '#7a4ba3',
                  transform: 'translateY(-1px)'
                } as CSSProperties,
                '&:active': {
                  transform: 'translateY(0)'
                } as CSSProperties
              } as CSSProperties,
              input: {
                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                border: '1px solid rgb(var(--border))',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                marginBottom: '10px',
                color: 'rgb(var(--foreground))',
                '&:focus': {
                  borderColor: '#895AB7',
                  outline: 'none',
                  boxShadow: '0 0 0 2px rgba(137, 90, 183, 0.2)'
                } as CSSProperties
              } as CSSProperties,
              label: {
                color: '#895AB7',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '6px',
                display: 'block',
                transition: 'color 150ms ease'
              } as CSSProperties,
              message: {
                color: 'rgb(var(--muted-foreground))',
                fontSize: '14px',
                marginBottom: '16px'
              } as CSSProperties,
              anchor: {
                color: '#895AB7',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                } as CSSProperties
              } as CSSProperties,
              container: {
                gap: '16px'
              } as CSSProperties
            }
          }}
          providers={[]}
          theme={theme === 'dark' ? 'dark' : 'default'}
        />
      </div>
    </div>
  );
};

export default Auth;