import Link from "next/link";

import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/achievements", label: "Achievements" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

interface SiteHeaderProps {
  compact?: boolean;
}

export const SiteHeader = ({ compact = false }: SiteHeaderProps) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-white/50 bg-white/90 backdrop-blur-md",
        compact && "static border-b-0 bg-transparent backdrop-blur-0",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--secondary-color)]">
          Portfolio
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium sm:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-700 transition-colors hover:text-[var(--primary-color)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
