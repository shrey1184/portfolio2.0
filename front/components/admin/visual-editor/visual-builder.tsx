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
    primary_color: "#000000",
    secondary_color: "#f9f9f9",
    font_family: "Space Grotesk, Inter, sans-serif"
  });

  const [sectionOrder, setSectionOrder] = useState<HomeSectionId[]>(initialSectionOrder);
  const [projects, setProjects] = useState(initialProjects);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [experience, setExperience] = useState(initialExperience);

  // Sync theme database variables to CSS root variables used by Industrial layout
  const style = {
    "--primary": theme.primary_color,
    "--surface": theme.secondary_color,
    "--outline": theme.tertiary_color || "#777777",
    "--font-display": theme.font_family,
    "--font-body": theme.font_family.includes(',') ? theme.font_family.split(',').pop()?.trim() : theme.font_family,
    "--hero-video-opacity": theme.hero_video_opacity ?? 0.5,
  } as CSSProperties & { [key: string]: any };

  return (
    <div style={style}>
      <EditorToolbar theme={theme} setTheme={setTheme} />
      {/* Wrapper exactly mimicking HomeContent wrapper logic for 1:1 sync */}
      <div className="min-h-screen bg-[var(--surface)] text-[var(--primary)] selection:bg-[var(--primary)] selection:text-[var(--surface)]">
        <AdminHomeContent 
          projects={projects} setProjects={setProjects}
          achievements={achievements} setAchievements={setAchievements}
          experience={experience} setExperience={setExperience}
          sectionOrder={sectionOrder} setSectionOrder={setSectionOrder}
          theme={theme}
        />
      </div>
    </div>
  );
}
