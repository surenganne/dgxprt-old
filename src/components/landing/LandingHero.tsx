import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";
import { useSession } from "@supabase/auth-helpers-react";

export const LandingHero = () => {
  const navigate = useNavigate();
  const session = useSession();

  return (
    <section className="relative min-h-[80vh] flex items-center">
      <BackgroundEffects />
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-purple via-primary-blue to-primary-purple bg-300% animate-gradient">
                Modern Chemical
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-blue via-primary-purple to-primary-blue bg-300% animate-gradient animation-delay-2000">
                Management System
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Streamline your chemical inventory, safety, and compliance processes with our comprehensive management solution.
            </p>
            {!session && (
              <div className="flex justify-center items-center gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-primary-purple to-primary-blue text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            )}
            
            <div className="pt-12 flex justify-center gap-8 opacity-75">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-blue">
                  99.9%
                </div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-blue">
                  10K+
                </div>
                <div className="text-sm text-muted-foreground">Chemicals</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-blue">
                  24/7
                </div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-purple/20 to-transparent" />
    </section>
  );
};