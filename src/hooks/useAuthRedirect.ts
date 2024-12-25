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
    
    // If handling magic link and on auth page, don't redirect
    if (isMagicLink && location.pathname === '/auth') {
      console.log("[useAuthRedirect] On auth page with magic link, completing authentication");
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

        // Skip profile check if on auth page with magic link
        if (location.pathname === '/auth' && isMagicLink) {
          console.log("[useAuthRedirect] Skipping profile check for magic link auth");
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

        // Immediate redirect if on auth page and user is authenticated
        if (location.pathname === '/auth') {
          console.log("[useAuthRedirect] Redirecting to appropriate dashboard");
          const redirectPath = profile.is_admin ? '/admin/dashboard' : '/dashboard';
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