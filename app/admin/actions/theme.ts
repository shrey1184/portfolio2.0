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
  const blobCount = parseInt(String(formData.get("blob_count") ?? "10"));
  const blobThickness = parseInt(String(formData.get("blob_thickness") ?? "1"));
  const blobSize = parseInt(String(formData.get("blob_size") ?? "80"));
  const blobColor = String(formData.get("blob_color") ?? "#FFFFFF").trim();
  const blobSpeed = parseInt(String(formData.get("blob_speed") ?? "4"));

  const achievementBorderColor = String(formData.get("achievement_border_color") ?? "#FFFFFF").trim();

  if (!isHexColor(primaryColor)) {
    throw new Error("Primary color must be a valid hex value.");
  }

  if (!isHexColor(secondaryColor)) {
    throw new Error("Secondary color must be a valid hex value.");
  }

  if (!isHexColor(tertiaryColor)) {
    throw new Error("Tertiary color must be a valid hex value.");
  }

  if (!isHexColor(achievementBorderColor)) {
    throw new Error("Achievement border color must be a valid hex value.");
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
    blob_count: isNaN(blobCount) ? 10 : blobCount,
    blob_thickness: isNaN(blobThickness) ? 1 : blobThickness,
    blob_size: isNaN(blobSize) ? 80 : blobSize,
    blob_color: blobColor,
    blob_speed: isNaN(blobSpeed) ? 4 : blobSpeed,
    achievement_border_color: achievementBorderColor,
  });

  if (error) {
    throw new Error(`Failed to save theme configuration: ${error.message}`);
  }

  revalidatePublicRoutes();
  revalidatePath("/admin/theme");
};
