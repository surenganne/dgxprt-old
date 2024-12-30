import { useState } from "react";
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
          .maybeSingle();

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

  const handleBackToHome = () => {
    const isFromProtectedRoute = location.pathname.startsWith('/user/') || 
                                location.pathname.startsWith('/admin/');
    
    if (isFromProtectedRoute) {
      navigate('/', { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-primary-purple hover:text-primary-purple/90 hover:bg-primary-purple/10"
          onClick={handleBackToHome}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <BackgroundEffects />
      
      <div className="w-full max-w-[440px] space-y-8 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg relative z-10">
        <div className="text-center space-y-2">
          <img
            src="/dg-text-logo.png"
            alt="DGXPRT Logo"
            className="h-12 mx-auto mb-8"
          />
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary-purple to-primary-blue bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue managing your chemical safety system
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-purple to-primary-blue text-white hover:text-white hover:opacity-90 transition-all duration-300"
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