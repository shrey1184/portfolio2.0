import type { ReactNode } from "react";

import { SiteHeader } from "@/components/public/site-header";

interface PageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const PageShell = ({ title, description, children }: PageShellProps) => {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <SiteHeader />
      <main style={{ maxWidth: "1152px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <section
          style={{
            marginBottom: "3rem",
            padding: "2rem 2.5rem",
            background: "rgba(10,10,15,0.75)",
            border: "1px solid rgba(201,168,76,0.25)",
            borderRadius: "16px",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Corner accent */}
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: "60px", height: "2px",
            background: "linear-gradient(to right, #c9a84c, transparent)",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: "2px", height: "60px",
            background: "linear-gradient(to bottom, #c9a84c, transparent)",
          }} />

          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(1.6rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "#c9a84c",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textShadow: "0 0 12px rgba(201,168,76,0.5), 0 0 28px rgba(201,168,76,0.3)",
              margin: "0 0 0.75rem",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "1.05rem",
              color: "rgba(226,213,176,0.65)",
              lineHeight: 1.7,
              maxWidth: "600px",
              margin: 0,
            }}
          >
            {description}
          </p>
        </section>
        {children}
      </main>
    </div>
  );
};

