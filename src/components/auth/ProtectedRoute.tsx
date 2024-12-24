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
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      // Check admin status if adminOnly is true
      if (adminOnly) {
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single();
        
        if (!profile?.is_admin) {
          navigate("/dashboard");
          return;
        }
      }

      // Only check reset password status if user is on the reset password page
      if (location.pathname === '/reset-password') {
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("has_reset_password")
          .eq("id", session.user.id)
          .single();

        // If user has already reset password, redirect them to their appropriate dashboard
        if (profile?.has_reset_password) {
          const { data: userProfile } = await supabaseClient
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();
          
          navigate(userProfile?.is_admin ? '/admin' : '/dashboard');
        }
      }
    };

    checkAuth();
  }, [session, location, navigate, supabaseClient, adminOnly]);
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};