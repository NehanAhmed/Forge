"use client";

import Carousel from "@/components/ui/carousel";
interface SlideData {
  id: string | number;
  title: string;
  description: string;
  src: string;
  ctaText: string;
  meta: {
    author: string;
    publishDate: string;
    category: string;
    readTime?: string;
  };
}

export function ProjectsShowcase() {
  const PROJECT_SLIDES: SlideData[] = [
    {
      id: 1,
      title: "SaaS CRM Platform",
      description:
        "Generate a complete production-ready CRM blueprint including system architecture, multi-tenant schema design, role-based access control, API contracts, scaling strategy, and deployment roadmap.",
      src: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=3200&auto=format&fit=crop",
      ctaText: "View Generated Plan",
      meta: {
        author: "Forge AI",
        publishDate: "Jan 2026",
        category: "Architecture",
        readTime: "4 min",
      },
    },
    {
      id: 2,
      title: "AI Resume Analyzer",
      description:
        "Design an end-to-end AI pipeline with document ingestion, embeddings, scoring logic, vector search, evaluation metrics, API architecture, and cloud deployment strategy.",
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=3200&auto=format&fit=crop",
      ctaText: "View Architecture",
      meta: {
        author: "Forge AI",
        publishDate: "Jan 2026",
        category: "AI Systems",
        readTime: "3 min",
      },
    },
    {
      id: 3,
      title: "Realtime Chat Application",
      description:
        "Plan a scalable realtime messaging system with WebSockets, event queues, message persistence, presence tracking, horizontal scaling, and fault tolerance patterns.",
      src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=3200&auto=format&fit=crop",
      ctaText: "View System Design",
      meta: {
        author: "Forge AI",
        publishDate: "Jan 2026",
        category: "System Design",
        readTime: "5 min",
      },
    },
    {
      id: 4,
      title: "E-Commerce Marketplace",
      description:
        "Generate a marketplace data model with orders, payments, inventory, multi-vendor flows, transactional integrity, indexing strategy, and reporting pipelines.",
      src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=3200&auto=format&fit=crop",
      ctaText: "View Database Schema",
      meta: {
        author: "Forge AI",
        publishDate: "Jan 2026",
        category: "Data Modeling",
        readTime: "4 min",
      },
    },
  ];

  return (
    <div className="relative overflow-hidden w-full h-full py-20">
      <Carousel slides={PROJECT_SLIDES} />
    </div>
  );
}
