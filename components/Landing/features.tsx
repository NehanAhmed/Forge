import { ForgeFeaturesBento } from "./features-bento";

export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden mt-40">
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">
              AI-Powered Planning
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-primary via-destructive to-secondary bg-clip-text text-transparent">
              ship with confidence
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-hanken-grotesk">
            Forge combines intelligent analysis with developer-focused tools 
            to transform your project ideas into actionable plans.
          </p>
        </div>

        {/* Bento Grid */}
        <ForgeFeaturesBento />
        
     
      </div>
    </section>
  );
}

// Alternative: Minimal version without extras
export function FeaturesSectionMinimal() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Built for developers
          </h2>
          <p className="text-muted-foreground">
            Plan smarter, ship faster
          </p>
        </div>
        
        <ForgeFeaturesBento />
      </div>
    </section>
  );
}