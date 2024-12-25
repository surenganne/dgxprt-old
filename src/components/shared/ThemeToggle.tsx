import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

export const ThemeToggle = () => {
  const { theme } = useTheme();

  return (
    <>
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">
        {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      </span>
    </>
  );
};