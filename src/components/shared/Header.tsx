import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/dg-text-logo.png" alt="DGXPRT Logo" className="h-12 w-auto" />
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link to="#features" className="text-sm text-muted-foreground hover:text-primary-purple transition-colors">
              Features
            </Link>
            <Link to="#solutions" className="text-sm text-muted-foreground hover:text-primary-purple transition-colors">
              Solutions
            </Link>
            <Link to="#compliance" className="text-sm text-muted-foreground hover:text-primary-purple transition-colors">
              Compliance
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" className="hidden md:block">
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  );
}