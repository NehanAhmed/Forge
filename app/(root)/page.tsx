import { FeaturesSection } from '@/components/Landing/features'
import Hero from '@/components/Landing/hero'
import { HowItWorks } from '@/components/Landing/how-it-works'
import ProjectDemo from '@/components/Landing/project-demo'
import { ProjectsShowcase } from '@/components/Landing/project-showcase'
import Testimonial from '@/components/Landing/testimonial'
import React from 'react'

const Page = () => {
  return (
    <main className="w-full min-h-screen font-hanken-grotesk">
      <Hero />
      <ProjectDemo />
      <FeaturesSection />
      <HowItWorks />
      <ProjectsShowcase />
      <Testimonial />
    </main>
  )
}

export default Page