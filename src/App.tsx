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

// Magic link handler wrapper
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
      const email = searchParams.get("email");

      if (token && (type === "magiclink" || type === "recovery")) {
        setIsHandlingMagicLink(true);
        
        try {
          const currentPath = location.pathname;
          if (currentPath !== '/auth') {
            const redirectUrl = `/auth?token=${token}&type=${type}${email ? `&email=${email}` : ''}`;
            navigate(redirectUrl, { replace: true });
          }
        } catch (error) {
          toast.error("Error processing magic link");
          navigate('/auth');
        } finally {
          setIsHandlingMagicLink(false);
        }
      }
    };

    const handlePostMessage = (event: MessageEvent) => {
      const currentOrigin = window.location.origin.replace(/^https?:\/\//, '');
      const eventOrigin = event.origin.replace(/^https?:\/\//, '');
      
      const isAllowedOrigin = 
        currentOrigin === eventOrigin ||
        eventOrigin.endsWith('.' + currentOrigin) ||
        currentOrigin.endsWith('.' + eventOrigin) ||
        eventOrigin === 'zrmjzuebsupnwuekzfio.supabase.co';
      
      if (!isAllowedOrigin) {
        return;
      }

      if (event.data?.type === 'SUPABASE_AUTH') {
        handleMagicLink();
      }
    };

    window.addEventListener('message', handlePostMessage);
    handleMagicLink();

    return () => {
      window.removeEventListener('message', handlePostMessage);
    };
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