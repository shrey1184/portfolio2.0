"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AchievementList } from "@/components/public/achievement-list";
import { ExperienceList } from "@/components/public/experience-list";
import { ProjectGrid } from "@/components/public/project-grid";
import { SiteHeader } from "@/components/public/site-header";
import type { Achievement, ExperienceItem, HomeSectionId, Project } from "@/types/domain";
import { BlobTracer } from "@/components/public/blob-tracer";
import { TechStack } from "@/components/public/tech-stack";

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

const HeroSection = ({ videoUrl, opacity, grayscale, blobs }: { videoUrl: string | null, opacity: number, grayscale: boolean, blobs: any }) => (
  <section className="min-h-[85vh] flex flex-col justify-center relative z-10 pt-16 mt-[-64px]">
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-black">
      {videoUrl && (
        <video 
          key={videoUrl}
          autoPlay 
          loop 
          muted 
          playsInline 
          crossOrigin="anonymous"
          style={{ opacity }}
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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[transparent] to-[var(--surface)] opacity-100" />
    </div>
    <div className="max-w-[1400px] mx-auto w-full px-6 flex flex-col h-full mt-auto relative z-10 pt-16">
      <div className="max-w-[1100px] mt-auto">
        <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-8xl leading-[0.9] tracking-[0.02em] font-bold uppercase mb-16 chrome-text-protect inline-block">
          Engineering<br />
          Systems that<br />
          Operate under<br />
          Real constraints.
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between chrome-border-top pt-4 pb-16 gap-6">
          <p className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-widest text-[var(--outline)] uppercase border-b border-[var(--outline)] border-dotted pb-1 w-max chrome-text-protect">
            01 . INFRASTRUCTURE . EXECUTION .
          </p>
          <Link
            href="/projects"
            className="chrome-button bg-[var(--primary)] text-[var(--surface)] font-[family-name:var(--font-display)] font-bold text-sm tracking-widest uppercase px-12 py-4 transition-industrial hover:opacity-80"
          >
            Enter
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export const HomeContent = ({ projects, achievements, experience, sectionOrder, theme }: HomeContentProps) => {
  const sections: Record<HomeSectionId, ReactNode> = {
    hero: (
      <HeroSection 
        videoUrl={theme.hero_video_url} 
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
      <IndustrialSection id="stack" number="01" title="Stack">
        <TechStack />
      </IndustrialSection>
    ),
    experience: (
      <IndustrialSection id="experience" number="02" title="Impact">
        <ExperienceList items={experience} />
      </IndustrialSection>
    ),
    projects: (
      <IndustrialSection id="projects" number="03" title="Repository">
        <ProjectGrid projects={projects} />
      </IndustrialSection>
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
        {/* Contact block added at the bottom as standard module */}
        <section className="bg-[var(--primary)] text-[var(--surface)] py-32 border-t-[12px] border-[var(--primary)] mt-12 chrome-surface">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1400px] mx-auto px-6">
            <div className="lg:col-span-8 chrome-border-bottom pb-12 mb-8">
              <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-bold uppercase leading-[1.1] mb-2 tracking-[0.02em] chrome-text-protect">
                Let's build systems<br />
                that matter.
              </h2>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end pb-20">
              <Link
                href="/contact"
                className="chrome-button inline-block border border-[var(--outline)] text-[var(--outline)] font-[family-name:var(--font-display)] font-bold text-xs tracking-widest uppercase px-8 py-3 w-max transition-industrial hover:bg-[var(--outline)] hover:text-[var(--primary)] mb-4"
              >
                Initiate Sequence
              </Link>
              <p className="font-[family-name:var(--font-body)] text-[10px] text-[var(--outline)] tracking-widest uppercase opacity-80">
                <span className="chrome-text-protect">A system optimized for latency is inherently robust.</span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
