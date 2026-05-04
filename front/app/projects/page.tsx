import type { Metadata } from "next";

import { PageShell } from "@/components/public/page-shell";
import { ProjectGrid } from "@/components/public/project-grid";
import { getPublishedProjects } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Projects",
  description: "Published projects from the portfolio CMS.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <PageShell
      title="Projects"
      description="A complete list of published work, maintained from the private CMS dashboard."
    >
      <ProjectGrid projects={projects} />
    </PageShell>
  );
}
