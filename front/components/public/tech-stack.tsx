"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, useInView } from "framer-motion";
import { Layers, Globe, Code, Cpu, Sparkles } from "lucide-react";
import DitherReveal from "@/components/originkit/ui/dither-reveal-custom-style";

const skillsData = [
  {
    id: "01",
    category: "Artificial Intelligence",
    textColor: "text-blue-400",
    glowColor: "rgba(96, 165, 250, 0.15)",
    accentColor: "#60a5fa",
    items: [
      { name: "LangChain", angle: 15, radius: 140, depth: 20 },
      { name: "LangGraph", angle: 60, radius: 210, depth: 35 },
      { name: "Openclaw", angle: 110, radius: 150, depth: 15 },
      { name: "Claude Code", angle: 155, radius: 200, depth: 40 },
      { name: "CrewAI", angle: 205, radius: 140, depth: 25 },
      { name: "Hugging Face", angle: 250, radius: 230, depth: 45 },
      { name: "MCP", angle: 295, radius: 160, depth: 20 },
      { name: "RAG Systems", angle: 340, radius: 210, depth: 30 }
    ]
  },
  {
    id: "02",
    category: "Languages",
    textColor: "text-purple-400",
    glowColor: "rgba(192, 132, 252, 0.15)",
    accentColor: "#c084fc",
    items: [
      { name: "Python", angle: 35, radius: 150, depth: 20 },
      { name: "Java", angle: 105, radius: 220, depth: 40 },
      { name: "TypeScript", angle: 175, radius: 140, depth: 15 },
      { name: "JavaScript", angle: 245, radius: 200, depth: 30 },
      { name: "SQL", angle: 315, radius: 160, depth: 25 }
    ]
  },
  {
    id: "03",
    category: "Backend",
    textColor: "text-emerald-400",
    glowColor: "rgba(52, 211, 153, 0.15)",
    accentColor: "#34d399",
    items: [
      { name: "FastAPI", angle: 20, radius: 150, depth: 20 },
      { name: "Node.js", angle: 75, radius: 210, depth: 35 },
      { name: "PostgreSQL", angle: 130, radius: 160, depth: 25 },
      { name: "pgvector", angle: 180, radius: 230, depth: 45 },
      { name: "Redis", angle: 230, radius: 140, depth: 15 },
      { name: "Docker", angle: 285, radius: 200, depth: 30 },
      { name: "AWS", angle: 340, radius: 150, depth: 20 }
    ]
  },
  {
    id: "04",
    category: "Machine Learning",
    textColor: "text-amber-400",
    glowColor: "rgba(251, 191, 36, 0.15)",
    accentColor: "#fbbf24",
    items: [
      { name: "EDA", angle: 45, radius: 160, depth: 25 },
      { name: "Deep Learning", angle: 115, radius: 220, depth: 40 },
      { name: "Neural Network", angle: 185, radius: 150, depth: 20 },
      { name: "Supervised learning", angle: 255, radius: 210, depth: 35 },
      { name: "Computer vision", angle: 325, radius: 140, depth: 15 }
    ]
  }
];

const getIcon = (id: string, colorClass: string) => {
  switch (id) {
    case '01': return <Cpu className={`w-8 h-8 md:w-10 md:h-10 ${colorClass}`} />;
    case '02': return <Code className={`w-8 h-8 md:w-10 md:h-10 ${colorClass}`} />;
    case '03': return <Globe className={`w-8 h-8 md:w-10 md:h-10 ${colorClass}`} />;
    case '04': return <Layers className={`w-8 h-8 md:w-10 md:h-10 ${colorClass}`} />;
    default: return <Sparkles className={`w-8 h-8 md:w-10 md:h-10 ${colorClass}`} />;
  }
};

// ── Graph Radar Polygon ──
function RadarPolygon({ group, mx, my, multiplier, isInView }: any) {
  const points = useTransform(() => {
    const mxVal = mx.get();
    const myVal = my.get();

    // Sort objects by angle to ensure a correct polygon
    const sortedItems = [...group.items].sort((a: any, b: any) => a.angle - b.angle);

    return sortedItems.map((item: any) => {
      const angRad = (item.angle * Math.PI) / 180;
      const baseX = Math.cos(angRad) * item.radius * multiplier;
      const baseY = Math.sin(angRad) * item.radius * multiplier;

      const nx = baseX + (mxVal * item.depth * multiplier);
      const ny = baseY + (myVal * item.depth * multiplier);

      return `${nx},${ny}`;
    }).join(" ");
  });

  return (
    <>
      <motion.polygon
        points={points}
        fill="currentColor"
        className="opacity-70"
      />
      <motion.polygon
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        className="opacity-20"
      />
      {/* Dashed marching-ants stroke: only animates while the section is in view */}
      <motion.polygon
         points={points}
         fill="none"
         stroke="currentColor"
         strokeWidth={2}
         strokeDasharray="4 16"
         initial={{ strokeDashoffset: 0 }}
         animate={isInView ? { strokeDashoffset: 20 } : { strokeDashoffset: 0 }}
         transition={isInView ? { repeat: Infinity, duration: 2, ease: "linear" } : { duration: 0 }}
         className="opacity-40"
      />
    </>
  );
}

// ── Graph Satellite Node ──
function GraphNode({ item, i, mx, my, glow, multiplier, isInView }: any) {
  const angRad = (item.angle * Math.PI) / 180;
  const baseX = Math.cos(angRad) * item.radius * multiplier;
  const baseY = Math.sin(angRad) * item.radius * multiplier;

  const nx = useTransform(mx, (val: number) => baseX + (val * item.depth * multiplier));
  const ny = useTransform(my, (val: number) => baseY + (val * item.depth * multiplier));

  return (
    <motion.div style={{ x: nx, y: ny }} className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-10">
      <motion.div
         initial={{ opacity: 0, scale: 0 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 0 }}
         transition={{ delay: i * 0.05, type: "spring", bounce: 0.4, duration: 0.6 }}
         className="relative group cursor-pointer"
      >
        {/* Vertical bob: only animates while the section is in view */}
        <motion.div
           animate={isInView ? { y: [-3, 3, -3] } : { y: 0 }}
           transition={isInView ? { duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
           className="relative"
        >
           <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" style={{ backgroundColor: glow }} />

           <div className="flex items-center gap-3 px-5 md:px-6 py-2 md:py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl group-hover:border-white/30 transition-colors shadow-2xl">
             <span className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]" style={{ backgroundColor: glow, color: glow }} />
             <span className="font-mono text-[12px] md:text-[14px] text-black/70 group-hover:text-black tracking-wider uppercase whitespace-nowrap">
                {item.name}
             </span>
           </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Graph Central Core ──
function CoreNode({ mx, my, group, isInView }: any) {
  const cx = useTransform(mx, [-1, 1], [-15, 15]);
  const cy = useTransform(my, [-1, 1], [-15, 15]);

  return (
    <motion.div style={{ x: cx, y: cy }} className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-20">
      {/* Vertical bob: only animates while the section is in view */}
      <motion.div
        animate={isInView ? { y: [-4, 4, -4] } : { y: 0 }}
        transition={isInView ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full blur-3xl opacity-40" style={{ backgroundColor: group.accentColor }} />

        <div className="flex flex-col items-center justify-center w-20 h-20 md:w-28 md:h-28 bg-[#0A0A0A]/90 border border-white/20 rounded-full backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
           <div className="mb-1">{getIcon(group.id, group.textColor)}</div>
           <span className="font-mono text-[8px] md:text-[10px] text-black/40 tracking-widest uppercase">Stack</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Complete Unified Network Layer ──
function NetworkGraph({ group, mx, my, multiplier, isActive = true, isInView }: any) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${isActive ? 'z-20 opacity-100' : 'z-10 opacity-60'}`}>
      <svg width="2000" height="2000" viewBox="0 0 2000 2000" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible z-0">
        <g transform="translate(1000, 1000)" className={isActive ? group.textColor : 'text-black/40'}>
           <RadarPolygon group={group} mx={mx} my={my} multiplier={multiplier} isInView={isInView} />
        </g>
      </svg>

      {isActive && (
        <div className="absolute top-1/2 left-1/2 w-0 h-0 z-10 pointer-events-auto origin-center">
          {group.items.map((item: any, i: number) => (
             <GraphNode key={`${group.id}-node-${i}`} item={item} i={i} mx={mx} my={my} glow={group.accentColor} multiplier={multiplier} isInView={isInView} />
          ))}
          <CoreNode mx={mx} my={my} group={group} isInView={isInView} />
        </div>
      )}
    </div>
  );
}

// ── Main Layout View ──
export const TechStack = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [radiusMultiplier, setRadiusMultiplier] = useState(1);

  // Gate all infinite loops (radar dash, node bob, core bob) on real visibility.
  // margin extends the trigger area slightly so animations warm up just before
  // the section enters the viewport rather than popping in.
  const isInView = useInView(sectionRef, { margin: "200px 0px 200px 0px" });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smoothMx = useSpring(mx, { stiffness: 40, damping: 15 });
  const smoothMy = useSpring(my, { stiffness: 40, damping: 15 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setRadiusMultiplier(0.45);
      else if (window.innerWidth < 1024) setRadiusMultiplier(0.7);
      else setRadiusMultiplier(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mx.set(x);
    my.set(y);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    // Removed px-4 pb-4 pt-4 from <section> so there's no gap between the
    // page edge and this section on left, right, top, or bottom.
    <section id="skills" ref={sectionRef} className="relative z-20 w-full">
      <div
        // Removed py-24 md:py-32 from this outer rounded box so it has
        // zero internal padding on all sides too (top/bottom/left/right).
        className="relative !rounded-[24px] overflow-hidden min-h-[50vh] flex flex-col justify-center border border-white/10 shadow-2xl"
      >

        {/* ============================================================
            NEW COMPONENT: DitherReveal (originkit/ui/dither-reveal-custom-style)
            Placed as the first child inside this div, absolutely positioned
            to fill the whole rounded box edge-to-edge (z-0, behind the
            z-10 content wrapper below). Since this outer div has NO
            padding on any side, the component covers the full section.
        ============================================================ */}
        <div className="absolute inset-0 z-0">
          {/* NOTE: the preset's baked-in default image is a dead blob: URL
              from the Originkit editor session it was exported from
              (blob:https://www.originkit.dev/...), which the browser
              correctly refuses to load — that's why you saw a black
              canvas. Passing `image` here overrides that broken default.
              Swap the src below for your own image (local /public path
              or a real hosted URL). */}
          <DitherReveal
            image={{ src: "/pdfma6-pdfamouspainting095001c-image.jpg" }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <div className="w-full relative z-10 max-w-[1920px] mx-auto flex flex-col h-full gap-16 md:gap-24 py-24 md:py-32">
          {/* py-24 md:py-32 moved here so the existing heading/nav/graph
              content keeps its original spacing, without that padding
              leaking onto anything you add directly above in the parent div */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="px-6 md:px-12 w-full flex flex-col items-center relative"
          >
            {/* "What we do" badge aligned left on large screens, or just positioned absolutely */}
            <div className="absolute left-6 md:left-12 lg:left-16 top-0 md:top-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-black text-xs font-bold shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                 -
              </span>
              <span className="font-[family-name:var(--font-body)] text-xs md:text-sm tracking-[0.1em] text-black/90 font-medium">
                What I do
              </span>
            </div>

            <h2 className="font-[family-name:var(--font-display)] text-[clamp(4rem,12vw,10rem)] font-bold tracking-tighter leading-none text-black mt-12 lg:mt-0 text-center flex items-start">
              TechStack
              <span className="text-black/40 text-2xl md:text-4xl font-normal ml-2 md:ml-4 tracking-normal mt-4 md:mt-8"></span>
            </h2>
          </motion.div>

          <div className="flex flex-col-reverse lg:flex-row gap-0 xl:gap-8 relative w-full items-stretch lg:min-h-[600px] bg-transparent overflow-hidden px-0 lg:px-6">

          {/* LEFT: Nav Stack */}
          <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible justify-start lg:justify-center border-0 bg-transparent backdrop-blur-none p-0 lg:p-12 xl:p-16 relative z-20 no-scrollbar">            {skillsData.map((group, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={group.id}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className="group relative flex items-center justify-center lg:justify-between py-4 px-6 lg:py-8 border-r lg:border-r-0 lg:border-b border-white/[0.02] last:border-0 cursor-pointer shrink-0"
                >
                  <div className="flex flex-col lg:flex-row items-center lg:items-center gap-2 lg:gap-8 z-10 w-full text-center lg:text-left">
                    <span className={`font-mono text-[10px] md:text-xs lg:text-sm transition-all duration-500 ease-out ${isActive ? group.textColor : 'text-black/20 group-hover:text-black/40'}`}>
                      {group.id}
                    </span>
                    <h3 className={`font-[family-name:var(--font-display)] text-sm md:text-base lg:text-5xl font-black uppercase tracking-tighter transition-all duration-700 ease-[0.16,1,0.3,1] w-full ${isActive ? 'text-black lg:translate-x-6' : 'text-black/20 group-hover:text-black/40'}`}>
                      {group.category}
                    </h3>
                  </div>

                  <motion.div
                    animate={{ width: isActive ? "100%" : 0, opacity: isActive ? 1 : 0 }}
                    className={`absolute bottom-0 left-0 h-[2px] lg:relative lg:bottom-auto lg:left-auto lg:w-0 lg:h-[2px] ${group.textColor.replace('text-', 'bg-')}`}
                  />

                  {/* Desktop active indicator line */}
                  <motion.div
                    animate={{ width: isActive ? 40 : 0, opacity: isActive ? 1 : 0 }}
                    className={`hidden lg:block h-[2px] ${group.textColor.replace('text-', 'bg-')}`}
                  />
                </div>
              );
            })}
          </div>

          {/* RIGHT: Physics Graph Workspace */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full lg:w-[60%] xl:w-[65%] relative flex-1 min-h-[400px] sm:min-h-[550px] overflow-hidden bg-transparent"
          >
            {/* Soft Interactive Spotlight */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full mix-blend-screen pointer-events-none z-0"
              style={{
                x: useTransform(smoothMx, (v) => v * 150),
                y: useTransform(smoothMy, (v) => v * 150),
                translateX: "-50%",
                translateY: "-50%",
                background: `radial-gradient(circle, ${skillsData[activeIndex].glowColor} 0%, transparent 60%)`,
              }}
            />

            {/* Radar / Grid System */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="absolute w-[150px] md:w-[250px] h-[150px] md:h-[250px] rounded-full border border-black/[0.03]" />
              <div className="absolute w-[300px] md:w-[450px] h-[300px] md:h-[450px] rounded-full border border-black/[0.05] border-dashed" />
              <div className="absolute w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full border border-black/[0.03]" />

              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black/[0.03]" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-black/[0.03]" />
            </div>

            {/* UI Tech Corners */}
            <div className="absolute top-6 left-6 w-3 h-3 md:w-4 md:h-4 border-l border-t border-white/20" />
            <div className="absolute top-6 right-6 w-3 h-3 md:w-4 md:h-4 border-r border-t border-white/20" />
            <div className="absolute bottom-6 left-6 w-3 h-3 md:w-4 md:h-4 border-l border-b border-white/20" />
            <div className="absolute bottom-6 right-6 w-3 h-3 md:w-4 md:h-4 border-r border-b border-white/20" />

            {/* Live Interactive Node Network */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {skillsData.map((group, index) => (
                <NetworkGraph
                  key={`network-${group.id}`}
                  group={group}
                  mx={smoothMx}
                  my={smoothMy}
                  multiplier={radiusMultiplier}
                  isActive={index === activeIndex}
                  isInView={isInView}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
      </div>
    </section>
  );
};