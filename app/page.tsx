import type { Metadata } from "next";

import { HomeContent } from "@/components/public/home-content";
import { getPublicPortfolioData } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Home",
  description: "Full-stack portfolio homepage powered by Supabase content.",
};

export default async function HomePage() {
  const data = await getPublicPortfolioData();

  return (
    <HomeContent
      projects={data.projects}
      achievements={data.achievements}
      experience={data.experience}
      sectionOrder={data.sectionOrder}
    />
  );
}
