import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  
  const isActiveLink = (path: string) => {
    return location.hash === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container px-4 mx-auto">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="flex items-center gap-2 transition-transform hover:scale-105"
              aria-label="DGXPRT Home"
            >
              <img src="/dg-text-logo.png" alt="DGXPRT Logo" className="h-9 w-auto" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {[
                { href: "#features", label: "Features" },
                { href: "#solutions", label: "Solutions" },
                { href: "#compliance", label: "Compliance" },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 text-sm rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActiveLink(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              className="hidden md:inline-flex transition-all hover:scale-105"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}