import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { SessionContextProvider, useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminLocations from "./pages/admin/Locations";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

const MagicLinkHandler = ({ children }: { children: React.ReactNode }) => {
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

      if (token && (type === "magiclink" || type === "recovery")) {
        setIsHandlingMagicLink(true);
        
        try {
          const { data: { user }, error } = await supabaseClient.auth.getUser();
          
          if (error) throw error;
          
          if (user) {
            const { data: profile } = await supabaseClient
              .from('profiles')
              .select('has_reset_password, is_admin')
              .eq('id', user.id)
              .single();

            // If user hasn't reset password and came through magic link, send to reset password
            if (!profile?.has_reset_password) {
              navigate('/reset-password');
            } else {
              navigate(profile?.is_admin ? '/admin/dashboard' : '/dashboard');
            }
          }
        } catch (error: any) {
          console.error('Magic link error:', error);
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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const supabaseClient = useSupabaseClient();
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      // Only check reset password status if user is on the reset password page
      if (location.pathname === '/reset-password') {
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("has_reset_password")
          .eq("id", session.user.id)
          .single();

        // If user has already reset password or didn't come through magic link,
        // redirect them to their appropriate dashboard
        if (profile?.has_reset_password) {
          const { data: userProfile } = await supabaseClient
            .from("profiles")
            .select("is_admin")
            .eq("id", session.user.id)
            .single();
          
          navigate(userProfile?.is_admin ? '/admin/dashboard' : '/dashboard');
        }
      }
    };

    checkAuth();
  }, [session, location, navigate, supabaseClient]);
  
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
                  <Route path="/reset-password" element={
                    <ProtectedRoute>
                      <ResetPassword />
                    </ProtectedRoute>
                  } />
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