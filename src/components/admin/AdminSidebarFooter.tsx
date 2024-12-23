import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { LogOut, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { SidebarFooter, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { toast } from "sonner";

export const AdminSidebarFooter = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { state } = useSidebar();

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
          <div className="flex items-center space-x-3 group-data-[state=collapsed]:justify-center">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-data-[state=collapsed]:w-6 group-data-[state=collapsed]:h-6">
              {session?.user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 group-data-[state=collapsed]:hidden">
              <p className="text-sm font-medium text-white truncate">
                {session?.user?.email}
              </p>
              <p className="text-xs text-white/70">Administrator</p>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 transition-colors duration-200 ease-in-out group-data-[state=collapsed]:hidden"
              size="icon"
              asChild
            >
              <SidebarTrigger>
                <PanelLeft className="h-4 w-4 group-data-[state=collapsed]:h-5 group-data-[state=collapsed]:w-5" />
              </SidebarTrigger>
            </Button>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 transition-colors duration-200 ease-in-out hidden group-data-[state=collapsed]:flex group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:ml-0.5"
            size="icon"
            asChild
          >
            <SidebarTrigger>
              <PanelLeft className="h-5 w-5" />
            </SidebarTrigger>
          </Button>
        </div>
        <div className="flex items-center justify-between group-data-[state=collapsed]:flex-col group-data-[state=collapsed]:space-y-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="hover:bg-white/10 text-white group-data-[state=collapsed]:mt-auto"
          >
            <LogOut className="h-4 w-4 group-data-[state=collapsed]:h-5 group-data-[state=collapsed]:w-5" />
          </Button>
        </div>
      </div>
    </SidebarFooter>
  );
};