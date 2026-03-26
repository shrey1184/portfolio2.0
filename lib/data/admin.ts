import "server-only";

import { requireAdmin } from "@/lib/auth";
import type { Achievement, DashboardStats, ExperienceItem, Project } from "@/types/domain";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { supabase } = await requireAdmin();

  const [projects, achievements, experience, draftProjects, draftAchievements, draftExperience] =
    await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("achievements").select("id", { count: "exact", head: true }),
      supabase.from("experience").select("id", { count: "exact", head: true }),
      supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_published", false),
      supabase.from("achievements").select("id", { count: "exact", head: true }).eq("is_published", false),
      supabase.from("experience").select("id", { count: "exact", head: true }).eq("is_published", false),
    ]);

  [projects, achievements, experience, draftProjects, draftAchievements, draftExperience].forEach((query, index) => {
    if (query.error) {
      const names = [
        "projects",
        "achievements",
        "experience",
        "draft projects",
        "draft achievements",
        "draft experience",
      ];
      throw new Error(`Failed to fetch ${names[index]} stats: ${query.error.message}`);
    }
  });

  return {
    projectCount: projects.count ?? 0,
    achievementCount: achievements.count ?? 0,
    experienceCount: experience.count ?? 0,
    draftCount: (draftProjects.count ?? 0) + (draftAchievements.count ?? 0) + (draftExperience.count ?? 0),
  };
};

export const getAdminProjects = async (): Promise<Project[]> => {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("projects").select("*").order("order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return data;
};

export const getAdminAchievements = async (): Promise<Achievement[]> => {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("achievements").select("*").order("order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch achievements: ${error.message}`);
  }

  return data;
};

export const getAdminExperience = async (): Promise<ExperienceItem[]> => {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("experience").select("*").order("order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch experience: ${error.message}`);
  }

  return data;
};

export const getAdminLayoutSections = async () => {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("layout_config")
    .select("sections")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch layout configuration: ${error.message}`);
  }

  return data?.sections;
};

export const getAdminThemeConfig = async () => {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("theme_config").select("*").eq("id", 1).maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch theme configuration: ${error.message}`);
  }

  return data;
};
