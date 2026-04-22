"use client";

import React, { useMemo, useEffect, useRef, useState } from "react";

interface AchievementItem {
  id: string;
  title: string;
  description: string;
  issuer: string;
  year: string;
}

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

// Stable deterministic node positions arranged in a constellation
function buildNodePositions(count: number) {
  // Manually crafted positions (% of container) so nodes spread naturally
  const positions = [
    { x: 12, y: 18 }, { x: 38, y: 10 }, { x: 65, y: 15 }, { x: 88, y: 22 },
    { x: 22, y: 42 }, { x: 50, y: 38 }, { x: 78, y: 40 },
    { x: 10, y: 65 }, { x: 36, y: 68 }, { x: 62, y: 70 }, { x: 85, y: 62 },
  ];
  return positions.slice(0, count);
}

// Build edges – a spanning tree + a few extra connections for visual richness
function buildEdges(count: number): [number, number][] {
  const edges: [number, number][] = [];
  // Sequential chain
  for (let i = 0; i < count - 1; i++) edges.push([i, i + 1]);
  // Cross-links for richness
  const extras: [number, number][] = [
    [0, 4], [1, 5], [2, 6], [3, 6], [4, 7], [5, 8], [6, 9], [7, 8], [9, 10], [2, 5],
  ];
  extras.forEach(([a, b]) => { if (a < count && b < count) edges.push([a, b]); });
  return edges;
}

// Floating keyframes per node (small vertical + tiny horizontal drift)
function floatStyle(index: number) {
  const duration = 5 + (index * 1.3) % 5; // 5s–10s
  const delay    = -(index * 0.7) % 8;
  return { animation: `nodeFloat ${duration}s ease-in-out ${delay}s infinite` };
}

export const AchievementList = () => {
  const positions = useMemo(() => buildNodePositions(HARDCODED_ACHIEVEMENTS.length), []);
  const edges     = useMemo(() => buildEdges(HARDCODED_ACHIEVEMENTS.length), []);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // We need actual DOM positions for SVG lines, so we measure card centers
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const [cardCenters, setCardCenters] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const centers = cardRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return {
          x: r.left + r.width  / 2 - containerRect.left,
          y: r.top  + r.height / 2 - containerRect.top,
        };
      });
      setCardCenters(centers);
    };

    measure();
    window.addEventListener("resize", measure);
    // Re-measure after animations settle
    const t = setTimeout(measure, 600);
    return () => { window.removeEventListener("resize", measure); clearTimeout(t); };
  }, []);

  const hoveredIndex = hoveredId ? HARDCODED_ACHIEVEMENTS.findIndex(a => a.id === hoveredId) : -1;
  const connectedSet = useMemo(() => {
    if (hoveredIndex === -1) return new Set<number>();
    const s = new Set<number>();
    edges.forEach(([a, b]) => {
      if (a === hoveredIndex) s.add(b);
      if (b === hoveredIndex) s.add(a);
    });
    return s;
  }, [hoveredIndex, edges]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#030712]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Syne:wght@700;800&display=swap');

        :root {
          --blue-glow:   #3b82f6;
          --blue-soft:   #60a5fa;
          --blue-dim:    rgba(59,130,246,0.25);
          --card-bg:     rgba(10,16,30,0.85);
          --card-border: rgba(59,130,246,0.35);
          --card-hover:  rgba(59,130,246,0.65);
          --text-primary: #e2e8f0;
          --text-muted:   #64748b;
        }

          /* ── Noise texture overlay ── */
          .ach-root::before {
            content: "";
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
            opacity: 0.035;
            pointer-events: none;
            z-index: 0;
          }

          /* ── Dot-grid ── */
          .dot-grid {
            position: absolute;
            inset: 0;
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
            z-index: 0;
            pointer-events: none;
          }

          /* ── Radial mask for grid ── */
          .grid-mask {
            position: absolute;
            inset: 0;
            background-color: var(--surface, #000);
            mask-image: radial-gradient(ellipse at center, transparent 20%, black);
            -webkit-mask-image: radial-gradient(ellipse at center, transparent 20%, #000);
            z-index: 0;
            pointer-events: none;
          }

          /* ── Float animation ── */
        @keyframes nodeFloat {
          0%   { transform: translateY(0px)   translateX(0px); }
          33%  { transform: translateY(-9px)  translateX(3px); }
          66%  { transform: translateY(-4px)  translateX(-4px); }
          100% { transform: translateY(0px)   translateX(0px); }
        }

        /* ── Achievement card ── */
        .ach-card {
          position: absolute;
          transform: translate(-50%, -50%);
          font-family: 'Space Grotesk', sans-serif;
          z-index: 10;
        }

        .ach-btn {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 10px 16px;
          background: var(--card-bg);
          border: 1.5px solid var(--card-border);
          border-radius: 10px;
          cursor: pointer;
          backdrop-filter: blur(12px);
          box-shadow:
            0 0 0 0 transparent,
            0 4px 24px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.04);
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.2s, max-width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          min-width: 170px;
          max-width: 220px;
          text-align: left;
          position: relative;
        }

        .ach-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .ach-btn.is-hovered,
        .ach-btn:hover {
          max-width: 280px;
          z-index: 20;
        }

        .ach-btn:hover,
        .ach-btn.is-connected {
          border-color: var(--card-hover);
          box-shadow:
            0 0 18px rgba(59,130,246,0.35),
            0 0 40px rgba(59,130,246,0.12),
            0 4px 24px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.06);
          transform: translateY(-3px) scale(1.03);
        }

        .ach-btn.is-hovered {
          border-color: #60a5fa;
          box-shadow:
            0 0 24px rgba(96,165,250,0.55),
            0 0 60px rgba(59,130,246,0.2),
            0 4px 24px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.1);
          transform: translateY(-5px) scale(1.06);
          z-index: 20;
        }

        .ach-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--text-primary);
          white-space: normal;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ach-desc {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
          opacity: 0;
        }

        .ach-btn:hover .ach-desc,
        .ach-btn.is-hovered .ach-desc {
          grid-template-rows: 1fr;
          opacity: 1;
        }

        .ach-desc-inner {
          overflow: hidden;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 10px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-top: 6px;
        }

        .ach-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
        }

        .ach-issuer {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--blue-soft);
          opacity: 0.8;
        }

        .ach-year {
          font-size: 9px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .ach-dot {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--blue-dim);
          flex-shrink: 0;
        }

        /* ── SVG lines pulse ── */
        .edge-active {
          stroke: #3b82f6;
          stroke-opacity: 0.7;
          filter: drop-shadow(0 0 4px #3b82f6);
        }

        /* ── Header ── */
        .ach-header {
          font-family: 'Syne', sans-serif;
        }

        /* ── Scanline shimmer ── */
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200vh); }
        }
        .scanline {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(59,130,246,0.08), transparent);
          pointer-events: none;
          z-index: 1;
          animation: scanline 8s linear infinite;
        }
      `}</style>

      <div className="ach-root relative w-full min-h-screen bg-[var(--surface)] overflow-hidden">
        {/* Dot grid */}
        <div className="dot-grid" />
        <div className="grid-mask" />
        {/* Scanline */}
        <div className="scanline" />

        {/* Header */}
        <div className="relative z-10 text-center pt-16 pb-4 px-6">
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#3b82f6",
            marginBottom: "14px",
            opacity: 0.8,
          }}>
            Honors &amp; Awards
          </p>
          <h2 className="ach-header" style={{
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 800,
            color: "#e2e8f0",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "16px",
          }}>
            Recognition with{" "}
            <span style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>actual signal.</span>
          </h2>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "13px",
            color: "#475569",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            Notable finishes and industry recognition — verified results across global, national, and technical domains.
          </p>

          {/* Decorative divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            justifyContent: "center",
            marginTop: "24px",
          }}>
            <div style={{ width: "60px", height: "1px", background: "linear-gradient(to right, transparent, rgba(59,130,246,0.4))" }} />
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 8px #3b82f6" }} />
            <div style={{ width: "60px", height: "1px", background: "linear-gradient(to left, transparent, rgba(59,130,246,0.4))" }} />
          </div>
        </div>

        {/* Constellation container */}
        <div
          ref={containerRef}
          style={{
            position: "relative",
            width: "100%",
            height: "520px",
            marginTop: "20px",
          }}
        >
          {/* SVG lines layer */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 5,
              overflow: "visible",
            }}
          >
            <defs>
              <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#1d4ed8" stopOpacity="0.5" />
                <stop offset="50%"  stopColor="#3b82f6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.5" />
              </linearGradient>
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {cardCenters.length === HARDCODED_ACHIEVEMENTS.length &&
              edges.map(([a, b], i) => {
                const ca = cardCenters[a];
                const cb = cardCenters[b];
                const isActive =
                  hoveredIndex !== -1 &&
                  (a === hoveredIndex || b === hoveredIndex);

                return (
                  <line
                    key={i}
                    x1={ca.x} y1={ca.y}
                    x2={cb.x} y2={cb.y}
                    stroke={isActive ? "#60a5fa" : "url(#edgeGrad)"}
                    strokeWidth={isActive ? 1.5 : 0.8}
                    strokeOpacity={isActive ? 0.85 : 0.3}
                    filter={isActive ? "url(#lineGlow)" : undefined}
                    style={{ transition: "stroke-opacity 0.2s, stroke-width 0.2s" }}
                  />
                );
              })
            }
          </svg>

          {/* Cards */}
          {HARDCODED_ACHIEVEMENTS.map((item, index) => {
            const pos = positions[index];
            const isHovered   = hoveredId === item.id;
            const isConnected = connectedSet.has(index);

            return (
              <div
                key={item.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="ach-card"
                style={{
                  left: `${pos.x}%`,
                  top:  `${pos.y}%`,
                  ...floatStyle(index),
                }}
              >
                <div
                  className={`ach-btn${isHovered ? " is-hovered" : ""}${isConnected ? " is-connected" : ""}`}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="ach-label">{item.title}</div>
                  
                  <div className="ach-desc">
                    <div className="ach-desc-inner">
                      {item.description}
                    </div>
                  </div>

                  <div className="ach-meta">
                    {item.issuer && <span className="ach-issuer">{item.issuer}</span>}
                    {item.issuer && item.year && <div className="ach-dot" />}
                    {item.year   && <span className="ach-year">{item.year}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom fade */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "120px",
          background: "linear-gradient(to top, #030712, transparent)",
          pointerEvents: "none",
          zIndex: 15,
        }} />
      </div>
    </div>
  );
};

export default AchievementList;
