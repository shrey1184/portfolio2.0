import type { Database } from "@/types/database";

export const HOMEPAGE_SECTIONS = [
  "hero",
  "stack",
  "projects",
  "achievements",
  "experience",
  "contact",
] as const;

export type HomeSectionId = (typeof HOMEPAGE_SECTIONS)[number];

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type ExperienceItem = Database["public"]["Tables"]["experience"]["Row"];
export type LayoutConfig = Database["public"]["Tables"]["layout_config"]["Row"];
export type ThemeConfig = Database["public"]["Tables"]["theme_config"]["Row"];

export interface DashboardStats {
  projectCount: number;
  achievementCount: number;
  experienceCount: number;
  draftCount: number;
}
