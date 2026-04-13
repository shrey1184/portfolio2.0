"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { uploadMediaAction } from "@/app/admin/actions/upload";

interface ImageUploadFieldProps {
  name: string;
  folder: "projects" | "achievements" | "experience";
  defaultValue?: string | null;
}

export const ImageUploadField = ({ name, folder, defaultValue }: ImageUploadFieldProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", folder);

      const result = await uploadMediaAction(formData);

      if (!result.success || !result.url) {
        throw new Error(result.error ?? "Failed to upload image.");
      }

      setValue(result.url);
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
          accept="image/*"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file) {
              void uploadFile(file);
            }
          }}
          className="block w-full max-w-xs cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-600"
        />

        {value ? (
          <button
            type="button"
            onClick={() => setValue("")}
            className="rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-600 hover:bg-slate-100"
          >
            Remove
          </button>
        ) : null}
      </div>

      {isUploading ? <p className="text-xs text-slate-500">Uploading image...</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      {value ? (
        <div className={cn("relative h-28 w-40 overflow-hidden rounded-lg border border-slate-200")}> 
          <Image src={value} alt="Uploaded preview" fill className="object-cover" />
        </div>
      ) : null}
    </div>
  );
};
