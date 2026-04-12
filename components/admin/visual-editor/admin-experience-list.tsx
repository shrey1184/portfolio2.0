"use client";

import type { ExperienceItem } from "@/types/domain";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus } from "lucide-react";
import { persistReorderAction } from "@/app/admin/actions/reorder";
import Link from "next/link";


function SortableExperienceItem({ item }: { item: ExperienceItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`group relative flex flex-col gap-4 border-b border-[var(--outline-variant)] pb-16 last:border-0 last:pb-0 bg-[var(--surface)] transition-opacity ${isDragging ? "opacity-50" : ""}`}>
      <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button {...attributes} {...listeners} className="p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <Link href="/admin/experience" className="p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80">
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      <h3 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold uppercase leading-[1.1] tracking-[0.02em] max-w-3xl pr-20">
        {item.role}
      </h3>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-[10px] font-[family-name:var(--font-body)] font-bold tracking-widest text-[var(--outline)] uppercase mt-2">
        <span>{item.company}</span>
        <span className="hidden sm:inline">//</span>
        <span>{item.location}</span>
      </div>
      <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed max-w-2xl mt-6">
        {item.summary}
      </p>
    </div>
  );
}

export function AdminExperienceList({ experience, setExperience }: { experience: ExperienceItem[], setExperience: (e: ExperienceItem[]) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = experience.findIndex(e => e.id === active.id);
      const newIndex = experience.findIndex(e => e.id === over.id);
      const newOrder = arrayMove(experience, oldIndex, newIndex);
      setExperience(newOrder);
      await persistReorderAction("experience", newOrder.map(e => e.id));
    }
  };

  return (
    <div>
      <div className="mb-12 flex justify-between items-center border-b border-[var(--outline-variant)] pb-4">
        <p className="font-[family-name:var(--font-body)] text-xs text-[var(--outline)] tracking-widest uppercase font-bold">Drag items to reorder chronological timeline.</p>
        <Link href="/admin/experience" className="chrome-button flex items-center gap-2 text-xs bg-transparent border border-[var(--outline)] text-[var(--outline)] px-4 py-2 font-bold tracking-widest uppercase hover:bg-[var(--outline)] hover:text-[var(--primary)] transition-industrial">
          <Plus className="w-4 h-4" /> Instantiate
        </Link>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={experience.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-16">
            {experience.map(item => (
              <SortableExperienceItem key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
