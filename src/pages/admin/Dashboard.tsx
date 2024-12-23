import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AdminSidebarContent } from "@/components/admin/AdminSidebarContent";
import { AdminSidebarFooter } from "@/components/admin/AdminSidebarFooter";
import { menuItems } from "@/config/admin-menu";

const AdminDashboard = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (!profile?.is_admin) {
        navigate("/dashboard");
      }
    };

    checkAdminAccess();
  }, [session, navigate, supabase]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar 
          className="bg-primary-blue transition-all duration-300 ease-in-out"
          variant="sidebar"
          collapsible="icon"
        >
          <SidebarHeader className="p-4 border-b border-border/10 bg-white flex justify-center">
            <img
              src="/dg-text-logo.png"
              alt="DGXPRT Logo"
              className="h-8 w-auto object-contain group-data-[state=collapsed]:hidden"
            />
            <img
              src="/dg-only-logo.png"
              alt="DGXPRT Icon"
              className="h-8 w-8 hidden group-data-[state=collapsed]:block object-contain"
            />
          </SidebarHeader>

          <AdminSidebarContent />
          <AdminSidebarFooter />
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-foreground">
                Admin Dashboard
              </h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {menuItems.slice(0, 6).map((item) => (
                <div
                  key={item.path}
                  className="p-6 rounded-lg border border-border bg-card hover:border-primary-purple/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-md bg-primary-purple/10 dark:bg-primary-purple/20">
                      <item.icon className="h-6 w-6 text-primary-purple" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">
                      {item.label}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Manage {item.label.toLowerCase()} and related settings
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;