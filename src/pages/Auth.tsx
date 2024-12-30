import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const supabase = useSupabaseClient();

  // Check auth state on mount and when it changes
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // If user is authenticated, redirect to appropriate dashboard
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profile?.is_admin) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/user/dashboard', { replace: true });
        }
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profile?.is_admin) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/user/dashboard', { replace: true });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("[Auth] Attempting login for:", email);
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (user) {
        console.log("[Auth] User signed in successfully:", user.email);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin, has_reset_password')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("[Auth] Error fetching profile:", profileError);
          throw profileError;
        }

        console.log("[Auth] User profile:", profile);

        if (!profile) {
          throw new Error('Profile not found');
        }

        if (!profile.has_reset_password) {
          console.log("[Auth] User needs to reset password");
          navigate('/reset-password', { replace: true });
        } else {
          console.log("[Auth] User has reset password, redirecting to dashboard");
          navigate(profile.is_admin ? '/admin/dashboard' : '/dashboard', { replace: true });
        }

        toast.success('Logged in successfully');
      }
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
      toast.error(error.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("[Auth] Sending magic link to:", email);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify`,
        },
      });

      if (error) throw error;

      toast.success('Magic link sent to your email');
    } catch (error: any) {
      console.error('[Auth] Magic link error:', error);
      toast.error(error.message || 'Error sending magic link');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    // Check if we came from a protected route
    const isFromProtectedRoute = location.pathname.startsWith('/user/') || 
                                location.pathname.startsWith('/admin/');
    
    // If from protected route, go to root
    if (isFromProtectedRoute) {
      navigate('/', { replace: true });
    } else {
      // Otherwise, go back
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-gray-100"
          onClick={handleBackToHome}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <BackgroundEffects />
      
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-lg relative z-10">
        <div className="text-center">
          <img
            src="/dg-text-logo.png"
            alt="DGXPRT Logo"
            className="h-12 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleMagicLink}
              disabled={loading || !email}
            >
              Send Magic Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
