import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";

const Index = () => {
  const session = useSession();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="relative">
          <BackgroundEffects />
          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-blue">
                Modern Chemical Management System
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Streamline your chemical inventory, safety, and compliance processes with our comprehensive management solution.
              </p>
              {!session && (
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-primary-purple to-primary-blue text-white hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;