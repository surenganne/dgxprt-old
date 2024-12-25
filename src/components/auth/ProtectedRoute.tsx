import { useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const session = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const supabaseClient = useSupabaseClient();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("[ProtectedRoute] Checking auth - Current path:", location.pathname);
        console.log("[ProtectedRoute] Session:", session);
        console.log("[ProtectedRoute] Admin only:", adminOnly);

        if (!session?.user) {
          console.log("[ProtectedRoute] No session, redirecting to auth");
          navigate("/auth");
          return;
        }

        // Check admin status if adminOnly is true
        if (adminOnly) {
          console.log("[ProtectedRoute] Checking admin status");
          const { data: profile, error: profileError } = await supabaseClient
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();
          
          if (profileError) {
            console.error("[ProtectedRoute] Error fetching profile:", profileError);
            return;
          }

          console.log("[ProtectedRoute] User profile:", profile);
          
          if (!profile?.is_admin) {
            console.log("[ProtectedRoute] User is not admin, redirecting to dashboard");
            navigate("/dashboard");
            return;
          }
        }

        // Only check reset password status if user is on the reset password page
        if (location.pathname === '/reset-password') {
          console.log("[ProtectedRoute] Checking password reset status");
          const { data: profile, error: profileError } = await supabaseClient
            .from("profiles")
            .select("has_reset_password")
            .eq("id", session.user.id)
            .single();

          if (profileError) {
            console.error("[ProtectedRoute] Error checking reset password status:", profileError);
            return;
          }

          console.log("[ProtectedRoute] Password reset status:", profile?.has_reset_password);

          // If user has already reset password, redirect them to their appropriate dashboard
          if (profile?.has_reset_password) {
            const { data: userProfile } = await supabaseClient
              .from("profiles")
              .select("is_admin")
              .eq("id", session.user.id)
              .single();
            
            console.log("[ProtectedRoute] Redirecting user who already reset password");
            navigate(userProfile?.is_admin ? '/admin' : '/dashboard');
          }
        }
      } catch (error) {
        console.error("[ProtectedRoute] Error in auth check:", error);
      }
    };

    checkAuth();
  }, [session, location, navigate, supabaseClient, adminOnly]);
  
  if (!session) {
    console.log("[ProtectedRoute] No session, rendering Navigate component");
    return <Navigate to="/auth" replace />;
  }
  
  console.log("[ProtectedRoute] Auth check passed, rendering children");
  return <>{children}</>;
};