import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const supabase = useSupabaseClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin, has_reset_password')
          .eq('id', user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (!profile) {
          throw new Error('Profile not found');
        }

        if (!profile.has_reset_password) {
          navigate('/reset-password', { replace: true });
        } else {
          navigate(profile.is_admin ? '/admin/dashboard' : '/dashboard', { replace: true });
        }

        toast.success('Logged in successfully');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify`,
        },
      });

      if (error) throw error;

      toast.success('Magic link sent to your email');
    } catch (error: any) {
      console.error('Magic link error:', error);
      toast.error(error.message || 'Error sending magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-background/50"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <BackgroundEffects />
      
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg relative z-10">
        <div className="text-center">
          <img
            src="/dg-text-logo.png"
            alt="DGXPRT Logo"
            className="h-12 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold tracking-tight">
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