import {
  LayoutDashboard,
  Users,
  Building2,
  Beaker,
  FileText,
  Settings,
} from "lucide-react";

export const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Building2, label: "Locations", path: "/admin/locations" },
  { icon: Beaker, label: "Chemicals", path: "/admin/chemicals" },
  { icon: FileText, label: "SDS", path: "/admin/sds" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];