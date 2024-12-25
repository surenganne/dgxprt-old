import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { UserSidebarContent } from "@/components/user/UserSidebarContent";
import { UserSidebarFooter } from "@/components/user/UserSidebarFooter";

const UserSDS = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      if (!session?.user) {
        navigate("/auth");
        return;
      }
    };

    checkAccess();
  }, [session, navigate]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="bg-primary-blue">
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
          <UserSidebarContent />
          <UserSidebarFooter />
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold">SDS Documents</h2>
            {/* Content will be implemented in the next phase */}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default UserSDS;