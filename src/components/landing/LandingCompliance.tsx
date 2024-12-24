import { Shield, FileText, BarChart3 } from "lucide-react";

export const LandingCompliance = () => {
  return (
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
  );
};