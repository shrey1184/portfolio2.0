import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { revalidatePublicRoutes } from "@/lib/revalidate";
import { parseListInput } from "@/lib/utils";
import type { Database } from "@/types/database";

type EditableTable = "projects" | "achievements" | "experience";

export const getRequiredString = (formData: FormData, key: string) => {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required field: ${key}`);
  }

  return value.trim();
};

export const getOptionalString = (formData: FormData, key: string) => {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const getBoolean = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
};

export const getInteger = (formData: FormData, key: string) => {
  const value = getRequiredString(formData, key);
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid integer field: ${key}`);
  }

  return parsed;
};

export const getTechStack = (formData: FormData, key: string) => {
  const value = getRequiredString(formData, key);
  return parseListInput(value);
};

export const getNextOrder = async (table: EditableTable) => {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from(table)
    .select("order")
    .order("order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read next order for ${table}: ${error.message}`);
  }

  return (data?.order ?? 0) + 1;
};

export const persistReorder = async (
  table: EditableTable,
  ids: string[],
  idColumn: keyof Database["public"]["Tables"][EditableTable]["Row"] = "id",
) => {
  const { supabase } = await requireAdmin();

  for (const [index, id] of ids.entries()) {
    const { error } = await supabase
      .from(table)
      .update({ order: index + 1 })
      .eq(idColumn as string, id);

    if (error) {
      throw new Error(`Failed to reorder ${table}: ${error.message}`);
    }
  }

  revalidatePublicRoutes();
};

export const revalidateAdminAndPublic = (adminPath: string) => {
  revalidatePublicRoutes();
  revalidatePath(adminPath);
};
