import { useLocation, useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const MagicLinkHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const supabaseClient = useSupabaseClient();
  const [isHandlingMagicLink, setIsHandlingMagicLink] = useState(false);

  useEffect(() => {
    const handleMagicLink = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
      
      const token = searchParams.get("token") || hashParams.get("access_token");
      const type = searchParams.get("type") || hashParams.get("type");

      if (!token || (type !== "magiclink" && type !== "recovery")) {
        return;
      }

      setIsHandlingMagicLink(true);
      
      try {
        if (hashParams.get("access_token")) {
          const { error: setSessionError } = await supabaseClient.auth.setSession({
            access_token: hashParams.get("access_token")!,
            refresh_token: hashParams.get("refresh_token") || "",
          });
          
          if (setSessionError) throw setSessionError;
        } else {
          const { error: exchangeError } = await supabaseClient.auth.exchangeCodeForSession(token);
          if (exchangeError) throw exchangeError;
        }

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError) throw userError;

        if (user) {
          console.log("[MagicLinkHandler] User authenticated:", user.email);
          const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('has_reset_password, is_admin')
            .eq('id', user.id)
            .maybeSingle();

          if (profileError) {
            console.error("[MagicLinkHandler] Error fetching profile:", profileError);
            throw profileError;
          }

          if (!profile) {
            console.error("[MagicLinkHandler] No profile found for user:", user.email);
            toast.error("User profile not found. Please contact support.");
            navigate('/auth');
            return;
          }

          console.log("[MagicLinkHandler] Profile found:", profile);
          if (!profile.has_reset_password) {
            navigate('/reset-password');
          } else {
            navigate(profile.is_admin ? '/admin' : '/dashboard');
          }
        }
      } catch (error: any) {
        console.error('[MagicLinkHandler] Magic link error:', error);
        toast.error("Error processing magic link");
        navigate('/auth');
      } finally {
        setIsHandlingMagicLink(false);
      }
    };

    handleMagicLink();
  }, [location, navigate, supabaseClient]);

  if (isHandlingMagicLink) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Processing Magic Link</h2>
        <p className="text-muted-foreground">Please wait while we verify your access...</p>
      </div>
    </div>;
  }

  return null;