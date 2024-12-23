import { Shield, BarChart3, AlertCircle, Database, FileText, PieChart, ClipboardCheck, ScrollText, Bell, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/Header";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { SolutionCard } from "@/components/shared/SolutionCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-purple/10 px-4 py-1.5 rounded-full text-sm text-primary-purple mb-6">
            <span>New Features Available</span>
            <span>→</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-primary-blue">
            Chemical Management Simplified
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive chemical inventory management, SDS tracking,
            and compliance monitoring in one secure platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary-purple hover:bg-primary-purple/90">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 px-4 bg-slate-50">
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
      <section className="py-16 px-4">
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
      <section className="py-16 px-4 bg-slate-50">
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
      <section className="py-16 px-4">
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
    </div>
  );
};

export default Index;