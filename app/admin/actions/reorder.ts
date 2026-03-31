"use server";
import { persistReorder as internalReorder } from "./shared";
import type { Database } from "@/types/database";

export async function persistReorderAction(table: "projects" | "achievements" | "experience", ids: string[], idColumn: string = "id") {
  return await internalReorder(table, ids, idColumn as any);
}
