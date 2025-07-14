import { create } from 'zustand';

interface VisibleSectionsState {
  visibleSections: Set<string>;
  setVisibleSections: (sections: Set<string>) => void;
  addVisibleSection: (section: string) => void;
  removeVisibleSection: (section: string) => void;
  clearVisibleSections: () => void;
  toggleVisibleSection: (section: string) => void;
}

export const useVisibleSectionsStore = create<VisibleSectionsState>((set, get) => ({
  visibleSections: new Set<string>(),
  setVisibleSections: (sections) => set({ visibleSections: new Set(sections) }),
  addVisibleSection: (section) => set((state) => {
    const updated = new Set(state.visibleSections);
    updated.add(section);
    return { visibleSections: updated };
  }),
  removeVisibleSection: (section) => set((state) => {
    const updated = new Set(state.visibleSections);
    updated.delete(section);
    return { visibleSections: updated };
  }),
  clearVisibleSections: () => set({ visibleSections: new Set() }),
  toggleVisibleSection: (section) => set((state) => {
    const updated = new Set(state.visibleSections);
    if (updated.has(section)) {
      updated.delete(section);
    } else {
      updated.add(section);
    }
    return { visibleSections: updated };
  }),
})); 