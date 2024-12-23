import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="text-white hover:bg-white/50 hover:text-black transition-colors duration-200 ease-in-out w-full justify-start pl-2 group-data-[state=collapsed]:px-3 group-data-[state=collapsed]:py-3"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-5 w-5 mr-2 group-data-[state=collapsed]:mr-0" />
          <span className="group-data-[state=collapsed]:hidden">Dark mode</span>
        </>
      ) : (
        <>
          <Sun className="h-5 w-5 mr-2 group-data-[state=collapsed]:mr-0" />
          <span className="group-data-[state=collapsed]:hidden">Light mode</span>
        </>
      )}
    </Button>
  );
};