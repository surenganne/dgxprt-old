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
    const handleSuccessfulLogin = async (userId: string) => {
      try {
        // Don't redirect if we're handling a magic link
        const params = new URLSearchParams(location.search);
        if (params.get("token") && params.get("type") === "magiclink") {
          console.log("Magic link detected, skipping redirect");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin, has_reset_password, status")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error checking user profile:", error);
          toast.error("Error checking user profile");
          return;
        }

        if (!profile) {
          console.error("No profile found for user");
          toast.error("User profile not found");
          return;
        }

        if (profile.status !== "active") {
          toast.error("Your account is not active");
          await supabase.auth.signOut();
          return;
        }

        if (!profile.has_reset_password) {
          toast.info("Please reset your password for security reasons.");
        }

        if (profile.is_admin) {
          toast.success("Welcome back, admin!");
          navigate("/admin/dashboard");
        } else {
          toast.success("Login successful!");
          navigate("/dashboard");
        }
      } catch (error: any) {
        console.error("Error checking user profile:", error);
        toast.error("Error checking user profile");
      }
    };

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }

        if (session?.user) {
          await handleSuccessfulLogin(session.user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setInitialAuthCheckDone(true);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        if (event === "SIGNED_IN" && session) {
          await handleSuccessfulLogin(session.user.id);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, supabase, setInitialAuthCheckDone, location.search]);
};