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
      try {
        setIsHandlingMagicLink(true);
        console.log("[MagicLinkHandler] Starting magic link handling");

        // Get the code from the URL
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");
        const type = searchParams.get("type");

        console.log("[MagicLinkHandler] Code:", code);
        console.log("[MagicLinkHandler] Type:", type);

        if (!code) {
          console.log("[MagicLinkHandler] No code found in URL");
          navigate('/auth');
          return;
        }

        // Clear any existing session first
        await supabaseClient.auth.signOut();
        
        console.log("[MagicLinkHandler] Exchanging code for session");
        const { data: { session }, error: exchangeError } = await supabaseClient.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error("[MagicLinkHandler] Token exchange error:", exchangeError);
          throw exchangeError;
        }

        if (!session?.user) {
          console.error("[MagicLinkHandler] No user in session");
          throw new Error("No user found in session");
        }

        console.log("[MagicLinkHandler] User authenticated:", session.user.email);
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('has_reset_password, is_admin')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("[MagicLinkHandler] Error fetching profile:", profileError);
          throw profileError;
        }

        if (!profile) {
          console.error("[MagicLinkHandler] No profile found for user:", session.user.email);
          toast.error("User profile not found. Please contact support.");
          navigate('/auth');
          return;
        }

        console.log("[MagicLinkHandler] Profile found:", profile);
        // Treat null has_reset_password as false
        if (!profile.has_reset_password) {
          console.log("[MagicLinkHandler] User needs to reset password");
          navigate('/reset-password', { replace: true });
        } else {
          console.log("[MagicLinkHandler] User has reset password, redirecting to dashboard");
          navigate(profile.is_admin ? '/admin' : '/dashboard', { replace: true });
        }
      } catch (error: any) {
        console.error('[MagicLinkHandler] Magic link error:', error);
        
        // Check if it's a refresh token error
        if (error.message?.includes('refresh_token_not_found')) {
          await supabaseClient.auth.signOut();
          toast.error("Your session has expired. Please sign in again.");
        } else {
          toast.error("Error processing magic link");
        }
        
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
};