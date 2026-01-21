"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconArrowLeft, IconArrowRight, IconArrowUpRight, IconCalendar, IconUser } from "@tabler/icons-react";
import { Button } from "./button";
import { Badge } from "./badge";
import Image from "next/image";


// ----------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------

interface SlideMetadata {
  author: string;
  publishDate: string;
  category: string;
  readTime?: string;
}

interface SlideData {
  id: string | number;
  title: string;
  description: string;
  src: string;
  ctaText: string;
  meta: SlideMetadata;
}

interface CarouselProps {
  slides: SlideData[];
  autoPlay?: boolean;
  interval?: number;
}



// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function ModernCarousel({
  slides,
  autoPlay = true,
  interval = 6000
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1 === slides.length ? 0 : prev + 1));
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 < 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Autoplay logic
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(handleNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, handleNext]);

  const slide = slides[current];

  // Animation Variants
  const slideVariants = {
    initial: { scale: 1.1, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1, opacity: 0 }
  };

  const textVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-background group">

      {/* 1. Background Image Layer */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={slide.id}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0"
          >
            {/* Image */}
            <Image
              width={1000}
              height={1000}
              src={slide.src}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Content Layout */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Text Content */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ staggerChildren: 0.1 }}
                className="space-y-6"
              >
                {/* Metadata Row */}
                <motion.div variants={textVariants} className="flex items-center gap-3">
                  <Badge>{slide.meta.category}</Badge>
                  <span className="flex items-center text-xs font-medium text-muted-foreground">
                    <IconCalendar className="w-3 h-3 mr-1" />
                    {slide.meta.publishDate}
                  </span>
                </motion.div>

                {/* Main Typography */}
                <motion.div variants={textVariants} className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-muted-foreground line-clamp-3 leading-relaxed">
                    {slide.description}
                  </p>
                </motion.div>

                {/* Author Info */}
                <motion.div variants={textVariants} className="flex items-center gap-3 py-2">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                    <IconUser className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">{slide.meta.author}</span>
                    <span className="text-xs text-muted-foreground">Editor in Chief</span>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div variants={textVariants} className="flex items-center gap-4 pt-4">
                  <Button variant="default">
                    {slide.ctaText}
                    <IconArrowUpRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Card / Secondary Visual (Optional Glass Card) */}
          <div className="hidden lg:block lg:col-span-7 relative h-full">
            {/* This space is intentionally left cleaner to show the image, 
                but we add a subtle glass card for additional context if needed
                or simply controls */}
          </div>
        </div>
      </div>

      {/* 3. Navigation Controls */}
      <div className="absolute bottom-8 left-0 right-0 px-6 max-w-7xl mx-auto flex items-center justify-between z-20">

        {/* Progress Indicators */}
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${current === idx
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handlePrev}>
            <IconArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="secondary" onClick={handleNext}>
            <IconArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}