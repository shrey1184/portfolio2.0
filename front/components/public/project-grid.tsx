"use client";

import Image from "next/image";
import type { Project } from "@/types/domain";
import React from "react";
import AsciiBackground from "../originkit/ui/AsciiBackground";

interface ProjectGridProps {
  projects: Project[];
  theme?: any;
}

export const ProjectGrid = ({ projects, theme }: ProjectGridProps) => {
  if (projects.length === 0) {
    return (
      <section id="projects" className="chrome-border-top py-16 w-full text-center bg-black">
        <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-xs uppercase tracking-widest font-bold">
          NO PROJECTS PROVISIONED.
        </p>
      </section>
    );
  }

  return (
    <section id="projects" className="chrome-border-top py-24 relative w-full bg-black overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        <AsciiBackground cellWidth={6} cellHeight={10} fontSize={10} maxOpacity={0.5} />
      </div>

      <div className="text-center mb-16 relative z-10">
        <p className="font-[family-name:var(--font-body)] text-xs font-semibold text-[var(--outline)] tracking-widest uppercase chrome-text-protect inline-block">
          03 / REPOSITORY
        </p>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="relative w-full h-[400px] md:h-[450px] bg-white/5 backdrop-blur-md group overflow-hidden rounded-[40px] shadow-[0_-10px_35px_rgba(0,0,0,0.5)] border border-white/10"
          >
            <div className="relative h-full w-full">
              {project.image_url ? (
                <div className="absolute inset-4 md:inset-8 overflow-hidden rounded-3xl">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    quality={100}
                    className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
              ) : null}

              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300 pointer-events-none z-10" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none z-10">
                <div
                  className="bg-black/10 backdrop-blur-md border border-white/5 p-5 md:p-6 rounded-xl flex flex-col justify-end text-neutral-100 pointer-events-auto"
                  style={{ WebkitBackdropFilter: 'blur(12px)' }}
                >
                  <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-2 font-[family-name:var(--font-display)]">
                    {project.title}
                  </h3>

                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
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

                  <p className="text-sm md:text-base text-neutral-300 line-clamp-2 md:line-clamp-3 font-[family-name:var(--font-body)]">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};