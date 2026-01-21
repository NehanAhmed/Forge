import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { IconClock, IconCodeCircle2, IconCodeCircle2Filled, IconDatabase, IconFileCheck, IconGitFork, IconShare2, IconShield, IconSparkles, IconSparkles2 } from "@tabler/icons-react";

export function HowItWorks() {
    const data = [
        {
            title: "Step 1: Describe",
            content: (
                <div>
                    <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        Tell us about your project idea. What problem are you solving? Who's your target audience? What's your timeline and budget?
                    </p>
                    <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        The more specific you are, the better our AI can tailor recommendations to your needs.
                    </p>

                    {/* Feature highlights */}
                    <div className="mb-8 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                <IconCodeCircle2 className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                                    Project requirements
                                </p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                    Define features, constraints, and technical requirements
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary/10">
                                <IconClock className="h-3.5 w-3.5 text-secondary" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                                    Timeline & budget
                                </p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                    Set realistic expectations for your project scope
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mock form preview */}
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-card">
                        <div className="mb-3 space-y-2">
                            <div className="h-2 w-32 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                            <div className="h-8 rounded-md border border-neutral-300 bg-white dark:border-white/10 dark:bg-background"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-40 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                            <div className="h-20 rounded-md border border-neutral-300 bg-white dark:border-white/10 dark:bg-background"></div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Step 2: AI Analysis",
            content: (
                <div>
                    <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        Our AI analyzes your requirements and generates a comprehensive project plan in seconds.
                    </p>
                    <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        Using battle-tested patterns and best practices from thousands of successful projects, we create a customized roadmap for your specific needs.
                    </p>

                    {/* Processing steps */}
                    <div className="mb-8 space-y-3">
                        <div className="flex items-center gap-3 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                <IconSparkles2 className="h-3 w-3" />
                            </div>
                            Analyzing project requirements
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                <IconDatabase className="h-3 w-3" />
                            </div>
                            Generating database schema
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                <IconShield className="h-3 w-3" />
                            </div>
                            Identifying potential risks
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                                <IconFileCheck className="h-3 w-3" />
                            </div>
                            Creating development roadmap
                        </div>
                    </div>

                    {/* Tech stack preview */}
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-card">
                        <div className="mb-3 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                            Recommended Tech Stack
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind', 'Docker', 'Vercel'].map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-xs font-medium text-primary"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Step 3: Review & Customize",
            content: (
                <div>
                    <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        Review your complete project plan with tech stack recommendations, database schema, risk analysis, and development timeline. Everything is organized in a clean, developer-focused interface.
                    </p>

                    {/* Plan sections */}
                    <div className="mb-8 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-white/10 dark:bg-card">
                            <div className="mb-2 flex items-center gap-2">
                                <IconDatabase className="h-4 w-4 text-primary" />
                                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                                    Database Schema
                                </span>
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Complete schema with relationships mapped
                            </p>
                        </div>

                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-white/10 dark:bg-card">
                            <div className="mb-2 flex items-center gap-2">
                                <IconShield className="h-4 w-4 text-destructive" />
                                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                                    Risk Analysis
                                </span>
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                12 risks identified with mitigation strategies
                            </p>
                        </div>

                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-white/10 dark:bg-card">
                            <div className="mb-2 flex items-center gap-2">
                                <IconClock className="h-4 w-4 text-secondary" />
                                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                                    Timeline
                                </span>
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                16 week roadmap broken into phases
                            </p>
                        </div>

                        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-white/10 dark:bg-card">
                            <div className="mb-2 flex items-center gap-2">
                                <IconCodeCircle2Filled className="h-4 w-4 text-primary" />
                                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                                    Tech Stack
                                </span>
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                Optimized for your requirements
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                        <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-primary/90">
                            Edit Plan
                        </button>
                        <button className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-all hover:bg-neutral-50 dark:border-white/10 dark:bg-card dark:text-neutral-200 dark:hover:bg-card/80">
                            Export
                        </button>
                    </div>
                </div>
            ),
        },
        {
            title: "Step 4: Share & Build",
            content: (
                <div>
                    <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        Share your project plan with your team, make it public for others to learn from, or fork existing plans to build on proven architectures.
                    </p>
                    <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
                        Every plan gets a unique URL that you can reference throughout development. Come back anytime to update your progress or adjust the roadmap.
                    </p>

                    {/* Sharing options */}
                    <div className="mb-8 space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                <IconShare2 className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                                    Public or private
                                </p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                    Share with the world or keep it for your eyes only
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary/10">
                                <IconGitFork className="h-3.5 w-3.5 text-secondary" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                                    Fork & customize
                                </p>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                    Build on top of existing plans from the community
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* URL preview */}
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-white/10 dark:bg-card">
                        <div className="mb-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                            Your project is live at:
                        </div>
                        <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 font-mono text-xs text-primary dark:bg-background">
                            <span>forge-rouge-delta.vercel.app/p/ecommerce</span>
                            <button className="ml-auto text-neutral-400 hover:text-primary">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <section className="relative w-full overflow-clip py-20 font-hanken-grotesk">
            

            {/* Timeline */}
            <Timeline data={data} />


        </section>
    );
}