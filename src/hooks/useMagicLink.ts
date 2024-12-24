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

    console.log("[useMagicLink] Parameters:", {
      emailFromUrl,
      isTemp,
      hasToken: token ? "yes" : "no",
      type,
      fullUrl: window.location.href // Fixed: Using window.location.href instead of location.href
    });

    const handleMagicLink = async () => {
      if (!token || type !== "magiclink") {
        console.log("[useMagicLink] No magic link parameters found");
        setInitialAuthCheckDone(true);
        return;
      }

      try {
        console.log("[useMagicLink] Starting magic link verification");
        
        console.log("[useMagicLink] Clearing existing session");
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error("[useMagicLink] Error clearing session:", signOutError);
        }
        
        console.log("[useMagicLink] Verifying OTP token");
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "magiclink",
        });

        if (verifyError) {
          console.error("[useMagicLink] Error verifying magic link:", verifyError);
          toast.error("Invalid or expired magic link");
          setInitialAuthCheckDone(true);
          return;
        }

        console.log("[useMagicLink] Magic link verified successfully");

        if (emailFromUrl) {
          console.log("[useMagicLink] Setting email from URL:", emailFromUrl);
          setEmail(emailFromUrl);
          
          if (isTemp) {
            console.log("[useMagicLink] Checking password reset status");
            const { data: profile } = await supabase
              .from("profiles")
              .select("has_reset_password")
              .eq("email", emailFromUrl)
              .single();

            if (!profile?.has_reset_password) {
              toast.info("Please reset your password");
            }
            
            toast.info("Please use the temporary password sent to your email to log in");
          }
        }

      } catch (error) {
        console.error("[useMagicLink] Error in magic link handling:", error);
        toast.error("Error processing magic link");
      } finally {
        setInitialAuthCheckDone(true);
      }
    };

    handleMagicLink();
  }, [location, supabase.auth, setEmail, setInitialAuthCheckDone]);
};