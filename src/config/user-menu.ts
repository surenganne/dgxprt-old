import {
  LayoutDashboard,
  Beaker,
  FileText,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";

export const userMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/user/dashboard" },
  { icon: Beaker, label: "Chemical Register", path: "/user/chemicals" },
  { icon: FileText, label: "SDS Documents", path: "/user/sds" },
  { icon: AlertTriangle, label: "Risk Assessments", path: "/user/risk-assessments" },
  { icon: ClipboardList, label: "Reports", path: "/user/reports" },
];