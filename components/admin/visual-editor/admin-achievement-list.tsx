"use client";

import Image from "next/image";
import type { Achievement } from "@/types/domain";
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


function SortableAchievement({ achievement }: { achievement: Achievement }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: achievement.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`group relative flex flex-col gap-6 rounded-xl border border-white/10 bg-white/5 p-6 transition-all sm:flex-row sm:items-center sm:p-8 ${isDragging ? "opacity-80 scale-[1.02]" : "hover:bg-white/10"}`}>
      <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button {...attributes} {...listeners} className="p-2 bg-slate-900/80 rounded-md text-white hover:bg-slate-800 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <Link href="/admin/achievements" className="p-2 bg-slate-900/80 rounded-md text-white hover:bg-slate-800">
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      {achievement.image_url ? (
        <div className="relative h-24 w-48 shrink-0 overflow-hidden rounded-lg border border-white/20 bg-white/5">
          <Image src={achievement.image_url} alt={achievement.title} fill className="object-contain p-2" />
        </div>
      ) : null}
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h3 className="text-xl font-bold tracking-wide text-[#e2d5b0] text-glow-static">{achievement.title}</h3>
          {achievement.achieved_at && (
            <span className="font-mono text-sm tracking-widest text-[#c9a84c]">
              {formatDate(achievement.achieved_at)}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#c9a84c] mb-2">{achievement.issuer}</p>
        <p className="text-md font-sans leading-relaxed text-slate-300">{achievement.description}</p>
      </div>
    </div>
  );
}

export function AdminAchievementList({ achievements, setAchievements }: { achievements: Achievement[], setAchievements: (a: Achievement[]) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = achievements.findIndex(a => a.id === active.id);
      const newIndex = achievements.findIndex(a => a.id === over.id);
      const newOrder = arrayMove(achievements, oldIndex, newIndex);
      setAchievements(newOrder);
      await persistReorderAction("achievements", newOrder.map(a => a.id));
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-[var(--primary-color)]">Drag to reorder achievements.</p>
        <Link href="/admin/achievements" className="flex items-center gap-2 text-sm bg-slate-800 text-white px-3 py-1.5 rounded-md hover:bg-slate-700 transition">
          <Plus className="w-4 h-4" /> Add Achievement
        </Link>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={achievements.map(a => a.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-4">
            {achievements.map(achievement => (
              <SortableAchievement key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
