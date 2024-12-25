import { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("[ProtectedRoute] Checking auth - Current path:", location.pathname);
        console.log("[ProtectedRoute] Session:", session);
        console.log("[ProtectedRoute] Admin only:", adminOnly);

        if (!session?.user) {
          console.log("[ProtectedRoute] No session, will redirect to auth");
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        // Check user profile including password reset status
        const { data: profile, error: profileError } = await supabaseClient
          .from("profiles")
          .select("is_admin, has_reset_password")
          .eq("id", session.user.id)
          .single();
        
        if (profileError) {
          console.error("[ProtectedRoute] Error fetching profile:", profileError);
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        console.log("[ProtectedRoute] User profile:", profile);

        // If password hasn't been reset and user is not already on reset-password page
        if (!profile?.has_reset_password && location.pathname !== '/reset-password') {
          console.log("[ProtectedRoute] User needs to reset password, redirecting to /reset-password");
          navigate("/reset-password", { replace: true });
          setIsLoading(false);
          return;
        }

        // Only check admin status if adminOnly is true and user has reset password
        if (adminOnly && !profile?.is_admin) {
          console.log("[ProtectedRoute] User is not admin, redirecting to dashboard");
          navigate("/dashboard");
          setIsLoading(false);
          return;
        }

        setIsAuthorized(true);
        setIsLoading(false);
      } catch (error) {
        console.error("[ProtectedRoute] Error in auth check:", error);
        setIsAuthorized(false);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [session, navigate, supabaseClient, adminOnly, location.pathname]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthorized) {
    console.log("[ProtectedRoute] Not authorized, rendering Navigate component");
    return <Navigate to="/auth" replace />;
  }
  
  console.log("[ProtectedRoute] Auth check passed, rendering children");
  return <>{children}</>;
};