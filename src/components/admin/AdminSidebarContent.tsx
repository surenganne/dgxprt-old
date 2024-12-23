import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SidebarContent, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { menuItems } from "@/config/admin-menu";
import { PanelLeft } from "lucide-react";

export const AdminSidebarContent = () => {
  const navigate = useNavigate();
  const { state } = useSidebar();

  return (
    <SidebarContent className="flex flex-col flex-1">
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/20 transition-colors duration-200 ease-in-out group-data-[state=collapsed]:px-2"
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-4 w-4 shrink-0 group-data-[state=collapsed]:mr-0 mr-2" />
            <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
          </Button>
        ))}
      </nav>
      <Button
        variant="ghost"
        className="w-full justify-start text-white hover:bg-white/20 transition-colors duration-200 ease-in-out mb-4 group-data-[state=collapsed]:px-2"
        asChild
      >
        <SidebarTrigger>
          <PanelLeft className="h-4 w-4 shrink-0 group-data-[state=collapsed]:mr-0 mr-2" />
          <span className="text-white group-data-[state=collapsed]:hidden">
            {state === 'collapsed' ? 'Expand' : 'Collapse'}
          </span>
        </SidebarTrigger>
      </Button>
    </SidebarContent>
  );
};