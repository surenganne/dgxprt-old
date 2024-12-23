import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { SidebarFooter } from "@/components/ui/sidebar";
import { AdminSidebarCollapse } from "./AdminSidebarCollapse";
import { useTheme } from "@/components/ui/theme-provider";
import { toast } from "sonner";

export const AdminSidebarFooter = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // If we get a 403 user_not_found error, the user is already signed out
      // or doesn't exist anymore, so we can just redirect them
      if (error?.message?.includes('user_not_found')) {
        console.log('User already signed out or does not exist');
        navigate("/auth");
        toast.success("Signed out successfully");
        return;
      }

      if (error) {
        console.error('Error signing out:', error);
        toast.error("Error signing out");
        return;
      }

      navigate("/auth");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error('Error in sign out process:', error);
      toast.error("Error signing out");
      // Force navigate to auth page if we catch any error
      navigate("/auth");
    }
  };

  return (
    <SidebarFooter className="p-4 border-t border-white/10">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
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
            className="text-white hover:bg-white/50 hover:text-black transition-colors duration-200 ease-in-out w-full justify-start pl-2 group-data-[state=collapsed]:px-3 group-data-[state=collapsed]:py-3"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <ThemeToggle />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-white hover:bg-white/50 hover:text-black transition-colors duration-200 ease-in-out w-full justify-start pl-2 group-data-[state=collapsed]:px-3 group-data-[state=collapsed]:py-3"
          >
            <div className="flex items-center w-full">
              <LogOut className="h-5 w-5" />
              <span className="ml-2 group-data-[state=collapsed]:hidden">Logout</span>
            </div>
          </Button>
        </div>
      </div>
    </SidebarFooter>
  );
};