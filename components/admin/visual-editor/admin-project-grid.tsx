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
  const isEven = index % 2 === 0;
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative group bg-[var(--surface)] p-4 -m-4">
      <div className="absolute top-6 right-6 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button {...attributes} {...listeners} className="p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <Link href="/admin/projects" className="p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80">
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      <div className={`relative h-64 md:h-96 w-full bg-[var(--surface-container-high)] ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
        {project.image_url ? (
          <Image src={project.image_url} alt={project.title} fill className="object-cover grayscale hover:grayscale-0 transition-industrial duration-700" />
        ) : null}
      </div>
      <div className={`flex flex-col justify-center ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="border-[var(--primary)] pb-4 mb-6">
          <h3 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold uppercase tracking-[0.02em]">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
            {project.tech_stack.map((tech) => (
              <span key={tech} className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-widest uppercase text-[var(--outline)] before:content-['['] after:content-[']']">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed mb-10 max-w-md">
          {project.description}
        </p>
        <div className="w-8 h-[2px] bg-black mb-8" />
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
