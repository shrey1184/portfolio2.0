import "server-only";

import { HOMEPAGE_SECTIONS, type Achievement, type ExperienceItem, type HomeSectionId, type Project, type ThemeConfig } from "@/types/domain";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const parseSectionList = (value: unknown): HomeSectionId[] => {
  if (!Array.isArray(value)) {
    return [...HOMEPAGE_SECTIONS];
  }

  const sanitized = value.filter(
    (item): item is HomeSectionId =>
      typeof item === "string" && HOMEPAGE_SECTIONS.includes(item as HomeSectionId),
  );
  const unique = Array.from(new Set(sanitized));

  if (
    unique.length !== HOMEPAGE_SECTIONS.length ||
    !HOMEPAGE_SECTIONS.every((section) => unique.includes(section))
  ) {
    return [...HOMEPAGE_SECTIONS];
  }

  return unique;
};

export const getPublishedProjects = async (): Promise<Project[]> => {
  return withSupabaseFallback(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("order", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return data;
  }, []);
};

export const getPublishedAchievements = async (): Promise<Achievement[]> => {
  return withSupabaseFallback(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("is_published", true)
      .order("order", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch achievements: ${error.message}`);
    }

    return data;
  }, []);
};

export const getPublishedExperience = async (): Promise<ExperienceItem[]> => {
  return withSupabaseFallback(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .eq("is_published", true)
      .order("order", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch experience: ${error.message}`);
    }

    return data;
  }, []);
};

export const getHomepageSectionOrder = async (): Promise<HomeSectionId[]> => {
  return withSupabaseFallback(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("layout_config")
      .select("sections")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch layout config: ${error.message}`);
    }

    return parseSectionList(data?.sections);
  }, [...HOMEPAGE_SECTIONS]);
};

const FALLBACK_THEME: ThemeConfig = {
  id: 1,
  primary_color: "#0F766E",
  secondary_color: "#0F172A",
  tertiary_color: "#777777",
  font_family: "'Manrope', 'Segoe UI', sans-serif",
  hero_video_url: "/globe.mp4",  hero_image_url: null,  hero_video_opacity: 0.5,
  blob_count: 10,
  blob_thickness: 1,
  blob_size: 80,
  blob_color: "#FFFFFF",
  blob_speed: 4,
  hero_video_grayscale: false,
  filled_blob_color: "#FFFFFF",
  achievement_border_color: "#FFFFFF",
  project_video_grayscale: false,
  project_video_opacity: 0.3,
  project_video_brightness: 100,
  updated_at: new Date().toISOString(),
};

const withSupabaseFallback = async <T>(task: () => Promise<T>, fallback: T): Promise<T> => {
  if (!hasSupabasePublicEnv()) {
    return fallback;
  }

  try {
    return await task();
  } catch {
    return fallback;
  }
};

export const getThemeConfig = async (): Promise<ThemeConfig> => {
  return withSupabaseFallback(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("theme_config").select("*").eq("id", 1).maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch theme config: ${error.message}`);
    }

    return data ?? FALLBACK_THEME;
  }, FALLBACK_THEME);
};

export const getPublicPortfolioData = async () => {
  return withSupabaseFallback(async () => {
    const [projects, achievements, experience, sectionOrder, theme] = await Promise.all([
      getPublishedProjects(),
      getPublishedAchievements(),
      getPublishedExperience(),
      getHomepageSectionOrder(),
      getThemeConfig(),
    ]);

    return {
      projects,
      achievements,
      experience,
      sectionOrder,
      theme,
    };
  }, {
    projects: [] as Project[],
    achievements: [] as Achievement[],
    experience: [] as ExperienceItem[],
    sectionOrder: [...HOMEPAGE_SECTIONS],
    theme: FALLBACK_THEME,
  });
};

export const getPublicSummaryCounts = async () => {
  return withSupabaseFallback(async () => {
    const supabase = await createSupabaseServerClient();

    const [projects, achievements, experience] = await Promise.all([
      supabase.from("projects").select("id", { head: true, count: "exact" }).eq("is_published", true),
      supabase.from("achievements").select("id", { head: true, count: "exact" }).eq("is_published", true),
      supabase.from("experience").select("id", { head: true, count: "exact" }).eq("is_published", true),
    ]);

    if (projects.error || achievements.error || experience.error) {
      throw new Error("Failed to fetch public summary counts.");
    }

    return {
      projects: projects.count ?? 0,
      achievements: achievements.count ?? 0,
      experience: experience.count ?? 0,
    };
  }, {
    projects: 0,
    achievements: 0,
    experience: 0,
  });
};
