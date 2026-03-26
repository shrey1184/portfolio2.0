"use server";

import { redirect } from "next/navigation";

import { isAdminUser } from "@/lib/admin";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const encodeError = (message: string) => encodeURIComponent(message);

export const loginAction = async (formData: FormData) => {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "").trim();
  const redirectTo = String(formData.get("redirectTo") ?? "/admin");

  if (!email || !password) {
    redirect("/admin/login?error=" + encodeError("Email and password are required."));
  }

  if (!isAdminUser(email)) {
    redirect("/admin/login?error=" + encodeError("This account is not allowed to access admin."));
  }

  if (!hasSupabasePublicEnv()) {
    redirect("/admin/login?error=" + encodeError("Supabase is not configured for this environment."));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=" + encodeError(error.message));
  }

  const safeRedirect = redirectTo.startsWith("/admin") ? redirectTo : "/admin";
  redirect(safeRedirect);
};

export const logoutAction = async () => {
  if (!hasSupabasePublicEnv()) {
    redirect("/admin/login");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
};
