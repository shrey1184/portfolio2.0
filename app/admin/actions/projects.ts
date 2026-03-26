"use server";

import { requireAdmin } from "@/lib/auth";

import {
  getBoolean,
  getInteger,
  getNextOrder,
  getOptionalString,
  getRequiredString,
  getTechStack,
  revalidateAdminAndPublic,
} from "@/app/admin/actions/shared";

export const createProjectAction = async (formData: FormData) => {
  const { supabase } = await requireAdmin();
  const order = await getNextOrder("projects");

  const { error } = await supabase.from("projects").insert({
    title: getRequiredString(formData, "title"),
    description: getRequiredString(formData, "description"),
    tech_stack: getTechStack(formData, "tech_stack"),
    image_url: getOptionalString(formData, "image_url"),
    is_published: getBoolean(formData, "is_published"),
    order,
  });

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }

  revalidateAdminAndPublic("/admin/projects");
};

export const updateProjectAction = async (formData: FormData) => {
  const { supabase } = await requireAdmin();
  const id = getRequiredString(formData, "id");

  const { error } = await supabase
    .from("projects")
    .update({
      title: getRequiredString(formData, "title"),
      description: getRequiredString(formData, "description"),
      tech_stack: getTechStack(formData, "tech_stack"),
      image_url: getOptionalString(formData, "image_url"),
      is_published: getBoolean(formData, "is_published"),
      order: getInteger(formData, "order"),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`);
  }

  revalidateAdminAndPublic("/admin/projects");
};

export const deleteProjectAction = async (formData: FormData) => {
  const { supabase } = await requireAdmin();
  const id = getRequiredString(formData, "id");

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }

  revalidateAdminAndPublic("/admin/projects");
};
