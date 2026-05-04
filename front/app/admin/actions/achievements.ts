"use server";

import { requireAdmin } from "@/lib/auth";

import {
  getBoolean,
  getInteger,
  getNextOrder,
  getOptionalString,
  getRequiredString,
  revalidateAdminAndPublic,
} from "@/app/admin/actions/shared";

export const createAchievementAction = async (formData: FormData) => {
  const { supabase } = await requireAdmin();
  const order = await getNextOrder("achievements");

  const { error } = await supabase.from("achievements").insert({
    title: getRequiredString(formData, "title"),
    description: getRequiredString(formData, "description"),
    issuer: getRequiredString(formData, "issuer"),
    achieved_at: getOptionalString(formData, "achieved_at"),
    image_url: getOptionalString(formData, "image_url"),
    is_published: getBoolean(formData, "is_published"),
    order,
  });

  if (error) {
    throw new Error(`Failed to create achievement: ${error.message}`);
  }

  revalidateAdminAndPublic("/admin/achievements");
};

export const updateAchievementAction = async (formData: FormData) => {
  const { supabase } = await requireAdmin();
  const id = getRequiredString(formData, "id");

  const { error } = await supabase
    .from("achievements")
    .update({
      title: getRequiredString(formData, "title"),
      description: getRequiredString(formData, "description"),
      issuer: getRequiredString(formData, "issuer"),
      achieved_at: getOptionalString(formData, "achieved_at"),
      image_url: getOptionalString(formData, "image_url"),
      is_published: getBoolean(formData, "is_published"),
      order: getInteger(formData, "order"),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update achievement: ${error.message}`);
  }

  revalidateAdminAndPublic("/admin/achievements");
};

export const deleteAchievementAction = async (formData: FormData) => {
  const { supabase } = await requireAdmin();
  const id = getRequiredString(formData, "id");

  const { error } = await supabase.from("achievements").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete achievement: ${error.message}`);
  }

  revalidateAdminAndPublic("/admin/achievements");
};
