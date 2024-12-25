import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export const useAuthRedirect = (
  setInitialAuthCheckDone: (value: boolean) => void
) => {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isMagicLink = params.get("token") && params.get("type") === "magiclink";
    
    console.log("[useAuthRedirect] Current path:", location.pathname);
    console.log("[useAuthRedirect] Magic link detected:", isMagicLink);
    
    // If handling magic link, don't redirect yet
    if (isMagicLink) {
      console.log("[useAuthRedirect] Magic link detected, skipping redirect");
      setInitialAuthCheckDone(true);
      return;
    }

    const checkAuthAndRedirect = async () => {
      try {
        console.log("[useAuthRedirect] Checking session");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          if (sessionError.message?.includes('refresh_token_not_found')) {
            console.log("[useAuthRedirect] Refresh token not found, signing out");
            await supabase.auth.signOut();
            toast.error("Your session has expired. Please sign in again.");
            navigate('/auth', { replace: true });
          } else {
            console.error("[useAuthRedirect] Session error:", sessionError);
          }
          setInitialAuthCheckDone(true);
          return;
        }
        
        if (!session) {
          console.log("[useAuthRedirect] No session found");
          if (location.pathname !== '/auth') {
            navigate('/auth', { replace: true });
          }
          setInitialAuthCheckDone(true);
          return;
        }

        console.log("[useAuthRedirect] Checking user profile");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin, has_reset_password, status")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("[useAuthRedirect] Error checking user profile:", profileError);
          toast.error("Error checking user profile");
          setInitialAuthCheckDone(true);
          return;
        }

        if (!profile) {
          console.error("[useAuthRedirect] No profile found for user");
          toast.error("User profile not found");
          setInitialAuthCheckDone(true);
          return;
        }

        if (profile.status !== "active") {
          console.log("[useAuthRedirect] Account not active");
          toast.error("Your account is not active");
          await supabase.auth.signOut();
          navigate('/auth', { replace: true });
          setInitialAuthCheckDone(true);
          return;
        }

        // Check if user needs to reset password
        if (!profile.has_reset_password && location.pathname !== '/reset-password') {
          console.log("[useAuthRedirect] User needs to reset password");
          navigate('/reset-password', { replace: true });
          setInitialAuthCheckDone(true);
          return;
        }

        // Only redirect to dashboard if not on reset-password page
        if (location.pathname === '/auth' && profile.has_reset_password) {
          console.log("[useAuthRedirect] Redirecting to appropriate dashboard");
          const redirectPath = profile.is_admin ? '/admin' : '/dashboard';
          navigate(redirectPath, { replace: true });
        }

        setInitialAuthCheckDone(true);
      } catch (error) {
        console.error("[useAuthRedirect] Error in auth redirect:", error);
        toast.error("Error checking authentication status");
        setInitialAuthCheckDone(true);
      }
    };

    checkAuthAndRedirect();
  }, [location, navigate, supabase, setInitialAuthCheckDone]);
};