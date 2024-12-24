import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { SessionContextProvider, useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminLocations from "./pages/admin/Locations";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

// Magic link handler wrapper
const MagicLinkHandler = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const supabaseClient = useSupabaseClient();
  const [isHandlingMagicLink, setIsHandlingMagicLink] = useState(false);

  useEffect(() => {
    const handleMagicLink = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const type = params.get("type");
      const email = params.get("email");

      console.log("[MagicLinkHandler] URL Parameters:", {
        token: token ? "present" : "absent",
        type,
        email,
        fullUrl: window.location.href
      });

      if (token && type === "magiclink") {
        setIsHandlingMagicLink(true);
        console.log("[MagicLinkHandler] Magic link detected, starting verification process");
        
        try {
          console.log("[MagicLinkHandler] Attempting to sign out existing session");
          const { error: signOutError } = await supabaseClient.auth.signOut();
          if (signOutError) {
            console.error("[MagicLinkHandler] Error signing out:", signOutError);
          } else {
            console.log("[MagicLinkHandler] Successfully signed out existing session");
          }
          
          console.log("[MagicLinkHandler] Clearing auth-related local storage");
          for (const key of Object.keys(localStorage)) {
            if (key.startsWith('supabase.auth.')) {
              localStorage.removeItem(key);
              console.log("[MagicLinkHandler] Cleared localStorage key:", key);
            }
          }

          const currentPath = location.pathname;
          if (currentPath !== '/auth') {
            const redirectUrl = `/auth?token=${token}&type=${type}${email ? `&email=${email}` : ''}`;
            console.log("[MagicLinkHandler] Redirecting to auth page:", redirectUrl);
            navigate(redirectUrl, { replace: true });
          } else {
            console.log("[MagicLinkHandler] Already on auth page, no redirect needed");
          }
        } catch (error) {
          console.error("[MagicLinkHandler] Error in magic link handling:", error);
          toast.error("Error processing magic link");
          navigate('/auth');
        } finally {
          setIsHandlingMagicLink(false);
        }
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

  return <>{children}</>;
};

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  
  // Don't redirect if handling magic link
  if (params.get("token") && params.get("type") === "magiclink") {
    return null;
  }
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <MagicLinkHandler>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute>
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/locations"
                    element={
                      <ProtectedRoute>
                        <AdminLocations />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </MagicLinkHandler>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;