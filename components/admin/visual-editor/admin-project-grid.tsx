"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types/domain";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus } from "lucide-react";
import { persistReorderAction } from "@/app/admin/actions/reorder";
import Link from "next/link";

function SortableProjectCard({ project }: { project: Project }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group h-full">
      <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Drag Handle */}
        <button {...attributes} {...listeners} className="p-2 bg-slate-900/80 rounded-md text-white hover:bg-slate-800 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        {/* Edit Button - linking to old generic form or could be inline modal */}
        <Link href="/admin/projects" className="p-2 bg-slate-900/80 rounded-md text-white hover:bg-slate-800">
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      <Card className="h-full overflow-hidden border-white/70 bg-white/90 backdrop-blur-sm transition-transform duration-200" style={{ transform: isDragging ? 'scale(1.02)' : 'scale(1)' }}>
        {project.image_url && (
          <div className="relative h-44 w-full cursor-pointer">
            <Image src={project.image_url} alt={project.title} fill className="object-cover" />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-xl text-[var(--secondary-color)]">{project.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-slate-600">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <Badge key={tech} variant="outline" className="border-slate-300 text-slate-700">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
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
      // Persist the order via existing action
      await persistReorderAction("projects", newOrder.map(p => p.id));
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-[var(--primary-color)]">Drag to reorder projects.</p>
        <Link href="/admin/projects" className="flex items-center gap-2 text-sm bg-slate-800 text-white px-3 py-1.5 rounded-md hover:bg-slate-700 transition">
          <Plus className="w-4 h-4" /> Add Project
        </Link>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <SortableProjectCard key={project.id} project={project} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
