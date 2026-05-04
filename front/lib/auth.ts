import "server-only";

import { redirect } from "next/navigation";

import { isAdminUser } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const requireAdmin = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isAdminUser(user.email)) {
    throw new Error("UNAUTHORIZED");
  }

  return { supabase, user };
};

export const requireAdminPage = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user.email)) {
    redirect("/admin/login");
  }

  return { supabase, user };
};
