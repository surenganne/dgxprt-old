import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { menuItems } from "@/config/admin-menu";

export const AdminSidebarContent = () => {
  const navigate = useNavigate();

  return (
    <SidebarContent className="flex flex-col flex-1">
      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 group-data-[state=collapsed]:px-2"
            onClick={() => navigate(item.path)}
          >
            <item.icon className="h-4 w-4 shrink-0 group-data-[state=collapsed]:mr-0 mr-2" />
            <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
          </Button>
        ))}
      </nav>
      <SidebarTrigger 
        className="w-full justify-start text-white hover:bg-white/10 mb-4 group-data-[state=collapsed]:px-2" 
      />
    </SidebarContent>
  );
};