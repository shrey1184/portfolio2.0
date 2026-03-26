import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  await requireAdminPage();

  return <AdminShell>{children}</AdminShell>;
}
