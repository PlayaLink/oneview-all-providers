import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { gridDefinitions, getGroups, getGridsByGroup } from "@/lib/gridDefinitions";
import { getIconByName } from "@/lib/iconMapping";

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
  
  // State for collapsible sections - initialize all sections as expanded
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(() => {
    const initial: Record<string, boolean> = {};
    groups.forEach(group => {
      initial[group] = true;
    });
    return initial;
  });

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
      <div className="h-full p-2 flex flex-col gap-2 overflow-y-auto">
        {!collapsed && (
          <>
            {/* All Sections Header */}
            <div
              className={cn(
                "flex items-center justify-between p-2 rounded cursor-pointer",
                isItemActive("all-sections")
                  ? "bg-[#008BC9] text-white"
                  : "hover:bg-gray-50",
              )}
              onClick={() => handleItemClick("all-sections")}
            >
              <span
                className={cn(
                  "font-bold text-sm tracking-wide",
                  isItemActive("all-sections")
                    ? "text-white"
                    : "text-[#545454]",
                )}
              >
                All Sections
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
            </div>

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
                  >
                    <span
                      className={cn(
                        "text-xs uppercase font-medium tracking-wide flex-1",
                        isSectionActive(group)
                          ? "text-white"
                          : "text-[#545454]",
                      )}
                      onClick={() => handleSectionClick(group)}
                    >
                      {group}
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        !expandedSections[group] && "rotate-180",
                        isSectionActive(group)
                          ? "text-white"
                          : "text-[#545454]",
                      )}
                      onClick={() => toggleSection(group)}
                    />
                  </div>
                  {expandedSections[group] && (
                    <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                      {gridsInGroup.map((grid) => (
                        <div
                          key={grid.tableName}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded cursor-pointer",
                            isItemActive(grid.tableName)
                              ? "bg-[#008BC9] text-white"
                              : "text-[#545454] hover:bg-gray-50",
                          )}
                          onClick={() => handleItemClick(grid.tableName)}
                        >
                          <FontAwesomeIcon 
                            icon={getIconByName(grid.icon)} 
                            className="w-4 h-4" 
                          />
                          <span className="text-xs font-semibold">
                            {grid.tableName.replace(/_/g, " ")}
                          </span>
                        </div>
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
