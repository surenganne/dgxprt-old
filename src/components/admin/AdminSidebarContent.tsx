import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Beaker,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";
import { SidebarContent } from "@/components/ui/sidebar";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Building2, label: "Locations", path: "/admin/locations" },
  { icon: Beaker, label: "Chemicals", path: "/admin/chemicals" },
  { icon: FileText, label: "SDS", path: "/admin/sds" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

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
    </SidebarContent>
  );
};