import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AdminSidebarContent } from "@/components/admin/AdminSidebarContent";
import { AdminSidebarFooter } from "@/components/admin/AdminSidebarFooter";
import { SDSManagement } from "@/components/admin/sds/SDSManagement";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";

const SDS = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin, status")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Error checking admin access");
          navigate("/dashboard");
          return;
        }

        if (!profile?.is_admin || profile.status !== "active") {
          toast.error("You don't have admin access");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error in admin access check:", error);
        toast.error("Error checking admin access");
        navigate("/dashboard");
      }
    };

    checkAdminAccess();
  }, [session, navigate]);

  if (!session) {
    return null;
  }

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
              className="h-10 w-auto object-contain group-data-[state=collapsed]:hidden"
            />
            <img
              src="/dg-only-logo.png"
              alt="DGXPRT Icon"
              className="h-10 w-10 hidden group-data-[state=collapsed]:block object-contain"
            />
          </SidebarHeader>

          <AdminSidebarContent />
          <AdminSidebarFooter />
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <SDSManagement />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SDS;