import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const location = useLocation();

  // Check URL parameters for email, temp flag, and magic link token
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromUrl = params.get('email');
    const isTemp = params.get('temp') === 'true';
    const token = params.get('token');
    const type = params.get('type');

    // If coming from magic link, invalidate any existing session
    const handleMagicLink = async () => {
      if (token && type === 'magiclink') {
        console.log('Magic link detected, signing out existing session');
        await supabase.auth.signOut();
        setInitialAuthCheckDone(true);
        return;
      }
    };

    handleMagicLink();

    if (emailFromUrl) {
      setEmail(emailFromUrl);
      if (isTemp) {
        toast.info("Please use the temporary password sent to your email to log in.");
      }
    }
  }, [location, supabase.auth]);

  // Check if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        if (session?.user) {
          await handleSuccessfulLogin(session.user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setInitialAuthCheckDone(true);
      }
    };

    // Check current session
    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_IN' && session) {
        await handleSuccessfulLogin(session.user.id);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSuccessfulLogin = async (userId: string) => {
    try {
      // Check if the user is an admin and their password reset status
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin, has_reset_password, status')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking user profile:', error);
        toast.error("Error checking user profile");
        return;
      }

      if (!profile) {
        console.error('No profile found for user');
        toast.error("User profile not found");
        return;
      }

      if (profile.status !== 'active') {
        toast.error("Your account is not active");
        await supabase.auth.signOut();
        return;
      }

      if (!profile.has_reset_password) {
        toast.info("Please reset your password for security reasons.");
        // Here you would typically redirect to a password reset page
      }

      // Determine redirect based on admin status
      if (profile.is_admin) {
        toast.success("Welcome back, admin!");
        navigate("/admin/dashboard");
      } else {
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Error checking user profile:', error);
      toast.error("Error checking user profile");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // handleSuccessfulLogin will be called by the auth state change listener
    } catch (error: any) {
      toast.error("Error logging in: " + error.message);
      setLoading(false);
    }
  };

  // Show loading state until initial auth check is done
  if (!initialAuthCheckDone) {
    return null;
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

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="mt-1"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="mt-1"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-purple to-primary-blue text-white"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;