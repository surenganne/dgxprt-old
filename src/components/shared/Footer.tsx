import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-50/30 backdrop-blur-xl dark:bg-background/50 dark:backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/dg-logo.png" alt="DGXPRT Logo" className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Modern chemical management system for educational institutions.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="#features" className="text-sm text-muted-foreground hover:text-primary-purple transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#solutions" className="text-sm text-muted-foreground hover:text-primary-purple transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link to="#compliance" className="text-sm text-muted-foreground hover:text-primary-purple transition-colors">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary-purple transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary-purple transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary-purple transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Connect</h3>
            <div className="mt-4 flex space-x-3">
              <Button variant="ghost" size="icon" className="hover:text-primary-purple">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary-purple">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary-purple">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} DGXPRT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}