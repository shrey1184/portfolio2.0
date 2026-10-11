"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AchievementList } from "@/components/public/achievement-list";
import { ExperienceList } from "@/components/public/experience-list";
import { ProjectGrid } from "@/components/public/project-grid";
import { SiteHeader } from "@/components/public/site-header";
import type { Achievement, ExperienceItem, HomeSectionId, Project, ThemeConfig } from "@/types/domain";
import { BlobTracer } from "@/components/public/blob-tracer";
import { TechStack } from "@/components/public/tech-stack";
import Grainient from "@/components/public/Grainient";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Blackhole from "@/components/originkit/ui/blackhole";
import VectorWordmark from "@/components/originkit/ui/vector-wordmark";

interface HomeContentProps {
  projects: Project[];
  achievements: Achievement[];
  experience: ExperienceItem[];
  sectionOrder: HomeSectionId[];
  theme: ThemeConfig;
}

interface BlobConfig {
  count: number;
  thickness: number;
  size: number;
  color: string;
  filledColor: string;
  speed: number;
}

const IndustrialSection = ({ id, number, title, children, center = false, fullWidth = false }: { id: string; number: string; title: string; children: ReactNode; center?: boolean; fullWidth?: boolean }) => (
  <section id={id} className={`chrome-border-top ${center ? 'py-12 sm:py-16' : 'py-16 sm:py-20 lg:py-24'}`}>
    <div className={`grid grid-cols-1 ${center ? 'flex flex-col items-center gap-6' : 'gap-8 lg:grid-cols-12 lg:gap-12'} ${fullWidth ? 'w-full px-4 sm:px-6' : 'max-w-[1400px] mx-auto px-4 sm:px-6'}`}>
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

// --- Hero logo -------------------------------------------------------
// Replaces the text tagline with the SHREY logo mark. The logo is
// rendered as a CSS mask rather than an <img>, which is why its color
// is fully controllable below — no need to edit the SVG file itself.
// The file must sit at front/public/SHREY_logo.svg (served at
// /SHREY_logo.svg since Next.js serves /public from the site root).
const LOGO_COLOR = "var(--secondary)";

const HeroLogo = ({ layer }: { layer: "solid" | "glow" }) => (
  <div
    className="absolute inset-0 flex items-center justify-center pointer-events-none w-full overflow-hidden [--hero-logo-width:94vw] [--hero-logo-x:0] [--hero-logo-y:-27vh] sm:[--hero-logo-width:88vw] sm:[--hero-logo-x:0] sm:[--hero-logo-y:-34vh] lg:[--hero-logo-width:60vw] lg:[--hero-logo-x:-360px] lg:[--hero-logo-y:-39vh]"
    style={{ transform: "translate(var(--hero-logo-x), var(--hero-logo-y))" }}
  >
    {layer === "solid" ? (
      <div style={{ width: "var(--hero-logo-width)", aspectRatio: "1778 / 885" }}>
        <VectorWordmark
          src="/SHREY_logo.svg"
          aspect={1778 / 885}
          background="transparent"
          textColor="#F5F5F5"
          shade="#F5F5F5"
          accent="#F5F5F5"
          fade={0}
          reach={290}
          speed={50}
          damping={60}
          handles={{ labels: true }}
        />
      </div>
    ) : (
      <div
        style={{
          width: "var(--hero-logo-width)",
          aspectRatio: "1778 / 885",
          backgroundColor: LOGO_COLOR,
          WebkitMaskImage: "url('/SHREY_logo.svg')",
          maskImage: "url('/SHREY_logo.svg')",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          opacity: 0.55,
          filter: `drop-shadow(0 0 24px ${LOGO_COLOR})`,
        }}
      />
    )}
  </div>
);
const HeroSection = ({ videoUrl, imageUrl, blobs }: { videoUrl: string | null, imageUrl: string | null, opacity: number, grayscale: boolean, blobs: BlobConfig }) => {
  const [topPadding, setTopPadding] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = localStorage.getItem('heroTopPadding');
      if (saved) setTopPadding(parseInt(saved, 10));
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
  <section className="relative z-10 px-2 pb-2 pt-2 sm:px-4 sm:pb-4 sm:pt-4">
    <div className="flex flex-col justify-center relative overflow-hidden !rounded-[14px] sm:!rounded-[18px] lg:!rounded-[24px]" style={{ minHeight: `max(560px, calc(100svh - 96px - ${topPadding}px))`, marginTop: `${topPadding}px`, backgroundColor: 'var(--surface)', border: '0px solid var(--outline)' }}>
      {/* Background video and blobs */}
      <div className={`absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none ${videoUrl ? 'bg-black' : 'bg-secondary'}`}>
      {/* {videoUrl && (
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
      )} */}

              <Blackhole />

      <BlobTracer 
        count={blobs.count} 
        thickness={blobs.thickness} 
        size={blobs.size} 
        color={blobs.color} 
        filledColor={blobs.filledColor}
        speed={blobs.speed} 
      />
      {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--surface)] opacity-100" /> */}
      
    </div>

    {/* Frame Graphic Elements */}
    <div className="absolute inset-6 sm:inset-10 z-10 pointer-events-none border-[0.5px] border-[var(--outline)] opacity-30" />

    {/* Top Center Stars */}
    <div className="absolute top-8 sm:top-12 lg:top-16 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:gap-6 text-[var(--secondary)] z-20 opacity-80 text-sm sm:text-lg">
      <span>✦</span>
      <span>✦</span>
      <span>✦</span>
      <span>✦</span>

    </div>

    {/* Bottom Center Text */}
    <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:gap-8 text-[var(--secondary)] z-20 opacity-80">
      <span className="text-[9px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.4em] font-[family-name:var(--font-display)]">Constructed</span>
      <span className="text-sm">⊕</span>
      <span className="text-[9px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.4em] font-[family-name:var(--font-display)]">Systems</span>
    </div>

    {/* Top Left Corner */}
    {/* <div className="absolute top-16 left-16 z-20 w-[300px]">
      <LiquidMusicPlayer titleColor="var(--secondary)" artistColor="var(--outline)" trackColor="var(--surface)" timeColor="var(--outline)" tint="var(--primary)" buttonColor="var(--primary)" />
    </div> */}

    {/* Central Focus Area */}
    <div className="relative w-full h-[68svh] min-h-[430px] sm:h-[72svh] sm:min-h-[520px] lg:h-[75vh] lg:min-h-0 flex flex-col items-center justify-center z-10 mt-4 lg:mt-8">
      {/* 1. Underlying Solid Logo Layer */}
      <div className="absolute inset-0 z-[5]">
        <HeroLogo layer="solid" />
      </div>

      {/* 2. The Subject Image (Angel) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        {/* Using standard img with drop-shadow to separate it from the text */}
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="Subject" 
            className="h-[78svh] sm:h-[90svh] lg:h-[100vh] w-auto max-w-none scale-100 sm:scale-110 md:scale-125 origin-bottom object-contain object-bottom drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] filter brightness-90 contrast-125"
          />
        )}
      </div>

      {/* 3. Overlaying Glow Logo Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
         <HeroLogo layer="glow" />
      </div>

      {/* Initialize Button (bottom center above the text) */}
      <div className="absolute bottom-14 sm:bottom-10 z-30 flex flex-col items-center gap-6 pb-4">
        <Link
          href="#skills"
          className="chrome-button bg-[var(--surface)] border border-[var(--secondary)] text-[var(--secondary)] font-[family-name:var(--font-display)] font-bold text-[10px] sm:text-xs tracking-[0.22em] sm:tracking-[0.3em] uppercase px-7 sm:px-12 py-3 transition-industrial hover:bg-[var(--primary)] hover:text-[var(--surface)] backdrop-blur-sm"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Initialize
        </Link>
      </div>
    </div>
    </div>
  </section>
  );
};

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
            color1="#262525"
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
      <IndustrialSection id="achievements" number="04" title="Recognition" center={true} fullWidth={true}>
        <AchievementList 
          achievements={achievements} 
          borderColor={theme.achievement_border_color} 
        />
      </IndustrialSection>
    ),
    contact: (
      null 
    ),
    header: (
      <SiteHeader />
    ),
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--primary)] selection:bg-[var(--primary)] selection:text-[var(--surface)]">
      <main className="flex flex-col relative z-10">
        {sectionOrder.map((sectionId) => (
          <div key={sectionId}>{sections[sectionId]}</div>
        ))}
        {/* Animated Contact Block */}
        <section id="contact" className="relative bg-black text-white py-24 sm:py-32 md:py-64 min-h-[70vh] md:min-h-[80vh] flex flex-col items-center justify-center overflow-hidden border-t-[1px] border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
          
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0.3)_0%,transparent_60%)] pointer-events-none z-[0]" />
          
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col items-center z-10">
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
              className="font-[family-name:var(--font-display)] text-[clamp(2.8rem,14vw,5rem)] md:text-[clamp(4rem,10vw,12rem)] font-black uppercase leading-[0.88] md:leading-[0.85] tracking-tighter text-center flex flex-col items-center overflow-hidden max-w-full"
            >
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-8 overflow-hidden pb-4">
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 100, filter: "blur(10px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100, damping: 20 } }
                  }} 
                  className="text-white"
                >
                  LET&apos;S
                </motion.span>
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 100, filter: "blur(10px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100, damping: 20 } }
                  }} 
                  className="text-transparent" 
                  style={{ WebkitTextStroke: "clamp(1px, 0.18vw, 2px) rgba(255,255,255,0.4)" }}
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
              className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-12 sm:mt-24 pointer-events-auto"
            >
              {[
                { name: "Gmail", href: "mailto:shreyshrivastava11@gmail.com" },
                { name: "Twitter", href: "https://x.com/_Shrey_11" },
                { name: "LinkedIn", href: "https://linkedin.com/in/shrey1184" },
                { name: "GitHub", href: "https://github.com/shrey1184" },
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
                  className="font-[family-name:var(--font-body)] text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.18em] sm:tracking-[0.25em] uppercase px-5 sm:px-8 py-3 sm:py-4 border border-white/20 rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all duration-500 backdrop-blur-md bg-white/5"
                >
                  {link.name}
                </motion.a>
              ))}
            </motion.div>
          </div>
          
          <BackgroundBeams />
        </section>
      </main>
    </div>
  );
};
