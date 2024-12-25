import { PanelLeft, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export const UserSidebarCollapse = () => {
  const { state } = useSidebar();

  return (
    <Button
      variant="ghost"
      className="text-white hover:bg-white/50 hover:text-black transition-colors duration-200 ease-in-out w-full justify-start pl-2 group-data-[state=collapsed]:px-3 group-data-[state=collapsed]:py-3"
      size="sm"
      asChild
    >
      <SidebarTrigger>
        {state === "collapsed" ? (
          <div className="flex items-center w-full">
            <PanelRightOpen className="h-5 w-5" />
            <span className="ml-2">Expand</span>
          </div>
        ) : (
          <div className="flex items-center w-full">
            <PanelLeft className="h-5 w-5" />
            <span className="ml-2">Collapse</span>
          </div>
        )}
      </SidebarTrigger>
    </Button>
  );
};