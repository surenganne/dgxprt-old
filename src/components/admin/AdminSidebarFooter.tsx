import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { SidebarFooter } from "@/components/ui/sidebar";
import { AdminSidebarCollapse } from "./AdminSidebarCollapse";
import { toast } from "sonner";

export const AdminSidebarFooter = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <SidebarFooter className="p-4 border-t border-white/10">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-data-[state=collapsed]:w-6 group-data-[state=collapsed]:h-6">
              {session?.user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 group-data-[state=collapsed]:hidden">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.email}
              </p>
              <p className="text-xs text-white/70">Administrator</p>
            </div>
          </div>
          <AdminSidebarCollapse />
        </div>
        <div className="flex flex-col space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/50 hover:text-black transition-colors duration-200 ease-in-out w-full justify-start pl-2 group-data-[state=collapsed]:px-3 group-data-[state=collapsed]:py-3"
          >
            <ThemeToggle />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-white hover:bg-white/50 hover:text-black transition-colors duration-200 ease-in-out w-full justify-start pl-2 group-data-[state=collapsed]:px-3 group-data-[state=collapsed]:py-3"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-2 group-data-[state=collapsed]:hidden">Logout</span>
          </Button>
        </div>
      </div>
    </SidebarFooter>
  );
};