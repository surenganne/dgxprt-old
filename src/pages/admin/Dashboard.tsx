import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useTheme } from "@/components/ui/theme-provider";
import {
  LayoutDashboard,
  Users,
  Building2,
  Beaker,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const AdminDashboard = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { theme } = useTheme();

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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Building2, label: "Locations", path: "/admin/locations" },
    { icon: Beaker, label: "Chemicals", path: "/admin/chemicals" },
    { icon: FileText, label: "SDS", path: "/admin/sds" },
    { icon: BarChart3, label: "Reports", path: "/admin/reports" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="p-4 border-b border-border">
            <div className="flex justify-center">
              <img src="/dg-text-logo.png" alt="DGXPRT Logo" className="h-6 w-auto" />
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="w-full justify-start hover:bg-primary-purple/10 dark:hover:bg-primary-purple/20"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4 text-primary-purple" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-purple flex items-center justify-center text-white">
                  {session?.user?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session?.user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="hover:bg-destructive/10 dark:hover:bg-destructive/20"
                >
                  <LogOut className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-foreground">
                Admin Dashboard
              </h1>
              <SidebarTrigger />
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