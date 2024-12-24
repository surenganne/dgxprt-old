import { FeatureCard } from "@/components/shared/FeatureCard";
import { Beaker, FileText, Shield, BarChart3, Building2, AlertTriangle } from "lucide-react";

export const LandingFeatures = () => {
  return (
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
  );
};