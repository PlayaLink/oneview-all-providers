import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { gridDefinitions, getGroups, getGridsByGroup } from "@/lib/gridDefinitions";
import { getIconByName } from "@/lib/iconMapping";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";

interface SideNavProps {
  collapsed: boolean;
  selectedItem: string | null;
  selectedSection: string | null;
  onItemSelect: (item: string) => void;
  onSectionSelect: (section: string) => void;
}

const SideNav: React.FC<SideNavProps> = ({
  collapsed,
  selectedItem,
  selectedSection,
  onItemSelect,
  onSectionSelect,
}) => {
  // Get groups from gridDefinitions
  const groups = getGroups();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    groups.forEach(group => {
      initial[group] = true;
    });
    return initial;
  });

  const { value: isLeftNav, isLoading: navLoading } = useFeatureFlag("left_nav");

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
    <div className="h-full overflow-hidden" role="navigation" aria-label="Sidebar Navigation" data-testid="side-nav">
      <div className="h-full px-2 pt-4 flex flex-col gap-2 overflow-y-auto">
        {!collapsed && (
          <>
            {/* All Sections Header */}
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
                icon={faEllipsis}
                className={cn(
                  "w-4 h-4",
                  isItemActive("all-sections")
                    ? "text-white"
                    : "text-[#545454]",
                )}
              />
            </button>

            {/* Dynamic Sections based on gridDefinitions */}
            {groups.map((group) => {
              const gridsInGroup = getGridsByGroup(group);
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
                          key={grid.tableName}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded cursor-pointer w-full text-left bg-transparent border-none",
                            isItemActive(grid.tableName)
                              ? "bg-[#008BC9] text-white"
                              : "text-[#545454] hover:bg-gray-50",
                          )}
                          onClick={() => handleItemClick(grid.tableName)}
                          aria-label={`View ${grid.tableName.replace(/_/g, " ")} grid`}
                          aria-pressed={isItemActive(grid.tableName)}
                          data-testid={`grid-button-${grid.tableName.toLowerCase().replace(/_/g, '-')}`}
                        >
                          <FontAwesomeIcon 
                            icon={getIconByName(grid.icon)} 
                            className="w-4 h-4" 
                          />
                          <span className="text-xs font-semibold">
                            {grid.tableName.replace(/_/g, " ")}
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
