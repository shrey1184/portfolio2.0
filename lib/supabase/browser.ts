"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

let cachedClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export const createSupabaseBrowserClient = () => {
  if (cachedClient) {
    return cachedClient;
  }

  const { url, anonKey } = getSupabasePublicEnv();

  cachedClient = createBrowserClient<Database>(url, anonKey);
  return cachedClient;
};
