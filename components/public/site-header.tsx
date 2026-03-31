"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  return (
    <header
      style={{
        position: compact ? "static" : "sticky",
        top: 0,
        zIndex: 50,
        background: compact
          ? "transparent"
          : "rgba(5, 5, 10, 0.82)",
        backdropFilter: compact ? "none" : "blur(18px)",
        WebkitBackdropFilter: compact ? "none" : "blur(18px)",
        borderBottom: compact ? "none" : "1px solid rgba(201,168,76,0.18)",
        boxShadow: compact ? "none" : "0 4px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "1.15rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#c9a84c",
            textDecoration: "none",
            textTransform: "uppercase",
            textShadow: "0 0 10px rgba(201,168,76,0.55), 0 0 24px rgba(201,168,76,0.3)",
            transition: "text-shadow 0.3s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.textShadow =
              "0 0 16px rgba(201,168,76,0.9), 0 0 40px rgba(201,168,76,0.5)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.textShadow =
              "0 0 10px rgba(201,168,76,0.55), 0 0 24px rgba(201,168,76,0.3)";
          }}
        >
          Portfolio
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: active ? "#e8c97a" : "rgba(226,213,176,0.55)",
                  textDecoration: "none",
                  padding: "6px 12px",
                  borderRadius: "3px",
                  position: "relative",
                  transition: "color 0.2s ease",
                  textShadow: active
                    ? "0 0 8px rgba(232,201,122,0.7)"
                    : "none",
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "#c9a84c";
                    (e.currentTarget as HTMLElement).style.textShadow = "0 0 8px rgba(201,168,76,0.6)";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.color = "rgba(226,213,176,0.55)";
                    (e.currentTarget as HTMLElement).style.textShadow = "none";
                  }
                }}
              >
                {link.label}
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "16px",
                      height: "2px",
                      background: "#c9a84c",
                      borderRadius: "1px",
                      boxShadow: "0 0 6px #c9a84c",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom gold accent line */}
      {!compact && (
        <div
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)",
          }}
        />
      )}
    </header>
  );
};

