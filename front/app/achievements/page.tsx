import type { Metadata } from "next";

import { AchievementList } from "@/components/public/achievement-list";
import { PageShell } from "@/components/public/page-shell";
import { getPublishedAchievements } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Published awards, certifications, and milestones.",
};

export default async function AchievementsPage() {
  const achievements = await getPublishedAchievements();

  return (
    <PageShell
      title="Achievements"
      description="Recognitions and milestones fetched in real time from Supabase."
    >
      <AchievementList achievements={achievements} />
    </PageShell>
  );
}
