export const LandingSolutions = () => {
  return (
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
  );
};