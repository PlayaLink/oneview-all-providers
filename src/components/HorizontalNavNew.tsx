import React from "react";
import SectionsDropdown from "./SectionsDropdown";
import NavItem from "@/components/NavItem";
import { useSectionFilterStore } from "@/lib/useVisibleSectionsStore";
import { useGridConfig } from "@/lib/useGridConfig";

interface GridSection {
  id: string;
  key: string;
  name: string;
  order: number;
}

interface HorizontalNavNewProps {
  gridSections: GridSection[];
  selectedSection: string | null;
  onSectionSelect: (sectionKey: string) => void;
  // visibleSections?: Set<string>;
  // onSectionVisibilityChange?: (sectionKey: string, visible: boolean) => void;
}

const HorizontalNavNew: React.FC<HorizontalNavNewProps> = ({
  gridSections,
  selectedSection,
  onSectionSelect,
}) => {
  // Use global Zustand store for sectionFilters
  const sectionFilters = useSectionFilterStore((s) => s.sectionFilters);
  const { groupKeyToGrids } = useGridConfig();

  // Only show tabs for groups with at least one grid matching the filter
  const visibleSectionList = React.useMemo(() => {
    if (!sectionFilters || sectionFilters.size === 0) {
      // No filters: show all sections
      return gridSections;
    }
    // Only show sections with at least one grid in the filter set
    return gridSections.filter(section => {
      const grids = groupKeyToGrids[section.key] || [];
      return grids.some(grid => sectionFilters.has(grid.table_name || grid.key));
    });
  }, [sectionFilters, gridSections, groupKeyToGrids]);

  return (
    <nav
      role="navigation"
      aria-label="Section navigation"
      data-testid="horizontal-nav"
    >
      <div className="px-4">
        <div className="flex items-center justify-between gap-4">
          <div
            className="flex items-end pt-5 overflow-x-auto whitespace-nowrap gap-2"
            role="tablist"
            aria-label="Available sections"
          >
            {visibleSectionList.map((section) => (
              <NavItem
                key={section.key}
                variant="horizontal"
                size="sm"
                active={selectedSection === section.key}
                onClick={() => onSectionSelect(section.key)}
                role="tab"
                aria-selected={selectedSection === section.key}
                aria-controls={`${section.key}-panel`}
                data-testid={`nav-item-${section.key}`}
                centered={true}
              >
                {section.name}
              </NavItem>
            ))}
          </div>
          <div className="flex-shrink-0" role="group" aria-label="Section visibility controls">
            <SectionsDropdown
              trigger={
                <div className="relative" role="group" aria-label="Section visibility controls" style={{ display: 'inline-block' }}>
                  <button
                    className="flex items-center gap-2 text-gray-600 font-bold tracking-wide rounded px-3 py-1 bg-white focus:outline-none focus:ring-0"
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={false}
                    aria-label="Sections dropdown"
                    data-testid="sections-dropdown-button"
                  >
                    Sections
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" className="svg-inline--fa fa-chevron-down w-3 h-3 ml-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>
                  </button>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HorizontalNavNew; 