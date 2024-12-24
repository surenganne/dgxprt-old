import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export const useMagicLink = (
  setEmail: (value: string) => void,
  setInitialAuthCheckDone: (value: boolean) => void
) => {
  const location = useLocation();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromUrl = params.get("email");
    const isTemp = params.get("temp") === "true";
    const token = params.get("token");
    const type = params.get("type");

    const handleMagicLink = async () => {
      if (token && type === "magiclink") {
        try {
          console.log("Magic link detected, handling auth flow");
          
          // First, ensure we're on the auth page
          if (location.pathname !== '/auth') {
            console.log("Redirecting to auth page for magic link handling");
            navigate('/auth', { 
              replace: true,
              state: { token, type, email: emailFromUrl, isTemp }
            });
            return;
          }

          // Get the current session if any
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          
          // If there's a session and it's for a different user, sign out first
          if (currentSession && currentSession.user.email !== emailFromUrl) {
            await supabase.auth.signOut();
            
            // Clear all auth-related local storage
            for (const key of Object.keys(localStorage)) {
              if (key.startsWith('supabase.auth.')) {
                localStorage.removeItem(key);
              }
            }
            
            // Wait to ensure cleanup is complete
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
          
          // Now verify the magic link token
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "magiclink",
          });

          if (verifyError) {
            console.error("Error verifying magic link:", verifyError);
            toast.error("Invalid or expired magic link");
            return;
          }

          // If this is a temporary password login, check if password needs to be reset
          if (isTemp) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("has_reset_password")
              .eq("email", emailFromUrl)
              .single();

            if (!profile?.has_reset_password) {
              // Redirect to password reset
              navigate("/auth/reset-password", { replace: true });
              return;
            }
          }

          // Set the email for the login form
          if (emailFromUrl) {
            setEmail(emailFromUrl);
          }

        } catch (error) {
          console.error("Error handling magic link:", error);
          toast.error("Error processing magic link");
        } finally {
          setInitialAuthCheckDone(true);
        }
      } else {
        setInitialAuthCheckDone(true);
      }
    };

    handleMagicLink();

    if (emailFromUrl) {
      setEmail(emailFromUrl);
      if (isTemp) {
        toast.info("Please use the temporary password sent to your email to log in.");
      }
    }
  }, [location, navigate, supabase, setEmail, setInitialAuthCheckDone]);
};