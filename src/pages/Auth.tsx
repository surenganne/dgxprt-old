import { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useMagicLink } from "@/hooks/useMagicLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  const [isProcessingMagicLink, setIsProcessingMagicLink] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  // Handle magic link and URL parameters
  useMagicLink(setEmail, setInitialAuthCheckDone);

  // Handle authentication redirects
  useAuthRedirect(setInitialAuthCheckDone);

  // Check if user needs to set password
  useEffect(() => {
    const checkPasswordStatus = async () => {
      if (!email) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('has_reset_password')
        .eq('email', email)
        .single();

      if (profile && !profile.has_reset_password) {
        setIsSettingPassword(true);
      }
    };

    checkPasswordStatus();
  }, [email, supabase]);

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

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      // Update the profile to indicate password has been set
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ has_reset_password: true })
        .eq('email', email);

      if (profileError) throw profileError;

      toast.success("Password set successfully");
      setIsSettingPassword(false);
    } catch (error: any) {
      toast.error("Error setting password: " + error.message);
    } finally {
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
          <h2 className="text-2xl font-semibold">
            {isSettingPassword ? "Set Your Password" : "Sign in to your account"}
          </h2>
        </div>

        {isSettingPassword ? (
          <form onSubmit={handleSetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Confirm your new password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Setting password..." : "Set Password"}
            </Button>
          </form>
        ) : (
          <AuthForm
            email={email}
            password={password}
            loading={loading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
            isEmailReadOnly={!!email}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;