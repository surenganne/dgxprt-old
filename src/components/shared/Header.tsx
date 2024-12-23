import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full py-4 px-6">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/dg-text-logo.png" alt="DGXPRT Logo" className="h-8 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-sm text-muted-foreground hover:text-primary">Features</Link>
            <Link to="#solutions" className="text-sm text-muted-foreground hover:text-primary">Solutions</Link>
            <Link to="#compliance" className="text-sm text-muted-foreground hover:text-primary">Compliance</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button className="bg-primary-purple hover:bg-primary-purple/90" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}