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

export const createExperienceAction = async (formData: FormData) => {
  const { supabase } = await requireAdmin();
  const order = await getNextOrder("experience");

  const { error } = await supabase.from("experience").insert({
    company: getRequiredString(formData, "company"),
    role: getRequiredString(formData, "role"),
    summary: getRequiredString(formData, "summary"),
    location: getRequiredString(formData, "location"),
    start_date: getRequiredString(formData, "start_date"),
    end_date: getOptionalString(formData, "end_date"),
    image_url: getOptionalString(formData, "image_url"),
    is_published: getBoolean(formData, "is_published"),
    order,
  });

  if (error) {
    throw new Error(`Failed to create experience: ${error.message}`);
  }

  revalidateAdminAndPublic("/admin/experience");
};

export const updateExperienceAction = async (formData: FormData) => {
  const { supabase } = await requireAdmin();
  const id = getRequiredString(formData, "id");

  const { error } = await supabase
    .from("experience")
    .update({
      company: getRequiredString(formData, "company"),
      role: getRequiredString(formData, "role"),
      summary: getRequiredString(formData, "summary"),
      location: getRequiredString(formData, "location"),
      start_date: getRequiredString(formData, "start_date"),
      end_date: getOptionalString(formData, "end_date"),
      image_url: getOptionalString(formData, "image_url"),
      is_published: getBoolean(formData, "is_published"),
      order: getInteger(formData, "order"),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update experience: ${error.message}`);
  }

  revalidateAdminAndPublic("/admin/experience");
};

export const deleteExperienceAction = async (formData: FormData) => {
  const { supabase } = await requireAdmin();
  const id = getRequiredString(formData, "id");

  const { error } = await supabase.from("experience").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete experience: ${error.message}`);
  }

  revalidateAdminAndPublic("/admin/experience");
};
