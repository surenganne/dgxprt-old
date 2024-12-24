import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useMagicLink } from "@/hooks/useMagicLink";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  // Handle magic link and URL parameters
  useMagicLink(setEmail, setInitialAuthCheckDone);

  // Handle authentication redirects
  useAuthRedirect(setInitialAuthCheckDone);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user needs to reset password
      const { data: profile } = await supabase
        .from('profiles')
        .select('has_reset_password')
        .eq('email', email)
        .single();

      if (profile && !profile.has_reset_password) {
        navigate('/reset-password');
      }
      // Success handling is managed by the auth state change listener
    } catch (error: any) {
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