"use client";

import React, { useMemo } from "react";
import type { Achievement } from "@/types/domain";

// NOTE: adjust this import to match how you actually export Cube from your
// originkit ui folder. If it's a default export, change to:
//   import Cube from "@/components/originkit/ui/cube";
import Cube from "@/components/originkit/ui/cube";
import AsciiBackground from "@/components/originkit/ui/AsciiBackground";

interface AchievementItem {
  id: string;
  title: string;
  description: string;
  issuer: string;
  year: string;
}

// Kept only as an empty-state fallback so the section never renders blank
// while data is loading — the left column always renders `achievements`
// from the database when it's available.
const HARDCODED_ACHIEVEMENTS: AchievementItem[] = [
  { id: "1",  title: "NASA Space Apps Challenge 2024",      description: "Won at the national level and advanced as a global nominee, competing against international teams to solve real-world space and Earth science problems.",  issuer: "NASA",             year: "2024" },
  { id: "2",  title: "TSATS 2025 – Finalist",               description: "Selected as a finalist in the Technical Symposium of Army Training Schools, demonstrating technical innovation in a highly competitive defense-oriented environment.", issuer: "Indian Army",      year: "2025" },
  { id: "3",  title: "Smart India Hackathon – Finalist",    description: "Reached the final stage of one of India's largest national hackathons by developing a scalable and impactful technical solution.",                          issuer: "SIH",              year: ""     },
  { id: "4",  title: "Mumbai Hacks 2025 – Finalist",        description: "Finalist competing among top developers and innovators to build high-impact solutions under time constraints.",                                              issuer: "Mumbai Hacks",     year: "2025" },
  { id: "5",  title: "CodeSlayer (NIT Delhi) – Top 10",     description: "Ranked among the top 10 teams in CodeSlayer hosted by NIT Delhi, showcasing strong algorithmic and development skills.",                                    issuer: "NIT Delhi",        year: ""     },
  { id: "6",  title: "EY Hackathon – Round 1 Qualified",    description: "Qualified the initial screening round of Ernst & Young hackathon, demonstrating strong problem-solving and business-technical alignment.",                   issuer: "Ernst & Young",    year: ""     },
  { id: "7",  title: "AWS AI for Bharat – Semi-Finalist",   description: "Advanced to the semi-final stage of the AWS AI for Bharat Hackathon, building AI-driven solutions focused on Indian use cases and scalability.",           issuer: "AWS",              year: ""     },
  { id: "8",  title: "Skill Climax – Finalist (Round 3)",   description: "Reached Round 3 (finalist stage) in the Skill Climax Hackathon, demonstrating consistency across multiple evaluation rounds.",                             issuer: "Skill Climax",     year: ""     },
  { id: "9",  title: "Invited Speaker – Delhi University",  description: "Invited to speak at the University of Delhi, recognizing expertise and contributions in technology and innovation.",                                        issuer: "Delhi University", year: ""     },
  { id: "10", title: "Youth Icon Award – OIST",             description: "Received the Youth Icon Award at Oriental Institute of Science and Technology for overall excellence in academics, leadership, and extracurricular impact.", issuer: "OIST",             year: ""     },
  { id: "11", title: "McKinsey Forward Program – Graduate", description: "Completed the McKinsey & Company Forward Program, gaining training in structured problem-solving, leadership, and business fundamentals.",                  issuer: "McKinsey & Company", year: ""   },
];

interface AchievementListProps {
  achievements?: Achievement[];
  borderColor?: string | null;

  // ── Cube controls (the "child variables" for size/position) ──────────
  /** Width/height of the cube's box. Number = px, or pass a CSS size string. */
  cubeSize?: number | string;
  /** Distance the sticky cube sits from the top of the viewport while pinned. */
  cubeTop?: string;
  /** Nudge the cube horizontally from its default centered spot in the right column. */
  cubeOffsetX?: string;
  /** Nudge the cube vertically. */
  cubeOffsetY?: string;
  /** Extra uniform scale applied on top of cubeSize. */
  cubeScale?: number;
  /** Extra className passed straight to the cube's wrapper div, for one-off tweaks. */
  cubeClassName?: string;

  // ── AsciiBackground controls ──────────────────────────────────────────
  /** RGB triplet string for the ascii characters, e.g. "0,0,0" for black on a white bg. */
  asciiColor?: string;
  /** How visible the ascii layer is on top of the white background, 0–1. */
  asciiOpacity?: number;
  /** Grid density — smaller values pack more characters in. */
  asciiCellWidth?: number;
  asciiCellHeight?: number;
  asciiFontSize?: number;
}

export const AchievementList = ({
  achievements = [],
  borderColor,
  cubeSize = 800,
  cubeTop = "18vh",
  cubeOffsetX = "0px",
  cubeOffsetY = "0px",
  cubeScale = 1,
  cubeClassName = "",
  asciiColor = "0,0,0",
  asciiOpacity = 0.4,
  asciiCellWidth = 6,
  asciiCellHeight = 11,
  asciiFontSize = 10,
}: AchievementListProps) => {
  const displayData: AchievementItem[] = useMemo(() => {
    if (achievements && achievements.length > 0) {
      return achievements.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description || "",
        issuer: a.issuer || "",
        year: a.achieved_at ? new Date(a.achieved_at).getFullYear().toString() : "",
      }));
    }
    return HARDCODED_ACHIEVEMENTS;
  }, [achievements]);

  const cubeBoxStyle: React.CSSProperties = {
    top: cubeTop,
    width: typeof cubeSize === "number" ? `${cubeSize}px` : cubeSize,
    height: typeof cubeSize === "number" ? `${cubeSize}px` : cubeSize,
    transform: `translate(${cubeOffsetX}, ${cubeOffsetY}) scale(${cubeScale})`,
  };

  return (
    <div
      className="ach-root relative w-full bg-[var(--surface,#ffffff)]"
      style={borderColor ? ({ "--outline": borderColor } as React.CSSProperties) : undefined}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

        :root {
          --card-border: rgba(0, 0, 0, 0.1);
          --text-primary: #0f172a;
          --text-muted:   #64748b;
          --text-dim:     #94a3b8;
        }

        .ach-root {
          font-family: 'Space Grotesk', sans-serif;
        }

        .ach-ascii-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .ach-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 48px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 100px 48px 140px;
        }

        /* ── Left: intro + scrolling list ── */
        .ach-left {
          display: flex;
          flex-direction: column;
        }

        .ach-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--outline);
          opacity: 0.85;
          margin-bottom: 14px;
        }

        .ach-heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.08;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }

        .ach-heading-accent {
          background: linear-gradient(135deg, var(--outline) 0%, var(--outline) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ach-subtext {
          font-size: 13px;
          color: var(--text-dim);
          max-width: 460px;
          line-height: 1.7;
          margin-bottom: 72px;
        }

        .ach-block {
          padding: 36px 0;
          border-top: 1px solid var(--card-border);
        }

        .ach-block:last-child {
          border-bottom: 1px solid var(--card-border);
        }

        .ach-index {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--outline);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .ach-block-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.75;
          max-width: 480px;
        }

        .ach-block-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
        }

        .ach-issuer {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-primary);
          opacity: 0.75;
        }

        .ach-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--outline);
          flex-shrink: 0;
        }

        .ach-year {
          font-size: 11px;
          color: var(--text-dim);
          font-weight: 500;
        }

        /* ── Right: sticky cube ── */
        .ach-right {
          position: relative;
        }

        .ach-cube-box {
          position: sticky;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .ach-grid {
            grid-template-columns: 1fr;
            padding: 64px 24px 96px;
          }

          .ach-right {
            order: -1;
            margin-bottom: 40px;
          }

          .ach-cube-box {
            position: static;
            transform: none !important;
            width: 260px !important;
            height: 260px !important;
          }
        }
      `}</style>

      <div className="ach-ascii-layer">
        <AsciiBackground
          color={asciiColor}
          maxOpacity={asciiOpacity}
          cellWidth={asciiCellWidth}
          cellHeight={asciiCellHeight}
          fontSize={asciiFontSize}
        />
      </div>

      <div className="ach-grid">
        {/* LEFT — intro + achievements pulled from the database */}
        <div className="ach-left">
          <p className="ach-eyebrow">Honors &amp; Awards</p>
          <h2 className="ach-heading">
            Recognition with <span className="ach-heading-accent">actual signal.</span>
          </h2>
          <p className="ach-subtext">
            Notable finishes and industry recognition — verified results across global, national, and technical domains.
          </p>

          {displayData.map((item, index) => (
            <div key={item.id} className="ach-block">
              <div className="ach-index">
                {String(index + 1).padStart(3, "0")} / {item.title}
              </div>
              {item.description && <p className="ach-block-desc">{item.description}</p>}
              {(item.issuer || item.year) && (
                <div className="ach-block-meta">
                  {item.issuer && <span className="ach-issuer">{item.issuer}</span>}
                  {item.issuer && item.year && <div className="ach-dot" />}
                  {item.year && <span className="ach-year">{item.year}</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT — cube stays pinned in view while the left column scrolls */}
        <div className="ach-right">
          <div className={`ach-cube-box ${cubeClassName}`} style={cubeBoxStyle}>
            <Cube />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementList;