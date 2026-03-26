"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useEffect, useTransition } from "react";

import { useLayoutEditorStore } from "@/hooks/use-layout-editor-store";
import { cn } from "@/lib/utils";
import type { HomeSectionId } from "@/types/domain";

interface LayoutBuilderEditorProps {
  initialSections: HomeSectionId[];
  saveAction: (sections: HomeSectionId[]) => Promise<void>;
}

const labels: Record<HomeSectionId, string> = {
  hero: "Hero",
  projects: "Projects",
  achievements: "Achievements",
  experience: "Experience",
  contact: "Contact",
};

interface SortableItemProps {
  id: HomeSectionId;
}

const SortableItem = ({ id }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 p-3",
        isDragging && "opacity-70",
      )}
    >
      <div>
        <p className="text-sm font-medium text-slate-100">{labels[id]}</p>
        <p className="text-xs text-slate-400">Section key: {id}</p>
      </div>

      <button
        type="button"
        {...attributes}
        {...listeners}
        className="rounded-md border border-slate-600 p-2 text-slate-300 hover:bg-slate-800"
      >
        <GripVertical className="h-4 w-4" />
      </button>
    </div>
  );
};

export const LayoutBuilderEditor = ({ initialSections, saveAction }: LayoutBuilderEditorProps) => {
  const sensors = useSensors(useSensor(PointerSensor));
  const [isSaving, startTransition] = useTransition();

  const sections = useLayoutEditorStore((state) => state.sections);
  const setSections = useLayoutEditorStore((state) => state.setSections);
  const moveSection = useLayoutEditorStore((state) => state.moveSection);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections, setSections]);

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = event.active.id as HomeSectionId;
    const overId = event.over?.id as HomeSectionId | undefined;

    if (!overId || activeId === overId) {
      return;
    }

    moveSection(activeId, overId);
  };

  const handleSave = () => {
    startTransition(async () => {
      await saveAction(sections);
    });
  };

  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Section Order</h2>
        <p className="text-sm text-slate-400">
          Drag sections to reorder the homepage. Save to persist `layout_config.sections`.
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sections.map((section) => (
              <SortableItem key={section} id={section} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-md bg-[var(--primary-color)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSaving ? "Saving layout..." : "Save Layout"}
        </button>
        <p className="text-xs text-slate-400">Changes are applied immediately to `/` after save.</p>
      </div>
    </section>
  );
};
