"use client";

import { useState, useEffect, type ReactNode } from "react";
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
import { BlobTracer } from "@/components/public/blob-tracer";
import { TechStack } from "@/components/public/tech-stack";

interface AdminHomeContentProps {
  projects: Project[];
  setProjects: (p: Project[]) => void;
  achievements: Achievement[];
  setAchievements: (a: Achievement[]) => void;
  experience: ExperienceItem[];
  setExperience: (e: ExperienceItem[]) => void;
  sectionOrder: HomeSectionId[];
  setSectionOrder: (s: HomeSectionId[]) => void;
  theme: any;
}

const IndustrialSection = ({ id, number, title, dragHandleProps, dragListeners, children, center = false }: { id: string; number: string; title: string; dragHandleProps: any; dragListeners: any; children: ReactNode; center?: boolean }) => (
  <section id={id} className={`chrome-border-top group relative bg-[var(--surface)] ${center ? 'py-16' : 'py-24'}`}>
    <button 
      {...dragHandleProps} 
      {...dragListeners} 
      className="absolute right-6 top-6 z-50 p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      title="Drag to reorder section"
    >
      <GripVertical className="w-5 h-5" />
    </button>
    <div className={`grid grid-cols-1 ${center ? 'flex flex-col items-center gap-6' : 'lg:grid-cols-12 gap-12'} max-w-[1400px] mx-auto px-6`}>
      <div className={center ? 'text-center' : 'lg:col-span-3'}>
        <p className="font-[family-name:var(--font-body)] text-xs font-semibold text-[var(--outline)] tracking-widest uppercase chrome-text-protect inline-block">
          {number} / {title}
        </p>
      </div>
      <div className={center ? 'w-full flex flex-col items-center' : 'lg:col-span-9'}>
        {children}
      </div>
    </div>
  </section>
);

const AnimatedRoleText = ({ layer }: { layer: 'solid' | 'outline' }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["AI DEVELOPER", "FULL STACK", "SYSTEM ENGINEER"];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none w-full overflow-hidden">
      {words.map((word, index) => (
        <h1 
          key={`${layer}-${word}`}
          className={`absolute text-5xl sm:text-7xl md:text-[8rem] lg:text-[11rem] font-[family-name:var(--font-display)] font-bold uppercase tracking-[0.05em] whitespace-nowrap transition-all duration-1000 ${
            index === wordIndex ? "opacity-100 scale-100 filter-none" : "opacity-0 scale-110 blur-xl"
          } ${layer === 'solid' ? "text-[hidden]" : "text-transparent"}`}
          style={
            layer === 'solid' 
            ? { color: 'var(--primary)', opacity: index === wordIndex ? 1 : 0 }
            : { WebkitTextStroke: "1px var(--primary)", filter: "drop-shadow(0 0 20px rgba(var(--primary-rgb), 0.2))" }
          }
        >
          {word}
        </h1>
      ))}
    </div>
  );
};

const HeroSection = ({ dragHandleProps, dragListeners, videoUrl, imageUrl, opacity, grayscale, blobs }: any) => (
  <section className="min-h-[100svh] flex flex-col justify-center relative z-10 pt-16 mt-[-64px] bg-[var(--surface)] overflow-hidden group">
    <button 
      {...dragHandleProps} 
      {...dragListeners} 
      className="absolute top-6 right-6 z-50 p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      title="Drag to reorder Hero"
    >
      <GripVertical className="h-5 w-5" />
    </button>
    <div className={`absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none ${videoUrl ? 'bg-black' : 'bg-secondary'}`}>
      {videoUrl && (
        <video 
          key={videoUrl}
          autoPlay 
          loop 
          muted 
          playsInline 
          crossOrigin="anonymous"
          style={{ opacity: opacity * 0.5 }}
          className={`w-full h-full object-cover mix-blend-screen ${grayscale ? 'grayscale' : ''}`}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      <BlobTracer 
        count={blobs.count} 
        thickness={blobs.thickness} 
        size={blobs.size} 
        color={blobs.color} 
        filledColor={blobs.filledColor}
        speed={blobs.speed} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--surface)] opacity-100" />
    </div>

    <div className="absolute inset-6 sm:inset-10 z-10 pointer-events-none border-[0.5px] border-[var(--outline)] opacity-30" />

    <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[var(--primary)] z-20 opacity-80 text-lg">
      <span>✦</span>
      <span>✦</span>
      <span>✦</span>
    </div>

    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[var(--primary)] z-20 opacity-80">
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-[family-name:var(--font-display)]">Constructed</span>
      <span className="text-sm">⊕</span>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-[family-name:var(--font-display)]">Systems</span>
    </div>

    <div className="absolute top-16 left-16 hidden lg:flex flex-col gap-2 max-w-[220px] z-20">
      <div className="text-[var(--primary)] text-xl mb-1">✧</div>
      <h3 className="text-[var(--primary)] font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase">CLOSE-UP</h3>
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[9px] leading-relaxed uppercase tracking-widest mt-1 opacity-70">
        Capture the raw intensity of code, the structured elegance of systems.
      </p>
    </div>

    <div className="absolute top-16 right-16 hidden lg:flex flex-col items-end text-right gap-2 max-w-[220px] z-20">
      <div className="text-[var(--primary)] text-xl mb-1">✧</div>
      <h3 className="text-[var(--primary)] font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase">MID-SHOT</h3>
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[9px] leading-relaxed uppercase tracking-widest mt-1 opacity-70">
        Frame the system against the backdrop of constraint, a vision of raw capacity.
      </p>
    </div>

    <div className="absolute top-1/2 -translate-y-1/2 left-16 hidden xl:flex flex-col gap-2 max-w-[200px] z-20">
      <div className="text-[var(--primary)] text-2xl mb-4">❋</div>
      <h3 className="text-[var(--primary)] font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase">VOID BOUND</h3>
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[9px] leading-relaxed uppercase tracking-widest mt-1 opacity-70">
        Born in logic, crowned in structure. The design is etched in terminal output.
      </p>
    </div>

    <div className="absolute top-1/2 -translate-y-1/2 right-16 hidden xl:flex flex-col items-end text-right gap-2 max-w-[200px] z-20">
      <div className="text-[var(--primary)] text-2xl mb-4">❋</div>
      <h3 className="text-[var(--primary)] font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase">DARK REIGN</h3>
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[9px] leading-relaxed uppercase tracking-widest mt-1 opacity-70">
        A network forged in fire, feared by all. Constraints of destiny cannot bind it.
      </p>
    </div>

    <div className="absolute bottom-16 left-16 hidden lg:flex flex-col gap-2 max-w-[280px] z-20">
      <div className="text-[var(--primary)] text-2xl mb-2 font-light">++</div>
      <h3 className="text-[var(--primary)] font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase">ARCHITECT</h3>
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[9px] leading-relaxed uppercase tracking-widest mt-1 opacity-70">
        She stands at the precipice of complexity, draped in the echoes of data and willed in the structuring of systems long forgotten.
      </p>
    </div>

    <div className="absolute bottom-16 right-16 hidden lg:flex flex-col items-end text-right gap-2 max-w-[280px] z-20">
      <div className="text-[var(--primary)] text-2xl mb-2 font-light">++</div>
      <h3 className="text-[var(--primary)] font-[family-name:var(--font-display)] text-[11px] tracking-[0.3em] uppercase">IRON LOGIC</h3>
      <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[9px] leading-relaxed uppercase tracking-widest mt-1 opacity-70">
        A system forged in logic, feared by entropy. Her presence alone bends the will of servers.
      </p>
    </div>

    <div className="relative w-full h-[75vh] flex flex-col items-center justify-center z-10 mt-8">
      <div className="absolute inset-0 z-[5]">
        <AnimatedRoleText layer="solid" />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <img 
          src={imageUrl || "/angel1.png"} 
          alt="Subject" 
          className="h-[100vh] w-auto max-w-none scale-110 md:scale-125 origin-bottom object-contain object-bottom drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] filter brightness-90 contrast-125"
        />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none">
         <AnimatedRoleText layer="outline" />
      </div>

      <div className="absolute bottom-0 z-30 flex flex-col items-center gap-6 pb-4">
        <Link
          href="#skills"
          className="chrome-button bg-transparent border border-[var(--primary)] text-[var(--primary)] font-[family-name:var(--font-display)] font-bold text-xs tracking-[0.3em] uppercase px-12 py-3 transition-industrial hover:bg-[var(--primary)] hover:text-[var(--surface)] backdrop-blur-sm"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Initialize
        </Link>
      </div>
    </div>
    
    <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[var(--surface)] to-transparent z-20 pointer-events-none" />
  </section>
);

function SortableSection({ id, children }: { id: HomeSectionId, children: (props: any) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    scale: isDragging ? "1.01" : "1",
    zIndex: isDragging ? 99 : 1,
    position: "relative" as any,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners })}
    </div>
  );
}

export const AdminHomeContent = ({ projects, setProjects, achievements, setAchievements, experience, setExperience, sectionOrder, setSectionOrder, theme }: AdminHomeContentProps) => {
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
    hero: (p) => (
      <HeroSection 
        dragHandleProps={p.attributes} 
        dragListeners={p.listeners} 
        videoUrl={theme.hero_video_url}
        imageUrl={theme.hero_image_url}
        opacity={theme.hero_video_opacity ?? 0.5}
        grayscale={theme.hero_video_grayscale ?? true}
        blobs={{
          count: theme.blob_count ?? 10,
          thickness: theme.blob_thickness ?? 1,
          size: theme.blob_size ?? 80,
          color: theme.blob_color ?? "#FFFFFF",
          filledColor: theme.filled_blob_color ?? "#FFFFFF",
          speed: theme.blob_speed ?? 4
        }}
      />
    ),
    experience: (p) => (
      <IndustrialSection id="experience" number="02" title="Impact" dragHandleProps={p.attributes} dragListeners={p.listeners}>
        <AdminExperienceList experience={experience} setExperience={setExperience} />
      </IndustrialSection>
    ),
    projects: (p) => (
      <IndustrialSection id="projects" number="03" title="Repository" dragHandleProps={p.attributes} dragListeners={p.listeners}>
        <AdminProjectGrid projects={projects} setProjects={setProjects} />
      </IndustrialSection>
    ),
    achievements: (p) => (
      <IndustrialSection id="achievements" number="04" title="Recognition" dragHandleProps={p.attributes} dragListeners={p.listeners} center={true}>
        <AdminAchievementList 
          achievements={achievements} 
          setAchievements={setAchievements} 
          borderColor={theme.achievement_border_color}
        />
      </IndustrialSection>
    ),
    stack: (p) => (
      <div className="relative group">
        <button 
          {...p.attributes} 
          {...p.listeners} 
          className="absolute right-6 top-6 z-50 p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          title="Drag to reorder section"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <TechStack />
      </div>
    ),
    contact: (p) => (
      null 
    ),
  };

  return (
    <div className="bg-[var(--surface)] text-[var(--primary)] selection:bg-[var(--primary)] selection:text-[var(--surface)]">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col">
            {sectionOrder.map((sectionId) => (
              <SortableSection key={sectionId} id={sectionId}>
                {(props) => sectionsRender[sectionId](props)}
              </SortableSection>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {/* Contact block added at the bottom as standard module */}
      <section className="bg-[var(--primary)] text-[var(--surface)] py-32 border-t-[12px] border-[var(--primary)] mt-12 chrome-surface">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1400px] mx-auto px-6">
          <div className="lg:col-span-8 chrome-border-bottom pb-12 mb-8">
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-bold uppercase leading-[1.1] mb-2 tracking-[0.02em] chrome-text-protect">
              Let&apos;s build systems<br />
              that matter.
            </h2>
          </div>
          <div className="lg:col-span-4 flex flex-col justify-end pb-20">
            <Link
              href="/contact"
              className="chrome-button inline-block border border-[var(--outline)] text-[var(--outline)] font-[family-name:var(--font-display)] font-bold text-xs tracking-widest uppercase px-8 py-3 w-max transition-industrial hover:bg-[var(--outline)] hover:text-[var(--primary)] mb-4"
              onClick={(e) => e.preventDefault()}
            >
              Initiate Sequence
            </Link>
            <p className="font-[family-name:var(--font-body)] text-[10px] text-[var(--outline)] tracking-widest uppercase opacity-80">
              <span className="chrome-text-protect">A system optimized for latency is inherently robust.</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
