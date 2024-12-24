import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminLocations from "./pages/admin/Locations";
import AdminChemicals from "./pages/admin/Chemicals";
import CreateOwner from "./pages/CreateOwner";
import { supabase } from "@/integrations/supabase/client";
import { MagicLinkHandler } from "@/components/auth/MagicLinkHandler";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

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
                  <Route path="/create-owner" element={<CreateOwner />} />
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
                  <Route
                    path="/admin/chemicals"
                    element={
                      <ProtectedRoute>
                        <AdminChemicals />
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