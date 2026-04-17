"use client";

import Image from "next/image";
import type { Project } from "@/types/domain";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import Grainient from './Grainient';

interface ProjectGridProps {
  projects: Project[];
}

export const ProjectGrid = ({ projects }: ProjectGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // The animation starts when the top of the container hits the top of the viewport.
    // It ends when the bottom of the container hits the bottom of the viewport.
    offset: ["start start", "end end"] 
  });

  if (projects.length === 0) {
    return (
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-xs uppercase tracking-widest font-bold">
        NO PROJECTS PROVISIONED.
      </p>
    );
  }

  // The total duration of the scroll "track". More projects = longer track.
  const scrollTrackHeight = `${projects.length * 100}vh`;

  return (
    <section id="projects" className="chrome-border-top py-0 relative w-full" ref={containerRef} style={{ height: scrollTrackHeight }}>
      {/* Sticky container completely freezes the text heading and background while we scroll down its height */}
      <div className="sticky top-0 w-full h-[100vh] flex flex-col items-center justify-center overflow-hidden py-16">
        
        <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
          <Grainient
            color1="#040404"
            color2="#0b0bdb"
            color3="#131213"
            timeSpeed={0.80}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>

        {/* Section Heading embedded inside the pinned sticky frame */}
        <div className="text-center mb-8 relative z-10">
          <p className="font-[family-name:var(--font-body)] text-xs font-semibold text-[var(--outline)] tracking-widest uppercase chrome-text-protect inline-block">
            03 / REPOSITORY
          </p>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto h-[450px] md:h-[550px] px-6">
          {projects.map((project, i) => {
            const total = projects.length;
            
            // Calculate progress thresholds based on number of cards
            const step = 1 / Math.max(1, total - 1);
            const startIn = (i - 1) * step;
            const endIn = i * step;

            // Slide in from 100% (below its bounding box) to 0%
            const y = useTransform(
              scrollYProgress, 
              [Math.max(0, startIn), endIn], 
              i === 0 ? ["0%", "0%"] : ["100%", "0%"]
            );

            // Scale down as newer cards pile on top
            const targetScale = 1 - (total - 1 - i) * 0.03;
            const scale = useTransform(
              scrollYProgress, 
              [endIn, 1], 
              [1, targetScale]
            );

            // Dim as newer cards pile on top
            const targetOpacity = (total - 1 - i) * 0.4;
            const dimOpacity = useTransform(
              scrollYProgress,
              [endIn, 1],
              [0, targetOpacity]
            );

            return (
              <motion.div
                key={project.id}
                className="absolute top-0 left-0 w-full transform-gpu"
                style={{
                  y, // Motion value driving vertical entrance
                  zIndex: i,
                  top: `${i * 25}px`, // Static offset determining the "lip" of the stack deck
                }}
              >
                {/* 
                  Inner container handles scaling independently from the Y translation 
                  transformOrigin ensures they scale up toward the top edge simulating a deck.
                */}
                <motion.div
                  style={{ scale, transformOrigin: 'top center' }}
                  className="relative w-full h-[400px] md:h-[500px] bg-white/5 backdrop-blur-2xl group overflow-hidden rounded-[40px] transform-gpu will-change-transform shadow-[0_-10px_35px_rgba(0,0,0,0.5)] border border-white/10"
                >
                  {/* Dynamic Dark Depth Shadow overlay mapping to scroll distance */}
                  <motion.div 
                    className="absolute inset-0 bg-black z-20 pointer-events-none"
                    style={{ opacity: dimOpacity }}
                  />

                  <div className="relative h-full w-full">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        quality={100}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none z-10" />

                    {/* Glassmorphed Content box */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none z-10">
                      <div 
                        className="bg-black/10 backdrop-blur-md border border-white/5 p-5 md:p-6 rounded-xl flex flex-col justify-end text-neutral-100 transform-gpu pointer-events-auto"
                        style={{ WebkitBackdropFilter: 'blur(12px)', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                      >
                        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-2 font-[family-name:var(--font-display)] transform-gpu" style={{ backfaceVisibility: 'hidden' }}>
                          {project.title}
                        </h3>
                        
                        {project.tech_stack && project.tech_stack.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3 transform-gpu" style={{ backfaceVisibility: 'hidden' }}>
                            {project.tech_stack.slice(0, 4).map((tech) => (
                              <span
                                key={tech}
                                className="text-[10px] pb-[1px] font-bold tracking-widest uppercase bg-white/5 px-2 py-1 rounded backdrop-blur-sm border border-white/5 font-[family-name:var(--font-body)]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-sm md:text-base text-neutral-300 line-clamp-2 md:line-clamp-3 font-[family-name:var(--font-body)] transform-gpu" style={{ backfaceVisibility: 'hidden' }}>
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Gradual surface fade at the bottom of the sticky frame to hide lower card edges seamlessly */}
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[var(--surface)] to-transparent z-[100] pointer-events-none" />
      </div>
    </section>
  );
};
