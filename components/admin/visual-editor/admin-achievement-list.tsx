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
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`group relative flex flex-col items-center py-6 border-b border-[var(--outline-variant)] bg-[var(--surface)] transition-all ${isDragging ? "opacity-50" : ""} text-center`}>
      <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button {...attributes} {...listeners} className="p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <Link href="/admin/achievements" className="p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80">
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="font-[family-name:var(--font-body)] text-[9px] font-bold tracking-[0.2em] text-[var(--outline)] uppercase mb-2">
           {achievement.issuer}
        </p>
        <h3 className="font-[family-name:var(--font-display)] text-lg md:text-xl font-bold uppercase tracking-[0.02em]">
          {achievement.title}
        </h3>
        <p className="font-[family-name:var(--font-body)] text-xs leading-relaxed text-[var(--outline)] max-w-md mx-auto">
          {achievement.description}
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
            className="flex flex-col border p-6"
            style={{ borderColor: borderColor || 'rgba(0,0,0,0.1)', background: 'transparent' }}
          >
            {achievements.map(achievement => (
              <SortableAchievement key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
