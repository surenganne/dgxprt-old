import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export const useMagicLink = (
  setEmail: (value: string) => void,
  setInitialAuthCheckDone: (value: boolean) => void
) => {
  const location = useLocation();
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
          
          // First, clear any existing session
          await supabase.auth.signOut();
          
          // Clear local storage
          localStorage.removeItem("supabase.auth.token");
          localStorage.removeItem("supabase.auth.expires_at");
          localStorage.removeItem("supabase.auth.refresh_token");
          
          // Wait a bit to ensure cleanup is complete
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Now verify the magic link token
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "magiclink",
          });

          if (verifyError) {
            console.error("Error verifying magic link:", verifyError);
            toast.error("Invalid or expired magic link");
          } else {
            console.log("Magic link verified successfully");
          }
          
          setInitialAuthCheckDone(true);
        } catch (error) {
          console.error("Error handling magic link:", error);
          toast.error("Error processing magic link");
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
  }, [location, supabase.auth, setEmail, setInitialAuthCheckDone]);
};