import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

const Dashboard = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!session?.user) {
          navigate("/auth");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin, has_reset_password")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }

        // If password hasn't been reset, redirect to reset page
        if (!profile?.has_reset_password) {
          navigate("/reset-password", { replace: true });
          return;
        }

        // Redirect based on user role
        if (profile?.is_admin) {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/user/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Error in auth check:", error);
        toast.error("Error checking authentication");
      }
    };

    checkAuth();
  }, [session, navigate, supabase]);

  // Show nothing while checking auth
  return null;
};

export default Dashboard;