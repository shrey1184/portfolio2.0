import Link from "next/link";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/admin/sign-out-button";
import { logoutAction } from "@/app/admin/actions/auth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/layout-builder", label: "Layout Builder" },
  { href: "/admin/theme", label: "Theme" },
];

interface AdminShellProps {
  children: ReactNode;
}

export const AdminShell = ({ children }: AdminShellProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="text-base font-semibold tracking-wide text-white">
            Portfolio CMS
          </Link>
          <SignOutButton action={logoutAction} />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="rounded-xl border border-slate-800 bg-slate-900 p-3">
          <nav className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
};
