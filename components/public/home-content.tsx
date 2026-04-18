"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AchievementList } from "@/components/public/achievement-list";
import { ExperienceList } from "@/components/public/experience-list";
import { ProjectGrid } from "@/components/public/project-grid";
import { SiteHeader } from "@/components/public/site-header";
import type { Achievement, ExperienceItem, HomeSectionId, Project } from "@/types/domain";
import { BlobTracer } from "@/components/public/blob-tracer";
import { TechStack } from "@/components/public/tech-stack";
import Grainient from "@/components/public/Grainient";

interface HomeContentProps {
  projects: Project[];
  achievements: Achievement[];
  experience: ExperienceItem[];
  sectionOrder: HomeSectionId[];
  theme: any;
}

const IndustrialSection = ({ id, number, title, children, center = false }: { id: string; number: string; title: string; children: ReactNode; center?: boolean }) => (
  <section id={id} className={`chrome-border-top ${center ? 'py-16' : 'py-24'}`}>
    <div className={`grid grid-cols-1 ${center ? 'flex flex-col items-center gap-6' : 'lg:grid-cols-12 gap-12'} max-w-[1400px] mx-auto px-6`}>
      <div className={center ? 'text-center' : 'lg:col-span-3'}>
        <p className="font-[family-name:var(--font-body)] text-xs font-semibold text-[var(--outline)] tracking-widest uppercase chrome-text-protect inline-block">
          {number} / {title}
        </p>
      </div>
      <div className={center ? 'w-full flex flex-col items-center' : 'lg:col-span-9'}>
        {children}
      </div>
    </div>
  </section>
);

const AnimatedRoleText = ({ layer }: { layer: 'solid' | 'outline' }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["AI DEVELOPER", "FULL STACK", "SYSTEM ENGINEER"];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none w-full overflow-hidden">
      {words.map((word, index) => (
        <h1 
          key={`${layer}-${word}`}
          className={`absolute text-5xl sm:text-7xl md:text-[8rem] lg:text-[11rem] font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.05em] whitespace-nowrap transition-all duration-1000 ${
            index === wordIndex ? "opacity-100 scale-100 filter-none" : "opacity-0 scale-110 blur-xl"
          } ${layer === 'solid' ? "text-[hidden]" : "text-transparent"}`}
          style={
            layer === 'solid' 
            ? { color: 'var(--primary)', opacity: index === wordIndex ? 1 : 0 }
            : { WebkitTextStroke: "1px var(--primary)", filter: "drop-shadow(0 0 20px rgba(var(--primary-rgb), 0.2))" }
          }
        >
          {word}
        </h1>
      ))}
    </div>
  );
};

const HeroSection = ({ videoUrl, imageUrl, opacity, grayscale, blobs }: { videoUrl: string | null, imageUrl: string | null, opacity: number, grayscale: boolean, blobs: any }) => (
  <section className="min-h-[100svh] flex flex-col justify-center relative z-10 pt-16 mt-[-64px] bg-[var(--surface)] overflow-hidden">
    {/* Background video and blobs */}
    <div className={`absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none ${videoUrl ? 'bg-black' : 'bg-secondary'}`}>
      {videoUrl && (
        <video 
          key={videoUrl}
          autoPlay 
          loop 
          muted 
          playsInline 
          crossOrigin="anonymous"
          style={{ opacity: opacity * 0.5 }}
          className={`w-full h-full object-cover mix-blend-screen ${grayscale ? 'grayscale' : ''}`}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      <BlobTracer 
        count={blobs.count} 
        thickness={blobs.thickness} 
        size={blobs.size} 
        color={blobs.color} 
        filledColor={blobs.filledColor}
        speed={blobs.speed} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--surface)] opacity-100" />
    </div>

    {/* Frame Graphic Elements */}
    <div className="absolute inset-6 sm:inset-10 z-10 pointer-events-none border-[0.5px] border-[var(--outline)] opacity-30" />

    {/* Top Center Stars */}
    <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[var(--primary)] z-20 opacity-80 text-lg">
      <span>✦</span>
      <span>✦</span>
      <span>✦</span>
    </div>

    {/* Bottom Center Text */}
    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[var(--primary)] z-20 opacity-80">
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-[family-name:var(--font-display)]">Constructed</span>
      <span className="text-sm">⊕</span>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-[family-name:var(--font-display)]">Systems</span>
    </div>

    {/* Top Left Corner */}
    <div className="absolute top-16 left-16 hidden lg:flex flex-col gap-2 max-w-[220px] z-20">
      <div className="text-[var(--primary)] text-xl mb-1">✧</div>
      <h3 className="text-[var(--primary)] font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase">CLOSE-UP</h3>
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[9px] leading-relaxed uppercase tracking-widest mt-1 opacity-70">
        Capture the raw intensity of code, the structured elegance of systems.
      </p>
    </div>

    {/* Top Right Corner */}
    <div className="absolute top-16 right-16 hidden lg:flex flex-col items-end text-right gap-2 max-w-[220px] z-20">
      <div className="text-[var(--primary)] text-xl mb-1">✧</div>
      <h3 className="text-[var(--primary)] font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase">MID-SHOT</h3>
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[9px] leading-relaxed uppercase tracking-widest mt-1 opacity-70">
        Frame the system against the backdrop of constraint, a vision of raw capacity.
      </p>
    </div>

    {/* Center Left Corner */}
    <div className="absolute top-1/2 -translate-y-1/2 left-16 hidden xl:flex flex-col gap-2 max-w-[200px] z-20">
      <div className="text-[var(--primary)] text-2xl mb-4">❋</div>
      <h3 className="text-[var(--primary)] font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase">VOID BOUND</h3>
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[9px] leading-relaxed uppercase tracking-widest mt-1 opacity-70">
        Born in logic, crowned in structure. The design is etched in terminal output.
      </p>
    </div>

    {/* Center Right Corner */}
    <div className="absolute top-1/2 -translate-y-1/2 right-16 hidden xl:flex flex-col items-end text-right gap-2 max-w-[200px] z-20">
      <div className="text-[var(--primary)] text-2xl mb-4">❋</div>
      <h3 className="text-[var(--primary)] font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase">DARK REIGN</h3>
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[9px] leading-relaxed uppercase tracking-widest mt-1 opacity-70">
        A network forged in fire, feared by all. Constraints of destiny cannot bind it.
      </p>
    </div>

    {/* Bottom Left Corner */}
    <div className="absolute bottom-16 left-16 hidden lg:flex flex-col gap-2 max-w-[280px] z-20">
      <div className="text-[var(--primary)] text-2xl mb-2 font-light">++</div>
      <h3 className="text-[var(--primary)] font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase">ARCHITECT</h3>
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[9px] leading-relaxed uppercase tracking-widest mt-1 opacity-70">
        She stands at the precipice of complexity, draped in the echoes of data and willed in the structuring of systems long forgotten.
      </p>
    </div>

    {/* Bottom Right Corner */}
    <div className="absolute bottom-16 right-16 hidden lg:flex flex-col items-end text-right gap-2 max-w-[280px] z-20">
      <div className="text-[var(--primary)] text-2xl mb-2 font-light">++</div>
      <h3 className="text-[var(--primary)] font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase">IRON LOGIC</h3>
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[9px] leading-relaxed uppercase tracking-widest mt-1 opacity-70">
        A system forged in logic, feared by entropy. Her presence alone bends the will of servers.
      </p>
    </div>

    {/* Central Focus Area */}
    <div className="relative w-full h-[75vh] flex flex-col items-center justify-center z-10 mt-8">
      {/* 1. Underlying Solid Text Layer */}
      <div className="absolute inset-0 z-[5]">
        <AnimatedRoleText layer="solid" />
      </div>

      {/* 2. The Subject Image (Angel) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        {/* Using standard img with drop-shadow to separate it from the text */}
        <img 
          src={imageUrl || "/angel1.png"} 
          alt="Subject" 
          className="h-[100vh] w-auto max-w-none scale-110 md:scale-125 origin-bottom object-contain object-bottom drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] filter brightness-90 contrast-125"
        />
      </div>

      {/* 3. Overlaying Outline Text Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
         <AnimatedRoleText layer="outline" />
      </div>

      {/* Initialize Button (bottom center above the text) */}
      <div className="absolute bottom-0 z-30 flex flex-col items-center gap-6 pb-4">
        <Link
          href="#skills"
          className="chrome-button bg-transparent border border-[var(--primary)] text-[var(--primary)] font-[family-name:var(--font-display)] font-bold text-xs tracking-[0.3em] uppercase px-12 py-3 transition-industrial hover:bg-[var(--primary)] hover:text-[var(--surface)] backdrop-blur-sm"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Initialize
        </Link>
      </div>
    </div>
    
    {/* Subtle gradient to mask bottom edge of image */}
    <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[var(--surface)] to-transparent z-20 pointer-events-none" />
  </section>
);

export const HomeContent = ({ projects, achievements, experience, sectionOrder, theme }: HomeContentProps) => {
  const sections: Record<HomeSectionId, ReactNode> = {
    hero: (
      <HeroSection 
        videoUrl={theme.hero_video_url} 
        imageUrl={theme.hero_image_url}
        opacity={theme.hero_video_opacity ?? 0.5} 
        grayscale={theme.hero_video_grayscale ?? true}
        blobs={{
          count: theme.blob_count ?? 10,
          thickness: theme.blob_thickness ?? 1,
          size: theme.blob_size ?? 80,
          color: theme.blob_color ?? "#FFFFFF",
          filledColor: theme.filled_blob_color ?? "#FFFFFF",
          speed: theme.blob_speed ?? 4
        }}
      />
    ),
    stack: (
      <TechStack />
    ),
    experience: (
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-[0] pointer-events-none w-full h-full">
          <Grainient
            color1="#040404"
            color2="#3a3a3a"
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
        <div className="relative z-[10] w-full">
          <IndustrialSection id="experience" number="02" title="Impact">
            <ExperienceList items={experience} />
          </IndustrialSection>
        </div>
      </div>
    ),
    projects: (
      <ProjectGrid projects={projects} theme={theme} />
    ),
    achievements: (
      <IndustrialSection id="achievements" number="04" title="Recognition" center={true}>
        <AchievementList 
          achievements={achievements} 
          borderColor={theme.achievement_border_color} 
        />
      </IndustrialSection>
    ),
    contact: (
      null 
    ),
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--primary)] selection:bg-[var(--primary)] selection:text-[var(--surface)]">
      <SiteHeader />
      <main className="flex flex-col relative z-10">
        {sectionOrder.map((sectionId) => (
          <div key={sectionId}>{sections[sectionId]}</div>
        ))}
        {/* Animated Contact Block */}
        <section id="contact" className="relative bg-[#050505] text-white py-32 md:py-64 min-h-[80vh] flex flex-col items-center justify-center overflow-hidden border-t-[1px] border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.3)_0%,transparent_60%)] pointer-events-none z-[0]" />
          
          <div className="w-full max-w-[1400px] mx-auto px-6 flex flex-col items-center z-10">
            <motion.h2 
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1, 
                  transition: { staggerChildren: 0.3, delayChildren: 0.1 } 
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="font-[family-name:var(--font-display)] text-[clamp(4rem,10vw,12rem)] font-black uppercase leading-[0.85] tracking-tighter text-center flex flex-col items-center overflow-hidden"
            >
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 overflow-hidden pb-4">
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 100, filter: "blur(10px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100, damping: 20 } }
                  }} 
                  className="text-white"
                >
                  LET'S
                </motion.span>
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 100, filter: "blur(10px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100, damping: 20 } }
                  }} 
                  className="text-transparent" 
                  style={{ WebkitTextStroke: "2px rgba(255,255,255,0.4)" }}
                >
                  BUILD
                </motion.span>
              </div>
              <div className="overflow-hidden pb-6 mt-[-1rem] md:mt-[-2rem]">
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 100, filter: "blur(10px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100, damping: 20 } }
                  }} 
                  className="text-white inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40"
                  style={{ WebkitTextFillColor: "transparent" }}
                >
                  TOGETHER
                </motion.span>
              </div>
            </motion.h2>

            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 1.2 } }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-16 sm:mt-24 pointer-events-auto"
            >
              {[
                { name: "Gmail", href: "mailto:youremail@gmail.com" },
                { name: "Twitter", href: "https://twitter.com/yourhandle" },
                { name: "LinkedIn", href: "https://linkedin.com/in/yourhandle" },
                { name: "GitHub", href: "https://github.com/yourhandle" },
              ].map((link) => (
                <motion.a
                  key={link.name}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-body)] text-xs md:text-sm font-bold tracking-[0.25em] uppercase px-8 py-4 border border-white/20 rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all duration-500 backdrop-blur-md bg-white/5"
                >
                  {link.name}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};
