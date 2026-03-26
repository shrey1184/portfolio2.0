import { getAdminEmail, hasAdminEmailEnv } from "@/lib/env";

export const isAdminUser = (email: string | null | undefined) => {
  if (!email || !hasAdminEmailEnv()) {
    return false;
  }

  return email.toLowerCase() === getAdminEmail();
};
