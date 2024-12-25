import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not found");

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          has_reset_password: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast.success("Password updated successfully! Redirecting to dashboard...");
      
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      // Short delay to show the success message before redirecting
      setTimeout(() => {
        navigate(profile?.is_admin ? '/admin/dashboard' : '/dashboard', { replace: true });
      }, 2000);

    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error("Error updating password: " + error.message);
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

      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <img
            src="/dg-text-logo.png"
            alt="DGXPRT Logo"
            className="mx-auto h-12 w-auto mb-8"
          />
          <h2 className="text-2xl font-semibold mb-4">Set Your Password</h2>
          <p className="text-muted-foreground">
            Please set a new password for your account
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                className="mt-1"
                placeholder="Enter your new password"
                minLength={6}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="mt-1"
                placeholder="Confirm your new password"
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-purple to-primary-blue text-white"
            disabled={loading}
          >
            {loading ? "Updating Password..." : "Set Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;