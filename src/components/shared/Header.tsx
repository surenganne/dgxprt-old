import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActiveLink = (path: string) => {
    return location.hash === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
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
                    "hover:bg-gray-100",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActiveLink(item.href)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="hidden md:inline-flex bg-gradient-to-r from-primary-purple to-primary-blue text-white hover:text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 group border-0"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}