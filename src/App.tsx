import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import CreateOwner from "@/pages/CreateOwner";
import ResetPassword from "@/pages/ResetPassword";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MagicLinkHandler } from "@/components/auth/MagicLinkHandler";
import AdminDashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/Users";
import Locations from "@/pages/admin/Locations";
import Chemicals from "@/pages/admin/Chemicals";
import ChemicalCategories from "@/pages/admin/ChemicalCategories";
import SDS from "@/pages/admin/SDS";
import { Navigate } from "react-router-dom";

// User routes
import UserDashboard from "@/pages/user/Dashboard";
import UserChemicals from "@/pages/user/Chemicals";
import UserSDS from "@/pages/user/SDS";
import UserRiskAssessments from "@/pages/user/RiskAssessments";
import UserReports from "@/pages/user/Reports";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/create-owner" element={<CreateOwner />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify" element={<MagicLinkHandler />} />
              
              {/* Legacy dashboard route - will redirect to appropriate dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <Navigate to="/admin/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute adminOnly>
                    <Users />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/locations"
                element={
                  <ProtectedRoute adminOnly>
                    <Locations />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/chemicals"
                element={
                  <ProtectedRoute adminOnly>
                    <Chemicals />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/chemical-categories"
                element={
                  <ProtectedRoute adminOnly>
                    <ChemicalCategories />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/sds"
                element={
                  <ProtectedRoute adminOnly>
                    <SDS />
                  </ProtectedRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="/user"
                element={
                  <ProtectedRoute>
                    <Navigate to="/user/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/user/chemicals"
                element={
                  <ProtectedRoute>
                    <UserChemicals />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/user/sds"
                element={
                  <ProtectedRoute>
                    <UserSDS />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/user/risk-assessments"
                element={
                  <ProtectedRoute>
                    <UserRiskAssessments />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/user/reports"
                element={
                  <ProtectedRoute>
                    <UserReports />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
          <Toaster />
        </ThemeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;