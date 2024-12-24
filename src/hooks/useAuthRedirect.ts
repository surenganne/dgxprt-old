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
    const locationState = location.state as { token?: string; type?: string } | null;
    
    // Check both URL params and location state for magic link
    const isMagicLink = (params.get("token") && params.get("type") === "magiclink") ||
                       (locationState?.token && locationState?.type === "magiclink");

    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setInitialAuthCheckDone(true);
        return;
      }

      try {
        // Don't redirect if we're handling a magic link
        if (isMagicLink) {
          console.log("Magic link detected, skipping redirect");
          setInitialAuthCheckDone(true);
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin, has_reset_password, status")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error checking user profile:", error);
          toast.error("Error checking user profile");
          setInitialAuthCheckDone(true);
          return;
        }

        if (!profile) {
          console.error("No profile found for user");
          toast.error("User profile not found");
          setInitialAuthCheckDone(true);
          return;
        }

        if (profile.status !== "active") {
          toast.error("Your account is not active");
          await supabase.auth.signOut();
          setInitialAuthCheckDone(true);
          return;
        }

        if (!profile.has_reset_password) {
          // If password hasn't been reset, force them to reset it
          if (location.pathname !== '/auth/reset-password') {
            navigate('/auth/reset-password', { replace: true });
          }
          setInitialAuthCheckDone(true);
          return;
        }

        // Only redirect if we're on the auth page and not handling a magic link
        if (location.pathname === '/auth' && !isMagicLink) {
          if (profile.is_admin) {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }
      } catch (error) {
        console.error("Error in auth redirect:", error);
      } finally {
        setInitialAuthCheckDone(true);
      }
    };

    checkAuthAndRedirect();
  }, [location, navigate, supabase]);
};