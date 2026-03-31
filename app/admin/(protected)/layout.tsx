import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdminPage } from "@/lib/auth";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  await requireAdminPage();

  return (
    <>
      <div id="admin-layout-root" className="min-h-screen bg-slate-950">
        {children}
      </div>
    </>
  );
}
