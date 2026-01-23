'use client'
import { ForgeFeaturesBento } from "./features-bento";
import { motion } from 'motion/react'
export function FeaturesSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden mt-40 ">

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="px-16  text-start mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="inline-flex items-center gap-2 px-3 py-1 -full bg-primary/10 border border-primary/20 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full -full bg-primary opacity-75"></span>
              <span className="relative inline-flex -full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">
              AI-Powered Planning
            </span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-primary via-destructive to-secondary bg-clip-text text-transparent">
              ship with confidence
            </span>
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-lg text-muted-foreground max-w-2xl  font-hanken-grotesk">
            Forge combines intelligent analysis with developer-focused tools
            to transform your project ideas into actionable plans.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{delay:0.4}}>

          <ForgeFeaturesBento />
        </motion.div>


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