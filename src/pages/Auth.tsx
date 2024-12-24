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

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[Auth] Auth state changed:", event, session ? "Session exists" : "No session");
      
      if (event === 'SIGNED_IN' && session) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        const redirectPath = profile?.is_admin ? '/admin/dashboard' : '/dashboard';
        console.log("[Auth] Redirecting to:", redirectPath);
        navigate(redirectPath);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
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
          isEmailReadOnly={!!email} // Make email readonly if it's pre-populated
        />
      </div>
    </div>
  );
};

export default Auth;