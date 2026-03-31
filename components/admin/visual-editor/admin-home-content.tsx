"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { AdminProjectGrid } from "./admin-project-grid";
import { AdminAchievementList } from "./admin-achievement-list";
import { AdminExperienceList } from "./admin-experience-list";
import type { Achievement, ExperienceItem, HomeSectionId, Project } from "@/types/domain";
import { saveLayoutAction } from "@/app/admin/actions/layout-config";

interface AdminHomeContentProps {
  projects: Project[];
  setProjects: (p: Project[]) => void;
  achievements: Achievement[];
  setAchievements: (a: Achievement[]) => void;
  experience: ExperienceItem[];
  setExperience: (e: ExperienceItem[]) => void;
  sectionOrder: HomeSectionId[];
  setSectionOrder: (s: HomeSectionId[]) => void;
}

/* ─── Decorative divider ─── */
const GoldDivider = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0 0" }}>
    <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, transparent, #c9a84c)" }} />
    <div style={{ width: "6px", height: "6px", background: "#c9a84c", transform: "rotate(45deg)", boxShadow: "0 0 8px #c9a84c" }} />
    <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, transparent, #c9a84c)" }} />
  </div>
);

/* ─── Section heading ─── */
const SectionHeading = ({ children, dragHandleProps, dragListeners }: any) => (
  <div style={{ marginBottom: "2rem" }} className="group relative flex items-center justify-between">
    <div className="flex-1">
      <h2 style={{
        fontFamily: "'Cinzel', serif",
        fontSize: "clamp(1.4rem, 3vw, 2rem)",
        fontWeight: 700,
        color: "#c9a84c",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        textShadow: "0 0 10px rgba(201,168,76,0.5), 0 0 24px rgba(201,168,76,0.3)",
        margin: 0,
      }}>
        {children}
      </h2>
    </div>
    <button 
      {...dragHandleProps} 
      {...dragListeners} 
      className="p-2 bg-slate-900/80 rounded-md text-white hover:bg-slate-800 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0 mt-[-10px]"
      title="Drag to reorder section"
    >
      <GripVertical className="w-5 h-5" />
    </button>
    <div className="absolute w-full top-[100%]"><GoldDivider /></div>
  </div>
);

/* ─── Glass card ─── */
const glassCard: React.CSSProperties = {
  background: "rgba(10,10,15,0.75)",
  border: "1px solid rgba(201,168,76,0.25)",
  borderRadius: "16px",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  padding: "2rem",
  position: "relative",
  overflow: "hidden",
};

/* ─── Hero Section ─── */
const HeroSection = ({ dragHandleProps, dragListeners }: any) => (
  <section style={{ position: "relative", minHeight: "92vh", display: "flex", flexDirection: "column" }} className="group">
    {/* Wallpaper */}
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: "url('/new-bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center top",
      backgroundRepeat: "no-repeat",
    }} />
    
    <button 
      {...dragHandleProps} 
      {...dragListeners} 
      className="absolute top-24 right-4 z-50 p-2 bg-slate-900/80 rounded-md text-white hover:bg-slate-800 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      title="Drag to reorder Hero"
    >
      <GripVertical className="h-6 w-6" />
    </button>

    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(5,5,10,0.45) 0%, rgba(5,5,10,0.65) 55%, rgba(5,5,10,0.97) 100%)" }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 40%, rgba(201,168,76,0.07) 0%, transparent 60%)" }} />
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)" }} />

    <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "clamp(2rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)", maxWidth: "860px" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem", animation: "fadeIn 600ms ease-out both" }}>
        <div style={{ width: "28px", height: "1px", background: "#c9a84c", boxShadow: "0 0 6px #c9a84c" }} />
        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.25em", color: "#c9a84c", textTransform: "uppercase", textShadow: "0 0 8px rgba(201,168,76,0.6)" }}>Full-Stack Engineer</span>
        <div style={{ width: "28px", height: "1px", background: "#c9a84c", boxShadow: "0 0 6px #c9a84c" }} />
      </div>

      <h1 className="text-glow" style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(2.4rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.12, letterSpacing: "0.02em", color: "#e8c97a", margin: "0 0 1.5rem", animation: "fadeIn 700ms 100ms ease-out both" }}>
        Designing Reliable<br />
        <span style={{ color: "#fff", textShadow: "0 0 30px rgba(255,255,255,0.2)" }}>Products with Clean</span>
        <br />Architecture.
      </h1>

      <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 400, color: "rgba(226,213,176,0.75)", lineHeight: 1.7, maxWidth: "560px", margin: "0 0 2.5rem", animation: "fadeIn 700ms 200ms ease-out both" }}>
        This portfolio is fully data-driven — projects, achievements, experience, section order, and theme all flow from the admin CMS.
      </p>
    </div>

    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to bottom, transparent, #0a0a0f)" }} />
  </section>
);


function SortableSection({ id, children }: { id: HomeSectionId, children: (props: any) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    scale: isDragging ? "1.02" : "1",
    zIndex: isDragging ? 99 : 1,
    position: "relative" as any,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners })}
    </div>
  );
}


export const AdminHomeContent = ({ projects, setProjects, achievements, setAchievements, experience, setExperience, sectionOrder, setSectionOrder }: AdminHomeContentProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id);
      const newIndex = sectionOrder.indexOf(over.id);
      const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
      setSectionOrder(newOrder);
      await saveLayoutAction(newOrder);
    }
  };

  const sectionsRender: Record<HomeSectionId, (props: any) => ReactNode> = {
    hero: (p) => <HeroSection dragHandleProps={p.attributes} dragListeners={p.listeners} />,
    projects: (p) => (
      <section id="projects" style={{ ...glassCard, marginTop: "4px" }} className="border-glow">
        <SectionHeading dragHandleProps={p.attributes} dragListeners={p.listeners}>Projects</SectionHeading>
        <AdminProjectGrid projects={projects} setProjects={setProjects} />
      </section>
    ),
    achievements: (p) => (
      <section id="achievements" style={glassCard} className="border-glow">
        <SectionHeading dragHandleProps={p.attributes} dragListeners={p.listeners}>Achievements</SectionHeading>
        <AdminAchievementList achievements={achievements} setAchievements={setAchievements} />
      </section>
    ),
    experience: (p) => (
      <section id="experience" style={glassCard} className="border-glow">
        <SectionHeading dragHandleProps={p.attributes} dragListeners={p.listeners}>Experience</SectionHeading>
        <AdminExperienceList experience={experience} setExperience={setExperience} />
      </section>
    ),
    contact: (p) => (
      <section id="contact" style={glassCard} className="border-glow">
        <SectionHeading dragHandleProps={p.attributes} dragListeners={p.listeners}>Contact</SectionHeading>
        <p style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.1rem", color: "rgba(226,213,176,0.75)", lineHeight: 1.7, maxWidth: "520px", marginBottom: "1.75rem" }}>
          For collaborations, consulting, or full-time opportunities, use the dedicated contact page.
        </p>
        <Link href="/contact" style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "13px 28px", background: "linear-gradient(135deg, #c9a84c, #e8c97a)", color: "#0a0a0f", borderRadius: "4px", textDecoration: "none", display: "inline-block", boxShadow: "0 0 14px rgba(201,168,76,0.4)" }}>
          Go To Contact Page
        </Link>
      </section>
    ),
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {sectionOrder.map((sectionId) => (
            <SortableSection key={sectionId} id={sectionId}>
              {(props) => (
                <div style={sectionId !== 'hero' ? { maxWidth: "1152px", width: "100%", margin: "0 auto", padding: "0 1.5rem" } : {}}>
                  {sectionsRender[sectionId](props)}
                </div>
              )}
            </SortableSection>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
