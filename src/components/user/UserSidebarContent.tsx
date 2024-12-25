import { userMenu } from "@/config/user-menu";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarContent } from "@/components/ui/sidebar";

export function UserSidebarContent() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarContent className="flex flex-col flex-1">
      <nav className="space-y-1 flex-1">
        {userMenu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start text-white hover:bg-white/50 hover:text-black transition-colors duration-200 ease-in-out group-data-[state=collapsed]:px-3 group-data-[state=collapsed]:py-3",
                isActive && "bg-white/20"
              )}
              onClick={() => navigate(item.href)}
            >
              <Icon className="h-4 w-4 shrink-0 group-data-[state=collapsed]:h-5 group-data-[state=collapsed]:w-5 group-data-[state=collapsed]:mr-0 mr-2" />
              <span className="group-data-[state=collapsed]:hidden">{item.title}</span>
            </Button>
          );
        })}
      </nav>
    </SidebarContent>
  );
}