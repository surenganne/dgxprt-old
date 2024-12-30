import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  // Only show theme toggle on admin and user dashboard routes
  const showThemeToggle = location.pathname.includes('/admin/') || 
                         location.pathname.includes('/user/');

  if (!showThemeToggle) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full hover:bg-accent"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">
        {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      </span>
    </Button>
  );
};