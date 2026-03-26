import type { ReactNode } from "react";
import Link from "next/link";

import { AchievementList } from "@/components/public/achievement-list";
import { ExperienceList } from "@/components/public/experience-list";
import { ProjectGrid } from "@/components/public/project-grid";
import { SiteHeader } from "@/components/public/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { Achievement, ExperienceItem, HomeSectionId, Project } from "@/types/domain";

interface HomeContentProps {
  projects: Project[];
  achievements: Achievement[];
  experience: ExperienceItem[];
  sectionOrder: HomeSectionId[];
}

const HeroSection = () => (
  <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/75 p-8 shadow-sm backdrop-blur-sm sm:p-12">
    <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[color-mix(in_srgb,var(--primary-color)_30%,transparent)] blur-3xl" />
    <div className="absolute -bottom-20 left-16 h-44 w-44 rounded-full bg-[color-mix(in_srgb,var(--secondary-color)_25%,transparent)] blur-3xl" />

    <div className="relative z-10 max-w-3xl">
      <Badge className="mb-4" variant="secondary">
        Full-Stack Engineer
      </Badge>
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--secondary-color)] sm:text-5xl">
        Designing reliable products with clean architecture.
      </h1>
      <p className="mt-5 text-lg leading-8 text-slate-600">
        This portfolio is fully data-driven. Projects, achievements, experience, section order, and theme all come
        from the admin CMS.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/projects" className={buttonVariants()}>
          View Projects
        </Link>
        <Link href="/contact" className={buttonVariants({ variant: "outline" })}>
          Contact
        </Link>
      </div>
    </div>
  </section>
);

export const HomeContent = ({ projects, achievements, experience, sectionOrder }: HomeContentProps) => {
  const sections: Record<HomeSectionId, ReactNode> = {
    hero: <HeroSection />,
    projects: (
      <section className="space-y-6" id="projects">
        <h2 className="text-2xl font-semibold text-[var(--secondary-color)] sm:text-3xl">Projects</h2>
        <ProjectGrid projects={projects} />
      </section>
    ),
    achievements: (
      <section className="space-y-6" id="achievements">
        <h2 className="text-2xl font-semibold text-[var(--secondary-color)] sm:text-3xl">Achievements</h2>
        <AchievementList achievements={achievements} />
      </section>
    ),
    experience: (
      <section className="space-y-6" id="experience">
        <h2 className="text-2xl font-semibold text-[var(--secondary-color)] sm:text-3xl">Experience</h2>
        <ExperienceList items={experience} />
      </section>
    ),
    contact: (
      <section id="contact" className="rounded-2xl border border-white/70 bg-white/75 p-8 shadow-sm backdrop-blur-sm">
        <h2 className="text-2xl font-semibold text-[var(--secondary-color)] sm:text-3xl">Contact</h2>
        <p className="mt-4 max-w-2xl text-slate-600">
          For collaborations, consulting, or full-time opportunities, use the dedicated contact page.
        </p>
        <Link href="/contact" className={`${buttonVariants()} mt-6`}>
          Go To Contact Page
        </Link>
      </section>
    ),
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.18),_transparent_52%),_linear-gradient(to_bottom,_#f8fafc,_#eef2ff)] pb-20">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-10 sm:px-6 lg:px-8">
        {sectionOrder.map((sectionId) => (
          <div key={sectionId}>{sections[sectionId]}</div>
        ))}
      </main>
    </div>
  );
};
