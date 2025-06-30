import React from "react";
import { cn } from "@/lib/utils";
import SectionsDropdown from "./SectionsDropdown";
import { getGroups, getVisibleGroups } from "@/lib/gridDefinitions";
import NavItem from "@/components/NavItem";

interface HorizontalNavProps {
  selectedSection: string | null;
  onSectionSelect: (section: string) => void;
  visibleSections?: Set<string>;
  onSectionVisibilityChange?: (sectionKey: string, visible: boolean) => void;
}

const HorizontalNav: React.FC<HorizontalNavProps> = ({
  selectedSection,
  onSectionSelect,
  visibleSections = new Set(),
  onSectionVisibilityChange = () => {},
}) => {
  // Get all groups from the grid configuration
  const allGroups = getGroups();
  
  // Get visible groups (groups that have at least one visible grid)
  const visibleGroups = getVisibleGroups(visibleSections);

  // Filter sections based on visibility
  // If no sections are selected, show all groups
  // If sections are selected, only show groups that have visible grids
  const visibleSectionList =
    visibleSections.size === 0
      ? allGroups
      : visibleGroups;

  return (
    <div className="bg-white border-b border-gray-300">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto flex-1">
            {visibleSectionList.map((section) => (
              <NavItem
                key={section}
                variant="horizontal"
                size="sm"
                active={selectedSection === section}
                onClick={() => onSectionSelect(section)}
              >
                {section.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())}
              </NavItem>
            ))}
          </div>
          <div className="flex-shrink-0">
            <SectionsDropdown
              visibleSections={visibleSections}
              onSectionVisibilityChange={onSectionVisibilityChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalNav;
