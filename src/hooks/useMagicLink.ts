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
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    
    const emailFromUrl = searchParams.get("email");
    const isTemp = searchParams.get("temp") === "true";
    const token = searchParams.get("token") || hashParams.get("access_token");
    const type = searchParams.get("type") || hashParams.get("type");

    console.log("[useMagicLink] Parameters:", {
      emailFromUrl,
      isTemp,
      hasToken: token ? "yes" : "no",
      type,
      fullUrl: window.location.href,
      hasHash: window.location.hash ? "yes" : "no"
    });

    const handleMagicLink = async () => {
      if (!token || (type !== "magiclink" && type !== "recovery")) {
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