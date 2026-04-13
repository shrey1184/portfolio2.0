"use server";

import { requireAdmin } from "@/lib/auth";
import { getSupabasePublicEnv } from "@/lib/env";
import { toSlugSafeFilename } from "@/lib/utils";


const allowedFolders = ["projects", "achievements", "experience", "theme"] as const;
type AllowedFolder = (typeof allowedFolders)[number];

const isAllowedFolder = (value: string): value is AllowedFolder =>
  allowedFolders.includes(value as AllowedFolder);

export async function uploadMediaAction(formData: FormData) {
  try {
    const { supabase, user } = await requireAdmin();

    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "").trim();

    if (!(file instanceof File)) {
      throw new Error("A file is required.");
    }

    if (!isAllowedFolder(folder)) {
      throw new Error("Invalid folder.");
    }

    const safeFilename = toSlugSafeFilename(file.name || "upload.mp4");
    const path = `${folder}/${user.id}/${Date.now()}-${safeFilename}`;

    const { storageBucket } = getSupabasePublicEnv();
    
    // Upload directly to Supabase Storage
    const { error: uploadError } = await supabase.storage.from(storageBucket).upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

    if (uploadError) {
      console.error("Storage Error:", uploadError.message);
      throw new Error(uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(storageBucket).getPublicUrl(path);

    return { success: true, url: publicUrl, path };
  } catch (error) {
    console.error("Upload Action Fault:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Upload failed unexpectedly" 
    };
  }
}
