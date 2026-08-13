import { getAdminProjects, getAdminAchievements, getAdminExperience, getAdminLayoutSections, getAdminThemeConfig } from "@/lib/data/admin";
import { VisualBuilder } from "@/components/admin/visual-editor/visual-builder";
import type { HomeSectionId } from "@/types/domain";

import { HOMEPAGE_SECTIONS } from "@/types/domain";

export default async function AdminDashboardPage() {
  const [projects, achievements, experience, sectionOrderRaw, themeConfig] = await Promise.all([
    getAdminProjects(),
    getAdminAchievements(),
    getAdminExperience(),
    getAdminLayoutSections(),
    getAdminThemeConfig(),
  ]);

  // Normalize sections to ensure all required sections are present
  const normalizeSections = (value: unknown): HomeSectionId[] => {
    if (!Array.isArray(value)) return [...HOMEPAGE_SECTIONS];
    const sections = value.filter(
      (entry): entry is HomeSectionId =>
        typeof entry === "string" && HOMEPAGE_SECTIONS.includes(entry as HomeSectionId)
    );
    const unique = Array.from(new Set(sections));
    
    // Add any missing sections from HOMEPAGE_SECTIONS that aren't in the DB yet
    const missing = HOMEPAGE_SECTIONS.filter(s => !unique.includes(s));
    return [...unique, ...missing];
  };

  const sectionOrder = normalizeSections(sectionOrderRaw);

  return (
    <VisualBuilder
      initialProjects={projects}
      initialAchievements={achievements}
      initialExperience={experience}
      initialSectionOrder={sectionOrder}
      initialThemeConfig={themeConfig}
    />
  );
}
