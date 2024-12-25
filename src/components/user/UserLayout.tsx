import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { UserSidebarContent } from "./UserSidebarContent";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const session = useSession();
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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <BackgroundEffects />
        <Sidebar 
          className="bg-primary-blue transition-all duration-300 ease-in-out"
          variant="sidebar"
          collapsible="icon"
        >
          <SidebarHeader className="p-4 border-b border-border/10 bg-white/5 flex justify-center">
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

          <div className="mt-auto p-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                {session?.user?.email?.[0].toUpperCase()}
              </div>
              <span className="text-sm text-white/90 truncate group-data-[state=collapsed]:hidden">
                {session?.user?.email}
              </span>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/50 hover:text-black transition-colors duration-200 ease-in-out w-full justify-start"
                onClick={() => {}}
              >
                <ThemeToggle />
                <span className="ml-2 group-data-[state=collapsed]:hidden">Theme</span>
              </Button>
              <Button 
                variant="ghost"
                onClick={handleSignOut}
                className="text-white hover:bg-white/50 hover:text-black transition-colors duration-200 ease-in-out w-full justify-start"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}