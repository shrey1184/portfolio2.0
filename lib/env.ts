const requireEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const hasNonEmptyValue = (value: string | undefined) => Boolean(value?.trim());

export const hasSupabasePublicEnv = () =>
  hasNonEmptyValue(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  hasNonEmptyValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const getSupabasePublicEnv = () => ({
  url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  storageBucket: process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "portfolio-assets",
});

export const hasAdminEmailEnv = () => hasNonEmptyValue(process.env.ADMIN_EMAIL);

export const getAdminEmail = () => requireEnv("ADMIN_EMAIL").toLowerCase();

export const getContactEmail = () =>
  (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? process.env.ADMIN_EMAIL ?? "").trim();
