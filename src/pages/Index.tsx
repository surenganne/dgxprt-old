import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { 
  Beaker, 
  FileText, 
  Shield, 
  BarChart3, 
  Building2, 
  AlertTriangle,
  ArrowRight
} from "lucide-react";

const Index = () => {
  const session = useSession();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Enhanced Hero Section */}
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
                
                {/* Added visual elements */}
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
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-purple/20 to-transparent" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-slate-50/30 dark:bg-slate-900/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comprehensive Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage chemicals safely and efficiently in one integrated platform.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Beaker}
                title="Chemical Inventory"
                description="Track and manage your chemical inventory with real-time updates and automated alerts."
              />
              <FeatureCard
                icon={FileText}
                title="SDS Management"
                description="Centralized storage and management of Safety Data Sheets with version control."
              />
              <FeatureCard
                icon={Shield}
                title="Risk Assessment"
                description="Comprehensive risk assessment tools with customizable templates and workflows."
              />
              <FeatureCard
                icon={BarChart3}
                title="Analytics & Reports"
                description="Generate detailed reports and gain insights with advanced analytics tools."
              />
              <FeatureCard
                icon={Building2}
                title="Location Management"
                description="Organize and track chemicals across multiple locations with hierarchical structure."
              />
              <FeatureCard
                icon={AlertTriangle}
                title="Compliance Tracking"
                description="Stay compliant with automated monitoring and regulatory requirement checks."
              />
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Solutions for Every Need</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tailored solutions for educational institutions of all sizes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-6 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold mb-3">For Administrators</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Centralized management dashboard</li>
                  <li>• User access control</li>
                  <li>• Compliance monitoring</li>
                  <li>• Custom reporting tools</li>
                </ul>
              </div>
              <div className="p-6 rounded-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold mb-3">For Lab Technicians</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Inventory tracking</li>
                  <li>• SDS access</li>
                  <li>• Risk assessment tools</li>
                  <li>• Waste management</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section id="compliance" className="py-20 bg-slate-50/30 dark:bg-slate-900/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Compliance Made Easy</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Stay compliant with regulatory requirements and maintain safety standards effortlessly.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-purple to-primary-blue flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Safety First</h3>
                <p className="text-muted-foreground">Ensure workplace safety with comprehensive risk management tools.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-purple to-primary-blue flex items-center justify-center">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Documentation</h3>
                <p className="text-muted-foreground">Keep all required documentation up-to-date and easily accessible.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-purple to-primary-blue flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Reporting</h3>
                <p className="text-muted-foreground">Generate compliance reports with just a few clicks.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
