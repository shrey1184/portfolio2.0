"use client";

import Image from "next/image";
import type { Project } from "@/types/domain";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus } from "lucide-react";
import { persistReorderAction } from "@/app/admin/actions/reorder";
import Link from "next/link";

function SortableProjectCard({ project, index }: { project: Project; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group p-4 -m-4">
      <div className="absolute top-6 right-6 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button {...attributes} {...listeners} className="p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <Link href="/admin/projects" className="p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80">
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative w-full h-[400px] md:h-[500px] !bg-[var(--surface)] bg-zinc-950 overflow-hidden rounded-[40px] shadow-[0_-10px_35px_rgba(0,0,0,0.5)] border border-white/10">
        <div className="relative h-full w-full">
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              quality={100}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : null}
          
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 pointer-events-none z-10" />

          <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none z-10">
            <div 
              className="bg-black/20 backdrop-blur-md border border-white/10 p-5 md:p-6 rounded-xl flex flex-col justify-end text-neutral-100 pointer-events-auto"
              style={{ WebkitBackdropFilter: 'blur(12px)' }}
            >
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-2 font-[family-name:var(--font-display)]">
                {project.title}
              </h3>
              
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] pb-[1px] font-bold tracking-widest uppercase bg-white/10 px-2 py-1 rounded backdrop-blur-sm border border-white/10 font-[family-name:var(--font-body)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-sm md:text-base text-neutral-300 line-clamp-2 md:line-clamp-3 font-[family-name:var(--font-body)]">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminProjectGrid({ projects, setProjects }: { projects: Project[], setProjects: (p: Project[]) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id);
      const newIndex = projects.findIndex(p => p.id === over.id);
      const newOrder = arrayMove(projects, oldIndex, newIndex);
      setProjects(newOrder);
      await persistReorderAction("projects", newOrder.map(p => p.id));
    }
  };

  return (
    <div>
      <div className="mb-12 flex justify-between items-center border-b border-[var(--outline-variant)] pb-4">
        <p className="font-[family-name:var(--font-body)] text-xs text-[var(--outline)] tracking-widest uppercase font-bold">Drag to reorder component sequence.</p>
        <Link href="/admin/projects" className="chrome-button flex items-center gap-2 text-xs bg-transparent border border-[var(--outline)] text-[var(--outline)] px-4 py-2 font-bold tracking-widest uppercase hover:bg-[var(--outline)] hover:text-[var(--primary)] transition-industrial">
          <Plus className="w-4 h-4" /> Instantiate
        </Link>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className="flex flex-col gap-24">
            {projects.map((project, index) => (
              <SortableProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
