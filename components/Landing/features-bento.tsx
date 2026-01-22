import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { IconClock, IconDatabase, IconGitFork, IconNetwork, IconProgress, IconShield } from "@tabler/icons-react";


export function ForgeFeaturesBento() {
  return (
    <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] -xl dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);

// Optional: Enhanced skeleton with gradient for better visual
const GradientSkeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] -xl dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
  </div>
);

const items = [
  {
    title: "AI-Powered Project Planning",
    description: "Transform vague ideas into structured plans with tech stack recommendations, database schemas, and development roadmaps in seconds.",
    header: <GradientSkeleton />,
    className: "md:col-span-2",
    icon: <IconProgress className="h-4 w-4 text-primary" />,
  },
  {
    title: "Smart Risk Detection",
    description: "Identify potential problems before you write a single line of code. Get severity ratings and mitigation strategies.",
    header: <Skeleton />,
    className: "md:col-span-1",
    icon: <IconShield className="h-4 w-4 text-primary" />,
  },
  {
    title: "Database Schema Generation",
    description: "Auto-generate optimized database schemas with relationships mapped out and best practices built in.",
    header: <Skeleton />,
    className: "md:col-span-1",
    icon: <IconDatabase className="h-4 w-4 text-primary" />,
  },
  {
    title: "Tech Stack Recommendations",
    description: "Get intelligent technology recommendations based on your requirements, team size, timeline, and budget constraints.",
    header: <GradientSkeleton />,
    className: "md:col-span-2",
    icon: <IconNetwork className="h-4 w-4 text-primary" />,
  },
  
];