import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full hover:bg-white/10 text-white"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 group-data-[state=collapsed]:h-5 group-data-[state=collapsed]:w-5" />
      ) : (
        <Sun className="h-4 w-4 group-data-[state=collapsed]:h-5 group-data-[state=collapsed]:w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};