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
          console.log("Handling magic link verification on auth page");
          
          // Verify the magic link token
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
              toast.info("Please reset your password");
              return;
            }
          }

          // Set the email for the login form if available
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
  }, [location, supabase.auth, setEmail, setInitialAuthCheckDone]);
};