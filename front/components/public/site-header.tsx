"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_LINKS = [
  { href: "#hero", id: "hero", label: "HOME" },
  { href: "#projects", id: "projects", label: "REPOSITORY" },
  { href: "#achievements", id: "achievements", label: "RECOGNITION" },
  { href: "#experience", id: "experience", label: "IMPACT" },
  { href: "#contact", id: "contact", label: "CONTACT" },
];

interface SiteHeaderProps {
  compact?: boolean;
}

export const SiteHeader = ({ compact = false }: SiteHeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();

    if (pathname !== "/") {
      // Not on the home page — navigate there, then scroll after it mounts
      router.push(`/#${sectionId}`);
      return;
    }

    if (sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`z-50 ${compact ? 'bg-transparent relative' : 'sticky top-0 bg-[var(--surface)]'} transition-industrial`}>
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] font-bold text-sm tracking-[0.05em] uppercase text-[var(--primary)]"
        >
          SHREY.DEV
        </Link>
        <nav className="flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = pathname === "/" && link.id === "hero"; // adjust active logic if you add scroll-spy later
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`font-[family-name:var(--font-body)] text-[11px] font-semibold tracking-widest uppercase transition-industrial hover:opacity-100 ${active ? "text-[var(--primary)] opacity-100 border-b-[3px] border-[var(--primary)] pb-1" : "text-[var(--outline)] opacity-80"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};