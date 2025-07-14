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
  setVisibleSections: (sections) => {
    const newSet = new Set(sections);
    console.log('[visibleSections] setVisibleSections:', [...newSet]);
    set({ visibleSections: newSet });
  },
  addVisibleSection: (section) => set((state) => {
    const updated = new Set(state.visibleSections);
    updated.add(section);
    console.log('[visibleSections] addVisibleSection:', [...updated]);
    return { visibleSections: updated };
  }),
  removeVisibleSection: (section) => set((state) => {
    const updated = new Set(state.visibleSections);
    updated.delete(section);
    console.log('[visibleSections] removeVisibleSection:', [...updated]);
    return { visibleSections: updated };
  }),
  clearVisibleSections: () => {
    console.log('[visibleSections] clearVisibleSections: []');
    set({ visibleSections: new Set() });
  },
  toggleVisibleSection: (section) => set((state) => {
    const updated = new Set(state.visibleSections);
    if (updated.has(section)) {
      updated.delete(section);
    } else {
      updated.add(section);
    }
    console.log('[visibleSections] toggleVisibleSection:', [...updated]);
    return { visibleSections: updated };
  }),
})); 