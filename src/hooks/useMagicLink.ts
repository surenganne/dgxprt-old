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
          console.log("Magic link detected, signing out existing session");
          // Clear any existing session
          await supabase.auth.signOut();
          // Clear local storage
          localStorage.removeItem("supabase.auth.token");
          // Wait a bit to ensure cleanup is complete
          await new Promise((resolve) => setTimeout(resolve, 100));
          setInitialAuthCheckDone(true);
        } catch (error) {
          console.error("Error handling magic link:", error);
          toast.error("Error processing magic link");
        }
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