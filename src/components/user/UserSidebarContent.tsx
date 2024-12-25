import { userMenu } from "@/config/user-menu";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function UserSidebarContent() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 p-4">
      {userMenu.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              isActive && "bg-primary-purple/10 text-primary-purple hover:bg-primary-purple/20"
            )}
            onClick={() => navigate(item.href)}
          >
            <Icon className="h-4 w-4" />
            <span className="group-data-[state=collapsed]:hidden">
              {item.title}
            </span>
          </Button>
        );
      })}
    </div>
  );
}