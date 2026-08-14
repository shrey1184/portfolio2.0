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
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24 relative z-10">
        <section className="mb-14 sm:mb-20 lg:mb-24 chrome-border-bottom border-b-2 pb-8 sm:pb-12">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.6rem,13vw,4.5rem)] lg:text-7xl font-bold tracking-[0.02em] uppercase mb-4 sm:mb-6 chrome-text-protect inline-block leading-[0.95] break-words">
            {title}
          </h1>
          <p className="font-[family-name:var(--font-body)] text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl text-[var(--outline)]">
            {description}
          </p>
        </section>
        {children}
      </main>
    </div>
  );
};
