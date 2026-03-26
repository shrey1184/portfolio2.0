import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const toSlugSafeFilename = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const parseListInput = (value: string) =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
