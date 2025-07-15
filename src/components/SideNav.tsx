import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { getIconByName } from "@/lib/iconMapping";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import SectionsDropdown from "@/components/SectionsDropdown";
import { useSectionFilterStore } from "@/lib/useVisibleSectionsStore";

interface SideNavProps {
  collapsed: boolean;
  selectedItem: string | null;
  selectedSection: string | null;
  onItemSelect: (item: string) => void;
  onSectionSelect: (section: string) => void;
  gridSections: any[];
  gridDefs: any[];
}

const SideNav: React.FC<SideNavProps> = ({
  collapsed,
  selectedItem,
  selectedSection,
  onItemSelect,
  onSectionSelect,
  gridSections,
  gridDefs,
}) => {
  // Helper functions for backend-driven data
  const getGroups = () => Array.from(new Set(gridDefs.map((g: any) => g.group)));
  const getGridsByGroup = (group: string) => gridDefs.filter((g: any) => g.group === group);
  
  // Get groups from backend grid definitions
  const groups = getGroups();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    groups.forEach(group => {
      initial[group] = true;
    });
    return initial;
  });

  const { value: isLeftNav, isLoading: navLoading } = useFeatureFlag("left_nav");

  // Use sectionFilters from Zustand store
  const sectionFilters = useSectionFilterStore((s) => s.sectionFilters);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleItemClick = (item: string) => {
    onItemSelect(item);
  };

  const handleSectionClick = (section: string) => {
    onSectionSelect(section);
  };

  const isItemActive = (item: string) => selectedItem === item;
  const isSectionActive = (section: string) => selectedSection === section;

  return (
    <div className="flex flex-col h-full min-h-0" role="navigation" aria-label="Sidebar Navigation" data-testid="side-nav">
      <div className="flex-1 min-h-0 px-2 pt-4 flex flex-col gap-2 overflow-y-scroll max-h-screen pb-20">
        {!collapsed && (
          <>
            {/* All Sections Header */}
            <div style={{ position: 'relative', width: '100%' }}>
              <SectionsDropdown
                placement="right-start"
                trigger={
                  <button
                    className={cn(
                      "flex items-center justify-between p-2 rounded cursor-pointer w-full text-left bg-transparent border-none",
                      isItemActive("all-sections")
                        ? "bg-[#008BC9] text-white"
                        : "hover:bg-gray-50",
                    )}
                    onClick={() => handleItemClick("all-sections")}
                    aria-label="View all sections"
                    aria-pressed={isItemActive("all-sections")}
                    data-testid="all-sections-button"
                  >
                    <span
                      className={cn(
                        "font-bold text-sm tracking-wide",
                        isItemActive("all-sections")
                          ? "text-white"
                          : "text-[#545454]",
                      )}
                      role="all-sections-button-text"
                    >
                      {navLoading || isLeftNav ? 'All Records' : 'All Sections'}
                    </span>
                    <FontAwesomeIcon
                      data-test="left-nav-sections-dropdown-trigger"
                      icon={faEllipsis}
                      className={cn(
                        "w-4 h-4",
                        isItemActive("all-sections")
                          ? "text-white"
                          : "text-[#545454]",
                      )}
                    />
                  </button>
                }
              />
            </div>

            {/* Dynamic Sections based on gridDefinitions */}
            {/* Only show groups and grids matching the current filter (if any) */}
            {groups.map((group) => {
              // Only show group if at least one grid in group matches filter (or no filter)
              let gridsInGroup = getGridsByGroup(group);
              if (sectionFilters && sectionFilters.size > 0) {
                gridsInGroup = gridsInGroup.filter((g: any) => sectionFilters.has(g.table_name || g.key));
                if (gridsInGroup.length === 0) return null;
              }
              return (
                <div key={group} className="flex flex-col">
                  <div
                    className={cn(
                      "flex items-center justify-between p-2 rounded cursor-pointer",
                      isSectionActive(group)
                        ? "bg-[#008BC9] text-white"
                        : "hover:bg-gray-50",
                    )}
                    role="group"
                    aria-label={`${group} section`}
                  >
                    <button
                      className={cn(
                        "text-xs uppercase font-medium tracking-wide flex-1 text-left bg-transparent border-none cursor-pointer",
                        isSectionActive(group)
                          ? "text-white"
                          : "text-[#545454]",
                      )}
                      onClick={() => handleSectionClick(group)}
                      aria-label={`Select ${group} section`}
                      aria-pressed={isSectionActive(group)}
                      data-testid={`section-button-${group.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {group}
                    </button>
                  </div>
                  {expandedSections[group] && (
                    <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                      {gridsInGroup.map((grid) => (
                        <button
                          key={grid.key || grid.table_name}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded cursor-pointer w-full text-left bg-transparent border-none",
                            isItemActive(grid.key || grid.table_name)
                              ? "bg-[#008BC9] text-white"
                              : "text-[#545454] hover:bg-gray-50",
                          )}
                          onClick={() => handleItemClick(grid.key || grid.table_name)}
                          aria-label={`View ${(grid.display_name || grid.table_name).replace(/_/g, " ")} grid`}
                          aria-pressed={isItemActive(grid.key || grid.table_name)}
                          data-testid={`grid-button-${(grid.key || grid.table_name).toLowerCase().replace(/_/g, '-')}`}
                        >
                          <FontAwesomeIcon 
                            icon={getIconByName(grid.icon)} 
                            className="w-4 h-4" 
                          />
                          <span className="text-xs font-semibold">
                            {(grid.display_name || grid.table_name).replace(/_/g, " ")}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default SideNav;
