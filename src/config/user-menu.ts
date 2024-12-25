import { FileText, Beaker, AlertTriangle, BarChart3 } from "lucide-react";

export const userMenu = [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: BarChart3,
  },
  {
    title: "Chemical Register",
    href: "/user/chemicals",
    icon: Beaker,
  },
  {
    title: "SDS Documents",
    href: "/user/sds",
    icon: FileText,
  },
  {
    title: "Risk Assessments",
    href: "/user/risk-assessments",
    icon: AlertTriangle,
  },
];