import { create } from "zustand";

import type { HomeSectionId } from "@/types/domain";

interface LayoutEditorState {
  sections: HomeSectionId[];
  setSections: (sections: HomeSectionId[]) => void;
  moveSection: (activeId: HomeSectionId, overId: HomeSectionId) => void;
}

export const useLayoutEditorStore = create<LayoutEditorState>((set) => ({
  sections: [],
  setSections: (sections) => set({ sections }),
  moveSection: (activeId, overId) =>
    set((state) => {
      const oldIndex = state.sections.indexOf(activeId);
      const newIndex = state.sections.indexOf(overId);

      if (oldIndex === -1 || newIndex === -1) {
        return state;
      }

      const next = [...state.sections];
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);

      return { sections: next };
    }),
}));
