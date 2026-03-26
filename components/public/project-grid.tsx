import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types/domain";

interface ProjectGridProps {
  projects: Project[];
}

export const ProjectGrid = ({ projects }: ProjectGridProps) => {
  if (projects.length === 0) {
    return <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">No published projects yet.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="h-full overflow-hidden border-white/70 bg-white/90 backdrop-blur-sm">
          {project.image_url ? (
            <div className="relative h-44 w-full">
              <Image src={project.image_url} alt={project.title} fill className="object-cover" />
            </div>
          ) : null}
          <CardHeader>
            <CardTitle className="text-xl text-[var(--secondary-color)]">{project.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6 text-slate-600">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
