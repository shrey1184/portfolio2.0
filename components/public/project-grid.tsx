import Image from "next/image";
import type { Project } from "@/types/domain";

interface ProjectGridProps {
  projects: Project[];
}

export const ProjectGrid = ({ projects }: ProjectGridProps) => {
  if (projects.length === 0) {
    return <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-xs uppercase tracking-widest font-bold">NO PROJECTS PROVISIONED.</p>;
  }

  return (
    <div className="flex flex-col gap-24">
      {projects.map((project, index) => {
        const isEven = index % 2 === 0;
        return (
          <div key={project.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            <div className={`relative h-64 md:h-96 w-full bg-[var(--surface-container-high)] chrome-surface ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
              {project.image_url ? (
                <Image src={project.image_url} alt={project.title} fill className="object-cover grayscale hover:grayscale-0 transition-industrial duration-700" />
              ) : null}
            </div>
            <div className={`flex flex-col justify-center ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="border-[var(--primary)] pb-4 mb-6">
                <h3 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold uppercase tracking-[0.02em] chrome-text-protect inline-block">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                  {project.tech_stack.map((tech) => (
                    <span key={tech} className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-widest uppercase text-[var(--outline)] before:content-['['] after:content-[']']">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed mb-10 max-w-md">
                {project.description}
              </p>
              <div className="w-full max-w-[8rem] chrome-divider mb-8" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
