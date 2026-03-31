"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { AchievementList } from "@/components/public/achievement-list";
import { ExperienceList } from "@/components/public/experience-list";
import { ProjectGrid } from "@/components/public/project-grid";
import { SiteHeader } from "@/components/public/site-header";
import type { Achievement, ExperienceItem, HomeSectionId, Project } from "@/types/domain";

interface HomeContentProps {
  projects: Project[];
  achievements: Achievement[];
  experience: ExperienceItem[];
  sectionOrder: HomeSectionId[];
}

/* ─── Decorative divider ─── */
const GoldDivider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0 0" }}>
    <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, transparent, #c9a84c)" }} />
    <div style={{ width: "6px", height: "6px", background: "#c9a84c", transform: "rotate(45deg)", boxShadow: "0 0 8px #c9a84c" }} />
    <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, transparent, #c9a84c)" }} />
  </div>
);

/* ─── Section heading ─── */
const SectionHeading = ({ children }: { children: ReactNode }) => (
  <div style={{ marginBottom: "2rem" }}>
    <h2 style={{
      fontFamily: "'Cinzel', serif",
      fontSize: "clamp(1.4rem, 3vw, 2rem)",
      fontWeight: 700,
      color: "#c9a84c",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      textShadow: "0 0 10px rgba(201,168,76,0.5), 0 0 24px rgba(201,168,76,0.3)",
      margin: 0,
    }}>
      {children}
    </h2>
    <GoldDivider />
  </div>
);

/* ─── Glass card ─── */
const glassCard: React.CSSProperties = {
  background: "rgba(10,10,15,0.75)",
  border: "1px solid rgba(201,168,76,0.25)",
  borderRadius: "16px",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  padding: "2rem",
  position: "relative",
  overflow: "hidden",
};

/* ─── Hero Section ─── */
const HeroSection = () => (
  <section style={{ position: "relative", minHeight: "92vh", display: "flex", flexDirection: "column" }}>
    {/* Wallpaper */}
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "url('/new-bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center top",
      backgroundRepeat: "no-repeat",
    }} />

    {/* Dark vignette overlays */}
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(to bottom, rgba(5,5,10,0.45) 0%, rgba(5,5,10,0.65) 55%, rgba(5,5,10,0.97) 100%)",
    }} />
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at 70% 40%, rgba(201,168,76,0.07) 0%, transparent 60%)",
    }} />

    {/* Scanline shimmer */}
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
    }} />

    {/* Content */}
    <div style={{
      position: "relative", zIndex: 10,
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: "clamp(2rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)",
      maxWidth: "860px",
    }}>
      {/* Eyebrow */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "10px",
        marginBottom: "1.25rem",
        animation: "fadeIn 600ms ease-out both",
      }}>
        <div style={{ width: "28px", height: "1px", background: "#c9a84c", boxShadow: "0 0 6px #c9a84c" }} />
        <span style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.25em",
          color: "#c9a84c",
          textTransform: "uppercase",
          textShadow: "0 0 8px rgba(201,168,76,0.6)",
        }}>
          Full-Stack Engineer
        </span>
        <div style={{ width: "28px", height: "1px", background: "#c9a84c", boxShadow: "0 0 6px #c9a84c" }} />
      </div>

      {/* Main title */}
      <h1
        className="text-glow"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
          fontWeight: 900,
          lineHeight: 1.12,
          letterSpacing: "0.02em",
          color: "#e8c97a",
          margin: "0 0 1.5rem",
          animation: "fadeIn 700ms 100ms ease-out both",
        }}
      >
        Designing Reliable<br />
        <span style={{ color: "#fff", textShadow: "0 0 30px rgba(255,255,255,0.2)" }}>
          Products with Clean
        </span>
        <br />Architecture.
      </h1>

      {/* Sub text */}
      <p style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: "clamp(1rem, 2vw, 1.2rem)",
        fontWeight: 400,
        color: "rgba(226,213,176,0.75)",
        lineHeight: 1.7,
        maxWidth: "560px",
        margin: "0 0 2.5rem",
        animation: "fadeIn 700ms 200ms ease-out both",
      }}>
        This portfolio is fully data-driven — projects, achievements, experience,
        section order, and theme all flow from the admin CMS.
      </p>

      {/* CTA buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", animation: "fadeIn 700ms 350ms ease-out both" }}>
        <Link
          href="/projects"
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "14px 32px",
            background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
            color: "#0a0a0f",
            borderRadius: "4px",
            textDecoration: "none",
            boxShadow: "0 0 18px rgba(201,168,76,0.45), 0 4px 15px rgba(0,0,0,0.4)",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 32px rgba(201,168,76,0.8), 0 4px 20px rgba(0,0,0,0.5)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 18px rgba(201,168,76,0.45), 0 4px 15px rgba(0,0,0,0.4)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          View Projects
        </Link>
        <Link
          href="/contact"
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "13px 32px",
            background: "transparent",
            color: "#c9a84c",
            border: "1px solid rgba(201,168,76,0.5)",
            borderRadius: "4px",
            textDecoration: "none",
            boxShadow: "0 0 10px rgba(201,168,76,0.15)",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.1)";
            (e.currentTarget as HTMLElement).style.borderColor = "#c9a84c";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 18px rgba(201,168,76,0.35)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.5)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 10px rgba(201,168,76,0.15)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          Contact
        </Link>
      </div>
    </div>

    {/* Bottom fade into site bg */}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
      background: "linear-gradient(to bottom, transparent, #0a0a0f)" }} />
  </section>
);

/* ─── Main export ─── */
export const HomeContent = ({ projects, achievements, experience, sectionOrder }: HomeContentProps) => {
  const sections: Record<HomeSectionId, ReactNode> = {
    hero: <HeroSection />,

    projects: (
      <section id="projects" style={{ ...glassCard, marginTop: "4px" }} className="border-glow">
        <SectionHeading>Projects</SectionHeading>
        <ProjectGrid projects={projects} />
      </section>
    ),

    achievements: (
      <section id="achievements" style={glassCard} className="border-glow">
        <SectionHeading>Achievements</SectionHeading>
        <AchievementList achievements={achievements} />
      </section>
    ),

    experience: (
      <section id="experience" style={glassCard} className="border-glow">
        <SectionHeading>Experience</SectionHeading>
        <ExperienceList items={experience} />
      </section>
    ),

    contact: (
      <section id="contact" style={glassCard} className="border-glow">
        <SectionHeading>Contact</SectionHeading>
        <p style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "1.1rem",
          color: "rgba(226,213,176,0.75)",
          lineHeight: 1.7,
          maxWidth: "520px",
          marginBottom: "1.75rem",
        }}>
          For collaborations, consulting, or full-time opportunities, use the dedicated contact page.
        </p>
        <Link
          href="/contact"
          style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "13px 28px",
            background: "linear-gradient(135deg, #c9a84c, #e8c97a)",
            color: "#0a0a0f",
            borderRadius: "4px",
            textDecoration: "none",
            display: "inline-block",
            boxShadow: "0 0 14px rgba(201,168,76,0.4)",
          }}
        >
          Go To Contact Page
        </Link>
      </section>
    ),
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <SiteHeader />
      <main style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {sectionOrder.map((sectionId) =>
          sectionId === "hero" ? (
            <div key={sectionId}>{sections[sectionId]}</div>
          ) : (
            <div key={sectionId} style={{ maxWidth: "1152px", width: "100%", margin: "0 auto", padding: "0 1.5rem" }}>
              {sections[sectionId]}
            </div>
          )
        )}
      </main>
      <div style={{ height: "5rem" }} />
    </div>
  );
};
