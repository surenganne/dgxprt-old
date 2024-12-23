import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="w-full py-4 px-6">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/dg-logo.png" alt="DGXPRT Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-primary">DGXPRT</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="#features" className="text-sm text-muted-foreground hover:text-primary">Features</Link>
            <Link to="#solutions" className="text-sm text-muted-foreground hover:text-primary">Solutions</Link>
            <Link to="#compliance" className="text-sm text-muted-foreground hover:text-primary">Compliance</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button className="bg-primary-purple hover:bg-primary-purple/90" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}