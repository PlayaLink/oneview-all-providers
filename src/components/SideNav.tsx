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
import NavItem from "@/components/NavItem";

interface SideNavProps {
  collapsed: boolean;
  selectedItem: string | null;
  selectedSection: string | null;
  onItemSelect: (item: string) => void;
  onSectionSelect: (section: string) => void;
  gridSections: any[];
  gridDefs: any[];
}

const SideNav: React.FC<SideNavProps> = (props) => {
  console.log('[SideNav] props:', props);
  const {
    collapsed,
    selectedItem,
    selectedSection,
    onItemSelect,
    onSectionSelect,
    gridSections,
    gridDefs,
  } = props;
  // Use gridSections for ordering and display
  const orderedSections = React.useMemo(() => {
    return [...(gridSections || [])].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
  }, [gridSections]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    (gridSections || []).forEach(section => {
      initial[section.key] = true;
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
                  <NavItem
                    active={isItemActive("all-sections")}
                    onClick={() => handleItemClick("all-sections")}
                    aria-label="View all sections"
                    aria-pressed={isItemActive("all-sections")}
                    data-testid="all-sections-button"
                    variant="main"
                    className={cn(
                      "w-full text-left p-2",
                      isItemActive("all-sections")
                        ? "bg-[#008BC9] text-white"
                        : "hover:bg-gray-50"
                    )}
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
                  </NavItem>
                }
              />
            </div>

            {/* Dynamic Sections based on gridDefinitions */}
            {/* Only show groups and grids matching the current filter (if any) */}
            {orderedSections.map((section) => {
              // Only show group if at least one grid in group matches filter (or no filter)
              console.log('Rendering group:', section.key);
              let gridsInGroup = gridDefs.filter((g: any) => g.group === section.key);
              if (sectionFilters && sectionFilters.size > 0) {
                gridsInGroup = gridsInGroup.filter((g: any) => sectionFilters.has(g.table_name || g.key));
                if (gridsInGroup.length === 0) return null;
              }
              return (
                <div key={section.key} className="flex flex-col">
                  <NavItem
                    active={isSectionActive(section.key)}
                    onClick={() => handleSectionClick(section.key)}
                    aria-label={`Select ${section.name} section`}
                    aria-pressed={isSectionActive(section.key)}
                    data-testid={`section-button-${section.key.toLowerCase().replace(/\s+/g, '-')}`}
                    variant="main"
                    className={cn(
                      "w-full text-left p-2 flex items-center justify-between rounded cursor-pointer",
                      isSectionActive(section.key)
                        ? "font-bold bg-[#008BC9] text-white"
                        : "font-normal hover:bg-gray-50 text-[#545454]"
                    )}
                    uppercase
                    size="sm"
                  >
                    {section.name}
                  </NavItem>
                  {expandedSections[section.key] && (
                    <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                      {gridsInGroup.map((grid) => (
                        <NavItem
                          key={grid.key || grid.table_name}
                          active={isItemActive(grid.key || grid.table_name)}
                          onClick={() => handleItemClick(grid.key || grid.table_name)}
                          aria-label={`View ${(grid.display_name || grid.table_name).replace(/_/g, " ")} grid`}
                          aria-pressed={isItemActive(grid.key || grid.table_name)}
                          data-testid={`grid-button-${(grid.key || grid.table_name).toLowerCase().replace(/_/g, '-')}`}
                          variant="main"
                          className={cn(
                            "w-full text-left p-2 gap-2 font-normal", // Remove bold, set font-normal
                            isItemActive(grid.key || grid.table_name)
                              ? "bg-[#008BC9] text-white"
                              : "text-[#545454] hover:bg-gray-50"
                          )}
                          icon={<FontAwesomeIcon icon={getIconByName(grid.icon)} className="w-4 h-4" />}
                        >
                          <span className="text-xs">
                            {(grid.display_name || grid.table_name).replace(/_/g, " ")}
                          </span>
                        </NavItem>
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
