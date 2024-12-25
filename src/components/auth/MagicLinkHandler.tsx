import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
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
        console.log("[MagicLinkHandler] Current URL:", window.location.href);
        
        // Get parameters from URL
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
        
        console.log("[MagicLinkHandler] Search params:", Object.fromEntries(searchParams));
        console.log("[MagicLinkHandler] Hash params:", Object.fromEntries(hashParams));
        
        // Check for both PKCE flow (code) and legacy flow (token)
        const code = searchParams.get("code");
        const token = searchParams.get("token") || hashParams.get("access_token");
        const type = searchParams.get("type") || hashParams.get("type");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        console.log("[MagicLinkHandler] Parsed parameters:", {
          code,
          token,
          type,
          error,
          errorDescription
        });

        if (error || errorDescription) {
          console.error("[MagicLinkHandler] Auth error:", { error, errorDescription });
          throw new Error(errorDescription || error || "Authentication error");
        }

        if (!code && !token) {
          console.log("[MagicLinkHandler] No authentication parameters found");
          navigate('/auth');
          return;
        }

        // Clear any existing session first
        console.log("[MagicLinkHandler] Clearing existing session");
        await supabaseClient.auth.signOut();
        
        let session;

        if (code) {
          console.log("[MagicLinkHandler] Using PKCE flow with code");
          const { data, error } = await supabaseClient.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("[MagicLinkHandler] Code exchange error:", error);
            throw error;
          }
          console.log("[MagicLinkHandler] Code exchange successful:", data);
          session = data.session;
        } else if (token) {
          console.log("[MagicLinkHandler] Using legacy flow with token");
          if (hashParams.get("access_token")) {
            const { data, error } = await supabaseClient.auth.setSession({
              access_token: token,
              refresh_token: hashParams.get("refresh_token") || ""
            });
            if (error) {
              console.error("[MagicLinkHandler] Token session error:", error);
              throw error;
            }
            console.log("[MagicLinkHandler] Token session set successfully:", data);
            session = data.session;
          } else {
            const { data, error } = await supabaseClient.auth.getSession();
            if (error) {
              console.error("[MagicLinkHandler] Get session error:", error);
              throw error;
            }
            console.log("[MagicLinkHandler] Got existing session:", data);
            session = data.session;
          }
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
        console.error('[MagicLinkHandler] Error stack:', error.stack);
        
        // Check if it's a refresh token error
        if (error.message?.includes('refresh_token_not_found')) {
          await supabaseClient.auth.signOut();
          toast.error("Your session has expired. Please sign in again.");
        } else {
          toast.error(`Error processing magic link: ${error.message}`);
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