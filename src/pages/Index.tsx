import { Shield, BarChart3, AlertCircle, Database, FileText, PieChart, ClipboardCheck, ScrollText, Bell, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { SolutionCard } from "@/components/shared/SolutionCard";
import { BackgroundEffects } from "@/components/shared/BackgroundEffects";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark:bg-[#121212]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 overflow-hidden bg-gradient-to-b from-background to-background/50 dark:from-[#121212] dark:to-[#121212]/90">
        <BackgroundEffects />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary-purple via-primary-blue to-primary-purple animate-gradient leading-tight">
            Chemical Management
            <br />
            <span className="text-4xl md:text-5xl lg:text-6xl opacity-90">Simplified</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
            Comprehensive chemical inventory management, SDS tracking,
            and compliance monitoring in one secure platform.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary-purple to-primary-blue hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary-purple/20 dark:shadow-primary-purple/10 group text-lg px-8 py-6 rounded-xl transform hover:scale-105"
            >
              Start Free Trial
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary-purple/20 dark:border-primary-purple/30 hover:bg-primary-purple/5 dark:hover:bg-primary-purple/10 transition-all duration-300 text-lg px-8 py-6 rounded-xl transform hover:scale-105"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 px-4 bg-slate-50/50 backdrop-blur-xl border-y dark:border-white/5 dark:bg-[#1a1a1a]/90">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Shield}
            title="Compliance Ready"
            description="Stay compliant with automated tracking and reporting"
          />
          <FeatureCard
            icon={Database}
            title="Smart Inventory"
            description="Real-time tracking and automated alerts"
          />
          <FeatureCard
            icon={AlertCircle}
            title="Risk Management"
            description="Proactive risk assessment and mitigation"
          />
        </div>
      </section>

      {/* Comprehensive Features */}
      <section className="py-16 px-4 relative overflow-hidden dark:bg-[#121212]/90">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Chemical Management</h2>
          <p className="text-muted-foreground">
            Everything you need to manage chemicals safely and efficiently in one platform
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Database}
            title="Chemical Master List"
            description="Comprehensive database of chemicals with essential properties and classifications"
          />
          <FeatureCard
            icon={FileText}
            title="SDS Management"
            description="Centralized SDS repository with version control and automatic updates"
          />
          <FeatureCard
            icon={BarChart3}
            title="Inventory Tracking"
            description="Real-time inventory management with automatic alerts and reorder levels"
          />
          <FeatureCard
            icon={AlertCircle}
            title="Risk Assessment"
            description="Built-in risk assessment tools and compatibility checking"
          />
          <FeatureCard
            icon={ClipboardCheck}
            title="Compliance Monitoring"
            description="Automated compliance checks and regulatory requirement tracking"
          />
          <FeatureCard
            icon={PieChart}
            title="Analytics & Reports"
            description="Customizable dashboards and real-time reporting tools"
          />
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 px-4 bg-slate-50/50 backdrop-blur-xl border-y dark:border-white/5 dark:bg-[#1a1a1a]/90">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Solutions for Every Need</h2>
          <p className="text-muted-foreground">
            Tailored chemical management solutions for different industries and requirements
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <SolutionCard
            title="For Schools & Universities"
            features={[
              { text: "Lab inventory management" },
              { text: "Student safety protocols" },
              { text: "Waste disposal tracking" },
              { text: "Emergency response plans" },
            ]}
            ctaText="Contact for pricing"
            ctaLink="#contact"
          />
          <SolutionCard
            title="For Research Facilities"
            features={[
              { text: "Advanced chemical tracking" },
              { text: "Regulatory compliance" },
              { text: "Custom reporting tools" },
              { text: "Multi-lab management" },
            ]}
            ctaText="Get Started"
            ctaLink="#contact"
          />
          <SolutionCard
            title="For Industrial Use"
            features={[
              { text: "Large-scale inventory" },
              { text: "Supply chain integration" },
              { text: "Risk assessment tools" },
              { text: "Advanced compliance" },
            ]}
            ctaText="Get Started"
            ctaLink="#contact"
          />
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-16 px-4 relative overflow-hidden dark:bg-[#121212]/90">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Stay Compliant and Secure</h2>
          <p className="text-muted-foreground">
            Comprehensive compliance monitoring and risk management tools
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <FeatureCard
            icon={ScrollText}
            title="Regulatory Compliance"
            description="Automated compliance checks and updates for various regulatory requirements including OSHA, EPA, and more."
          />
          <FeatureCard
            icon={FileText}
            title="Documentation Management"
            description="Centralized storage for all safety documentation, permits, and compliance records with version control"
          />
          <FeatureCard
            icon={Bell}
            title="Alert System"
            description="Real-time notifications for compliance deadlines, permit renewals, and potential safety issues."
          />
          <FeatureCard
            icon={GraduationCap}
            title="User Training"
            description="Built-in training modules and documentation to ensure proper chemical handling and safety procedures"
          />
        </div>
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Schedule a Compliance Review
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
