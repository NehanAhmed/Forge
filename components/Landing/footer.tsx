'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

import { Button } from '@/components/ui/button'; 
import { IconArrowRight, IconBrandGithubFilled, IconBrandLinkedinFilled, IconBrandTwitter, IconBrandTwitterFilled, IconCpu, IconTerminal } from '@tabler/icons-react';
// Assuming Button is at this path, adjust if necessary

// --- Configuration ---

const FOOTER_LINKS = [
  {
    title: "Product",
    items: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
      { label: "Roadmap", href: "/roadmap" },
    ]
  },
  {
    title: "Resources",
    items: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api" },
      { label: "Community", href: "/community" },
      { label: "Tech Stack Guide", href: "/stack-guide" },
    ]
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Security", href: "/security" },
    ]
  }
];

const DEV_QUOTES = [
  "System Status: Works on my machine",
  "Compiling... please wait",
  "0 Errors, 42 Warnings",
  "Pushing to production on Friday",
  "Removing legacy code...",
  "Forging the future",
];

// --- Components ---

const Footer = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Rotate through dev quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % DEV_QUOTES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 50 } 
    },
  };

  return (
    <footer className="w-full border-t border-border bg-background relative overflow-hidden font-hanken-grotesk">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 py-16">
        
        {/* Top Section: CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}font-
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
        >
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Ready to <span className="text-primary">Forge</span> your next idea?
            </h2>
            <p className="text-muted-foreground max-w-md">
              Turn vague concepts into structured technical plans in seconds.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/create">
              <Button size="lg" className="group">
                <IconTerminal className="mr-2 h-4 w-4" />
                Start Planning
                <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Middle Section: Links & Branding */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-12 gap-10 border-b border-border/50 pb-12"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-foreground">
              
              <span className="text-xl font-bold tracking-tight font-space-grotesk uppercase">Forge</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI-powered project planning for developers who want to stop bike-shedding and start shipping.
            </p>
            
            {/* Animated Status / Humor */}
            <div className="flex items-center gap-2 text-xs font-mono text-primary/80 bg-primary/5 w-fit px-3 py-1 rounded-full border border-primary/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {DEV_QUOTES[quoteIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Links Columns */}
          {FOOTER_LINKS.map((section, idx) => (
            <motion.div variants={itemVariants} key={idx} className="col-span-1 md:col-span-2">
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.items.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-0 overflow-hidden transition-all duration-300 group-hover:w-3 text-primary">
                        {'>'}
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          
          {/* Socials Column (uses remaining space on grid) */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-2 flex flex-col items-start md:items-end gap-4">
             <h3 className="font-semibold text-foreground mb-0 md:mb-4">Connect</h3>
             <div className="flex gap-2">
                <SocialButton icon={<IconBrandGithubFilled className="h-4 w-4" />} href="https://github.com" />
                <SocialButton icon={<IconBrandTwitterFilled className="h-4 w-4" />} href="https://twitter.com" />
                <SocialButton icon={<IconBrandLinkedinFilled className="h-4 w-4" />} href="https://linkedin.com" />
             </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Forge Inc.</span>
            <span className="hidden md:inline text-border">|</span>
            <span className="flex items-center gap-1">
              <IconCpu className="h-3 w-3" />
              v1.0.0
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/status" className="hover:text-foreground transition-colors flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              All Systems Nominal
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// Helper for Social Buttons to keep JSX clean
const SocialButton = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="h-9 w-9 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:-translate-y-1"
  >
    {icon}
  </a>
);

export default Footer;