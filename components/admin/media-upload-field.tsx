"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MediaUploadFieldProps {
  name: string;
  folder: "projects" | "achievements" | "experience" | "theme";
  defaultValue?: string | null;
  accept?: string;
}

export const MediaUploadField = ({ 
  name, 
  folder, 
  defaultValue, 
  accept = "image/*,video/*" 
}: MediaUploadFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isVideo = value?.toLowerCase().endsWith(".mp4") || value?.toLowerCase().endsWith(".webm");

  const uploadFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Failed to upload media.");
      }

      setValue(payload.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={value} />

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) {
              void uploadFile(file);
            }
          }}
          className="block w-full max-w-xs cursor-pointer rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-xs text-white"
        />

        {value ? (
          <button
            type="button"
            onClick={() => setValue("")}
            className="rounded-md border border-slate-600 px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            Remove
          </button>
        ) : null}
      </div>

      {isUploading ? <p className="text-xs text-slate-400 animate-pulse">Uploading media...</p> : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}

      {value ? (
        <div className={cn("relative h-28 w-40 overflow-hidden rounded-lg border border-slate-700 bg-black/40")}> 
          {isVideo ? (
            <video src={value} className="h-full w-full object-cover" muted loop autoPlay playsInline />
          ) : (
            <Image src={value} alt="Uploaded preview" fill className="object-cover" />
          )}
        </div>
      ) : null}
    </div>
  );
};
