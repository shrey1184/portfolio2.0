import type { ReactNode } from "react";

import { SiteHeader } from "@/components/public/site-header";

interface PageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const PageShell = ({ title, description, children }: PageShellProps) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.15),_transparent_55%),_linear-gradient(to_bottom,_#f8fafc,_#eef2ff)]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <section className="mb-12 rounded-2xl border border-white/60 bg-white/75 p-8 shadow-sm backdrop-blur-sm">
          <h1 className="text-3xl font-semibold text-[var(--secondary-color)] sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-slate-600">{description}</p>
        </section>
        {children}
      </main>
    </div>
  );
};
