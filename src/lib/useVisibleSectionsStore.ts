import { create } from 'zustand';

interface SectionFilterState {
  /**
   * If sectionFilters is empty, show all grids (no filters applied).
   * If non-empty, only show grids whose section/table_name is in the set.
   */
  sectionFilters: Set<string>;
  setSectionFilters: (sections: Set<string>) => void;
  addSectionFilter: (section: string) => void;
  removeSectionFilter: (section: string) => void;
  clearSectionFilters: () => void;
  toggleSectionFilter: (section: string) => void;
}

export const useSectionFilterStore = create<SectionFilterState>((set, get) => ({
  sectionFilters: new Set<string>(),
  setSectionFilters: (sections) => {
    const newSet = new Set(sections);
    console.log('[sectionFilters] setSectionFilters:', [...newSet]);
    set({ sectionFilters: newSet });
  },
  addSectionFilter: (section) => set((state) => {
    const updated = new Set(state.sectionFilters);
    updated.add(section);
    console.log('[sectionFilters] addSectionFilter:', [...updated]);
    return { sectionFilters: updated };
  }),
  removeSectionFilter: (section) => set((state) => {
    const updated = new Set(state.sectionFilters);
    updated.delete(section);
    console.log('[sectionFilters] removeSectionFilter:', [...updated]);
    return { sectionFilters: updated };
  }),
  clearSectionFilters: () => {
    console.log('[sectionFilters] clearSectionFilters: []');
    set({ sectionFilters: new Set() });
  },
  toggleSectionFilter: (section) => set((state) => {
    const updated = new Set(state.sectionFilters);
    if (updated.has(section)) {
      updated.delete(section);
    } else {
      updated.add(section);
    }
    console.log('[sectionFilters] toggleSectionFilter:', [...updated]);
    return { sectionFilters: updated };
  }),
})); 