import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { menuItems } from "@/config/admin-menu";

export const AdminSidebarContent = () => {
  const navigate = useNavigate();

  return (
    <SidebarContent className="p-2">
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className="w-full justify-start hover:bg-white/10 group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:justify-center"
            onClick={() => navigate(item.path)}
          >
            <item.icon className="mr-2 h-4 w-4 text-white group-data-[state=collapsed]:mr-0" />
            <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
          </Button>
        ))}
      </nav>
      <SidebarTrigger className="w-full justify-start text-white hover:bg-white/10 mt-1 group-data-[state=collapsed]:px-2 group-data-[state=collapsed]:justify-center" />
    </SidebarContent>
  );
};