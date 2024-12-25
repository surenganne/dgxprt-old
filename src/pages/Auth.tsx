import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useMagicLink } from "@/hooks/useMagicLink";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);
  const navigate = useNavigate();

  // Handle magic link and URL parameters
  useMagicLink(setEmail, setInitialAuthCheckDone);

  // Handle authentication redirects
  useAuthRedirect(setInitialAuthCheckDone);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          return;
        }

        if (session?.user) {
          console.log("Existing session found, checking profile");
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin, has_reset_password')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            return;
          }

          if (profile) {
            if (!profile.has_reset_password) {
              navigate('/reset-password', { replace: true });
            } else {
              navigate(profile.is_admin ? '/admin' : '/dashboard', { replace: true });
            }
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkExistingSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting to sign in with:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      // Immediately check profile and redirect after successful login
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, has_reset_password')
        .eq('email', email)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }

      // Immediate redirect based on profile
      if (profile) {
        if (!profile.has_reset_password) {
          navigate('/reset-password', { replace: true });
        } else {
          navigate(profile.is_admin ? '/admin' : '/dashboard', { replace: true });
        }
      }
    } catch (error: any) {
      console.error("Login process error:", error);
      toast.error("Error logging in: " + error.message);
      setLoading(false);
    }
  };

  // Show loading state until initial auth check is done
  if (!initialAuthCheckDone || isProcessingMagicLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Verifying your access...</h2>
          <p className="text-muted-foreground">Please wait while we process your login.</p>
        </div>
      </div>
    );
  }

  // Check if we're processing a magic link by looking at URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const isMagicLink = searchParams.get("token") && searchParams.get("type") === "magiclink";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <BackgroundEffects />
      
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg relative z-10">
        <div className="text-center">
          <img
            src="/dg-text-logo.png"
            alt="DGXPRT Logo"
            className="mx-auto h-12 w-auto mb-8"
          />
          <h2 className="text-2xl font-semibold">Sign in to your account</h2>
        </div>

        <AuthForm
          email={email}
          password={password}
          loading={loading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
          isEmailReadOnly={isMagicLink}
        />
      </div>
    </div>
  );
};

export default Auth;