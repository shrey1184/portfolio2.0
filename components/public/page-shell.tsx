import type { ReactNode } from "react";
import { SiteHeader } from "@/components/public/site-header";

interface PageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const PageShell = ({ title, description, children }: PageShellProps) => {
  return (
    <div className="min-h-screen chrome-bg bg-[var(--surface)] text-[var(--primary)] selection:bg-[var(--primary)] selection:text-[var(--surface)]">
      <SiteHeader />
      <main className="max-w-[1400px] mx-auto px-6 py-24 relative z-10">
        <section className="mb-24 chrome-border-bottom border-b-2 pb-12">
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-bold tracking-[0.02em] uppercase mb-6 chrome-text-protect inline-block">
            {title}
          </h1>
          <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed max-w-2xl text-[var(--outline)]">
            {description}
          </p>
        </section>
        {children}
      </main>
    </div>
  );
};

