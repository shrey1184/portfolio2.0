import { getAdminProjects, getAdminAchievements, getAdminExperience, getAdminLayoutSections, getAdminThemeConfig } from "@/lib/data/admin";
import { VisualBuilder } from "@/components/admin/visual-editor/visual-builder";
import type { HomeSectionId } from "@/types/domain";

export default async function AdminDashboardPage() {
  const [projects, achievements, experience, sectionOrderRaw, themeConfig] = await Promise.all([
    getAdminProjects(),
    getAdminAchievements(),
    getAdminExperience(),
    getAdminLayoutSections(),
    getAdminThemeConfig(),
  ]);

  const defaultOrder: HomeSectionId[] = ["hero", "projects", "achievements", "experience", "contact"];
  const sectionOrder = (sectionOrderRaw as HomeSectionId[]) || defaultOrder;

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
