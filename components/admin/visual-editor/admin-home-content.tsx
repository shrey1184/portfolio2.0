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
import { BlobTracer } from "@/components/public/blob-tracer";

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

const IndustrialSection = ({ id, number, title, dragHandleProps, dragListeners, children }: { id: string; number: string; title: string; dragHandleProps: any; dragListeners: any; children: ReactNode }) => (
  <section id={id} className="border-t border-[var(--outline-variant)] py-24 group relative bg-[var(--surface)]">
    <button 
      {...dragHandleProps} 
      {...dragListeners} 
      className="absolute right-6 top-6 z-50 p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      title="Drag to reorder section"
    >
      <GripVertical className="w-5 h-5" />
    </button>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1400px] mx-auto px-6">
      <div className="lg:col-span-3">
        <p className="font-[family-name:var(--font-body)] text-xs font-semibold text-[var(--outline)] tracking-widest uppercase">
          {number} / {title}
        </p>
      </div>
      <div className="lg:col-span-9">
        {children}
      </div>
    </div>
  </section>
);

const HeroSection = ({ dragHandleProps, dragListeners, videoUrl, opacity, blobs }: any) => (
  <section className="min-h-[85vh] flex flex-col justify-center relative z-10 pt-16 group bg-[var(--surface)] text-[var(--primary)] mt-[-64px]">
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-black">
      {videoUrl && (
        <video 
          key={videoUrl}
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{ opacity }}
          className="w-full h-full object-cover mix-blend-screen grayscale"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      <BlobTracer 
        count={blobs.count} 
        thickness={blobs.thickness} 
        size={blobs.size} 
        color={blobs.color} 
        speed={blobs.speed} 
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[transparent] to-[var(--surface)] opacity-100" />
    </div>
    <div className="max-w-[1400px] mx-auto w-full px-6 flex flex-col h-full mt-auto relative z-10 pt-16">
      <button 
        {...dragHandleProps} 
        {...dragListeners} 
        className="absolute top-6 right-6 z-50 p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        title="Drag to reorder Hero"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="max-w-[1100px] mt-auto">
        <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-8xl leading-[0.9] tracking-[0.02em] font-bold uppercase mb-16">
          Engineering<br />
          Systems that<br />
          Operate under<br />
          Real constraints.
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[var(--primary)] pt-4 pb-16 gap-6">
          <p className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-widest text-[var(--outline)] uppercase border-b border-[var(--outline)] border-dotted pb-1 w-max">
            01 . INFRASTRUCTURE . EXECUTION .
          </p>
          <Link
            href="/projects"
            className="bg-[var(--primary)] text-[var(--surface)] font-[family-name:var(--font-display)] font-bold text-sm tracking-widest uppercase px-12 py-4 transition-industrial hover:opacity-80"
            onClick={(e) => e.preventDefault()}
          >
            Enter
          </Link>
        </div>
      </div>
    </div>
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
        opacity={theme.hero_video_opacity ?? 0.5}
        blobs={{
          count: theme.blob_count ?? 10,
          thickness: theme.blob_thickness ?? 1,
          size: theme.blob_size ?? 80,
          color: theme.blob_color ?? "#FFFFFF",
          speed: theme.blob_speed ?? 4
        }}
      />
    ),
    experience: (p) => (
      <IndustrialSection id="experience" number="01" title="Impact" dragHandleProps={p.attributes} dragListeners={p.listeners}>
        <AdminExperienceList experience={experience} setExperience={setExperience} />
      </IndustrialSection>
    ),
    projects: (p) => (
      <IndustrialSection id="projects" number="02" title="Repository" dragHandleProps={p.attributes} dragListeners={p.listeners}>
        <AdminProjectGrid projects={projects} setProjects={setProjects} />
      </IndustrialSection>
    ),
    achievements: (p) => (
      <IndustrialSection id="achievements" number="03" title="Recognition" dragHandleProps={p.attributes} dragListeners={p.listeners}>
        <AdminAchievementList achievements={achievements} setAchievements={setAchievements} />
      </IndustrialSection>
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
      <section className="bg-[var(--primary)] text-[var(--surface)] py-32 border-t-[12px] border-[var(--primary)] mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1400px] mx-auto px-6">
          <div className="lg:col-span-8 border-b border-[rgba(255,255,255,0.2)] pb-12 mb-8">
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-bold uppercase leading-[1.1] mb-2 tracking-[0.02em]">
              Let's build systems<br />
              that matter.
            </h2>
          </div>
          <div className="lg:col-span-4 flex flex-col justify-end pb-20">
            <Link
              href="/contact"
              className="inline-block border border-[var(--outline)] text-[var(--outline)] font-[family-name:var(--font-display)] font-bold text-xs tracking-widest uppercase px-8 py-3 w-max transition-industrial hover:bg-[var(--outline)] hover:text-[var(--primary)] mb-4"
              onClick={(e) => e.preventDefault()}
            >
              Initiate Sequence
            </Link>
            <p className="font-[family-name:var(--font-body)] text-[10px] text-[var(--outline)] tracking-widest uppercase opacity-80">
              A system optimized for latency is inherently robust.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
