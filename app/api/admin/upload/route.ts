import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { getSupabasePublicEnv } from "@/lib/env";
import { toSlugSafeFilename } from "@/lib/utils";

const allowedFolders = ["projects", "achievements", "experience", "theme"] as const;

type AllowedFolder = (typeof allowedFolders)[number];

const isAllowedFolder = (value: string): value is AllowedFolder =>
  allowedFolders.includes(value as AllowedFolder);

export const runtime = "nodejs";

export const maxDuration = 60; // Allow 60 seconds for video uploads

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireAdmin();
    
    // Auth succeeded, proceed to consume body
    const formData = await request.formData();

    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A file is required." }, { status: 400 });
    }

    if (!isAllowedFolder(folder)) {
      return NextResponse.json({ error: "Invalid folder." }, { status: 400 });
    }

    const safeFilename = toSlugSafeFilename(file.name || "upload.mp4");
    const path = `${folder}/${user.id}/${Date.now()}-${safeFilename}`;

    const { storageBucket } = getSupabasePublicEnv();
    const { error: uploadError } = await supabase.storage.from(storageBucket).upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

    if (uploadError) {
      console.error("Storage Error:", uploadError.message);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(storageBucket).getPublicUrl(path);

    return NextResponse.json({ path, url: publicUrl });
  } catch (error) {
    console.error("Upload API Fault:", error);
    
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized (Admin Access Required)" }, { status: 401 });
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed unexpectedly",
      },
      { status: 500 },
    );
  }
}
