"use client";

import type { Achievement } from "@/types/domain";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Plus } from "lucide-react";
import { persistReorderAction } from "@/app/admin/actions/reorder";
import Link from "next/link";


function SortableAchievement({ achievement }: { achievement: Achievement }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: achievement.id });
  const year = achievement.achieved_at ? new Date(achievement.achieved_at).getFullYear() : "";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`group relative w-full flex flex-col items-center py-6 border-t border-white/5 last:border-b border-[var(--outline-variant)] bg-[var(--surface)] transition-all ${isDragging ? "opacity-50" : ""} text-center`}>
      <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button {...attributes} {...listeners} className="p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <Link href="/admin/achievements" className="p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80">
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <div className="flex items-center justify-center gap-3">
          <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold uppercase tracking-wide text-white group-hover:text-[var(--primary)] transition-colors">
            {achievement.title}
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[8px] font-bold uppercase tracking-wider text-white/50">
            Verified
          </span>
        </div>
        <p className="font-[family-name:var(--font-body)] text-[12px] md:text-[13px] leading-relaxed text-[var(--outline)] max-w-xl">
          {achievement.description}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <p className="font-[family-name:var(--font-display)] text-[11px] font-bold uppercase tracking-wider text-white/80">
          {achievement.issuer}
        </p>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <p className="font-[family-name:var(--font-body)] text-[10px] font-bold text-white/20 uppercase">
          {year}
        </p>
      </div>
    </div>
  );
}

export function AdminAchievementList({ achievements, setAchievements, borderColor }: { achievements: Achievement[], setAchievements: (a: Achievement[]) => void, borderColor?: string }) {
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
      <div className="mb-12 flex justify-between items-center border-b border-[var(--outline-variant)] pb-4">
        <p className="font-[family-name:var(--font-body)] text-xs text-[var(--outline)] tracking-widest uppercase font-bold">Drag to reorder achievements.</p>
        <Link href="/admin/achievements" className="chrome-button flex items-center gap-2 text-xs bg-transparent border border-[var(--outline)] text-[var(--outline)] px-4 py-2 font-bold tracking-widest uppercase hover:bg-[var(--outline)] hover:text-[var(--primary)] transition-industrial">
          <Plus className="w-4 h-4" /> Instantiate
        </Link>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={achievements.map(a => a.id)} strategy={verticalListSortingStrategy}>
          <div 
            className="w-full max-w-4xl mx-auto py-12 px-6 border flex flex-col items-center"
            style={{ borderColor: borderColor || 'rgba(255,255,255,0.1)', background: 'transparent' }}
          >
            <div className="text-center mb-12">
              <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
                Honors & Awards
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-black uppercase tracking-tight mb-6 text-white">
                Recognition with actual signal.
              </h2>
              <p className="max-w-2xl mx-auto font-[family-name:var(--font-body)] text-xs md:text-sm text-[var(--outline)] leading-relaxed">
                Notable finishes and industry recognition — verified results across global, national, and technical domains with real-world impact.
              </p>
            </div>
            
            <div className="w-full flex flex-col items-center">
              {achievements.map(achievement => (
                <SortableAchievement key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
