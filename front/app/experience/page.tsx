import type { Metadata } from "next";

import { ExperienceList } from "@/components/public/experience-list";
import { PageShell } from "@/components/public/page-shell";
import { getPublishedExperience } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional experience entries managed through the admin CMS.",
};

export default async function ExperiencePage() {
  const experience = await getPublishedExperience();

  return (
    <PageShell
      title="Experience"
      description="Role history with timeline, summary, and supporting media from Supabase."
    >
      <ExperienceList items={experience} />
    </PageShell>
  );
}
