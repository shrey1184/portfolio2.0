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
    <div ref={setNodeRef} style={style} className={`group relative grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-12 py-8 border-b border-[var(--outline-variant)] bg-[var(--surface)] transition-all ${isDragging ? "opacity-50 inline-block" : ""}`}>
      <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button {...attributes} {...listeners} className="p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80 cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <Link href="/admin/achievements" className="p-2 bg-[var(--outline)] rounded-md text-[var(--surface)] hover:opacity-80">
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      <div className="md:col-span-1">
        <p className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-widest text-[var(--primary)] uppercase mt-2">
           {achievement.issuer}
        </p>
      </div>
      <div className="md:col-span-3 lg:col-span-2">
        <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold uppercase mb-4 tracking-[0.02em] pr-20">
          {achievement.title}
        </h3>
        <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed text-[var(--outline)]">
          {achievement.description}
        </p>
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
      <div className="mb-12 flex justify-between items-center border-b border-[var(--outline-variant)] pb-4">
        <p className="font-[family-name:var(--font-body)] text-xs text-[var(--outline)] tracking-widest uppercase font-bold">Drag to reorder achievements.</p>
        <Link href="/admin/achievements" className="chrome-button flex items-center gap-2 text-xs bg-transparent border border-[var(--outline)] text-[var(--outline)] px-4 py-2 font-bold tracking-widest uppercase hover:bg-[var(--outline)] hover:text-[var(--primary)] transition-industrial">
          <Plus className="w-4 h-4" /> Instantiate
        </Link>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={achievements.map(a => a.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col border-t-2 border-[var(--primary)]">
            {achievements.map(achievement => (
              <SortableAchievement key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
