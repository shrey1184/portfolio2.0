"use client";

import { useState, useTransition, CSSProperties } from "react";
import { EditorToolbar } from "./editor-toolbar";
import { AdminHomeContent } from "./admin-home-content";
import type { Achievement, ExperienceItem, HomeSectionId, Project } from "@/types/domain";

interface VisualBuilderProps {
  initialProjects: Project[];
  initialAchievements: Achievement[];
  initialExperience: ExperienceItem[];
  initialSectionOrder: HomeSectionId[];
  initialThemeConfig: any;
}

export function VisualBuilder({
  initialProjects,
  initialAchievements,
  initialExperience,
  initialSectionOrder,
  initialThemeConfig,
}: VisualBuilderProps) {
  const [theme, setTheme] = useState(initialThemeConfig || {
    primary_color: "#c9a84c",
    secondary_color: "#0a0a0f",
    font_family: "Rajdhani, sans-serif"
  });

  const [sectionOrder, setSectionOrder] = useState<HomeSectionId[]>(initialSectionOrder);
  const [projects, setProjects] = useState(initialProjects);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [experience, setExperience] = useState(initialExperience);

  // Apply CSS variables inline. Ensure these have a fallback so they render properly.
  // Using same keys as globals.css.
  const style = {
    "--primary-color": theme.primary_color,
    "--secondary-color": theme.secondary_color,
    "--font-family": theme.font_family,
    "--glow-color": theme.primary_color,
  } as CSSProperties;

  return (
    <div style={style} className="relative min-h-screen bg-[var(--secondary-color)] font-[family-name:var(--font-family)] text-[#e2d5b0]">
      <EditorToolbar theme={theme} setTheme={setTheme} />

      <AdminHomeContent 
        projects={projects} setProjects={setProjects}
        achievements={achievements} setAchievements={setAchievements}
        experience={experience} setExperience={setExperience}
        sectionOrder={sectionOrder} setSectionOrder={setSectionOrder}
      />
    </div>
  );
}
