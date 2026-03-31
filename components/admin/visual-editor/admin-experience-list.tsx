"use client";

import Image from "next/image";
import type { ExperienceItem } from "@/types/domain";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus } from "lucide-react";
import { persistReorderAction } from "@/app/admin/actions/reorder";
import Link from "next/link";

const formatRange = (startDate: string, endDate: string | null) => {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });
  const start = startDate ? formatter.format(new Date(startDate)) : "";
  const end = endDate ? formatter.format(new Date(endDate)) : "Present";
  return end ? `${start} - ${end}` : start;
};
const formatDate = (date: string) => new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(date));


function SortableExperienceItem({ item }: { item: ExperienceItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`group relative ml-4 border-l-2 border-[#c9a84c]/30 pl-8 pb-12 last:pb-0 transition-opacity ${isDragging ? "opacity-80" : ""}`}>
      {/* Edit Overlay */}
      <div className="absolute top-0 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button {...attributes} {...listeners} className="p-2 bg-slate-900/80 rounded-md text-white hover:bg-slate-800 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <Link href="/admin/experience" className="p-2 bg-slate-900/80 rounded-md text-white hover:bg-slate-800">
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full border-4 border-[#0a0a0f] bg-[#c9a84c] shadow-[0_0_10px_#c9a84c]" />
      
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start group-hover:bg-white/5 p-4 -mt-4 rounded-lg transition-colors">
        {item.image_url ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-white/20 bg-white/10 mt-1">
            <Image src={item.image_url} alt={item.company} fill className="object-contain p-1" />
          </div>
        ) : null}
        
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-xl font-bold tracking-wide text-[#e2d5b0]">{item.role}</h3>
            <span className="font-mono text-sm tracking-widest text-[#c9a84c]">
              {formatDate(item.start_date)} — {item.end_date ? formatDate(item.end_date) : "Present"}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#c9a84c]">{item.company}</span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span className="text-sm text-slate-400">{item.location}</span>
          </div>
          
          <p className="pt-2 font-sans text-md leading-relaxed text-slate-300">{item.summary}</p>
        </div>
      </div>
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
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-[var(--primary-color)]">Drag items to reorder chronological timeline.</p>
        <Link href="/admin/experience" className="flex items-center gap-2 text-sm bg-slate-800 text-white px-3 py-1.5 rounded-md hover:bg-slate-700 transition">
          <Plus className="w-4 h-4" /> Add Experience
        </Link>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={experience.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="py-4">
            {experience.map(item => (
              <SortableExperienceItem key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
