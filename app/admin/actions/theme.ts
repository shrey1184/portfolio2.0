"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { revalidatePublicRoutes } from "@/lib/revalidate";

const isHexColor = (value: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);

export const updateThemeAction = async (formData: FormData) => {
  const { supabase } = await requireAdmin();

  const primaryColor = String(formData.get("primary_color") ?? "").trim();
  const secondaryColor = String(formData.get("secondary_color") ?? "").trim();
  const tertiaryColor = String(formData.get("tertiary_color") ?? "").trim();
  const fontFamily = String(formData.get("font_family") ?? "").trim();
  const heroVideoUrl = String(formData.get("hero_video_url") ?? "").trim() || null;
  const heroVideoOpacity = parseFloat(String(formData.get("hero_video_opacity") ?? "0.5"));

  if (!isHexColor(primaryColor)) {
    throw new Error("Primary color must be a valid hex value.");
  }

  if (!isHexColor(secondaryColor)) {
    throw new Error("Secondary color must be a valid hex value.");
  }

  if (!isHexColor(tertiaryColor)) {
    throw new Error("Tertiary color must be a valid hex value.");
  }

  if (!fontFamily) {
    throw new Error("Font family is required.");
  }

  const { error } = await supabase.from("theme_config").upsert({
    id: 1,
    primary_color: primaryColor,
    secondary_color: secondaryColor,
    tertiary_color: tertiaryColor,
    font_family: fontFamily,
    hero_video_url: heroVideoUrl,
    hero_video_opacity: isNaN(heroVideoOpacity) ? 0.5 : heroVideoOpacity,
  });

  if (error) {
    throw new Error(`Failed to save theme configuration: ${error.message}`);
  }

  revalidatePublicRoutes();
  revalidatePath("/admin/theme");
};
