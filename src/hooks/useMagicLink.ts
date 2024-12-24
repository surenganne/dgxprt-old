import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

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

    const handleMagicLink = async () => {
      if (!token || (type !== "magiclink" && type !== "recovery")) {
        setInitialAuthCheckDone(true);
        return;
      }

      try {
        if (!emailFromUrl && token) {
          const decodedToken = decodeJWT(token);
          if (decodedToken?.email) {
            setEmail(decodedToken.email);
          }
        } else if (emailFromUrl) {
          setEmail(emailFromUrl);
        }
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          toast.error("Error verifying magic link");
          setInitialAuthCheckDone(true);
          return;
        }

        if (!session) {
          if (hashParams.get("access_token")) {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: hashParams.get("access_token")!,
              refresh_token: hashParams.get("refresh_token") || ""
            });
            
            if (setSessionError) {
              toast.error("Error verifying magic link");
              setInitialAuthCheckDone(true);
              return;
            }
          } else {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(token);
            
            if (exchangeError) {
              toast.error("Error verifying magic link");
              setInitialAuthCheckDone(true);
              return;
            }
          }
        }
          
        if (isTemp) {
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

      } catch (error) {
        toast.error("Error processing magic link");
      } finally {
        setInitialAuthCheckDone(true);
      }
    };

    handleMagicLink();
  }, [location, supabase.auth, setEmail, setInitialAuthCheckDone]);
};