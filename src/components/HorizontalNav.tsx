import React from "react";
import { cn } from "@/lib/utils";
import SectionsDropdown from "./SectionsDropdown";
import NavItem from "@/components/NavItem";

interface GridSection {
  id: string;
  key: string;
  name: string;
  order: number;
}

interface HorizontalNavProps {
  gridSections: GridSection[];
  selectedSection: string | null;
  onSectionSelect: (sectionKey: string) => void;
  visibleSections?: Set<string>;
  onSectionVisibilityChange?: (sectionKey: string, visible: boolean) => void;
}

const HorizontalNav: React.FC<HorizontalNavProps> = ({
  gridSections,
  selectedSection,
  onSectionSelect,
  visibleSections = new Set(),
  onSectionVisibilityChange = () => {},
}) => {
  // Optionally filter by visibleSections if you want to support hiding sections
  const visibleSectionList =
    visibleSections.size === 0
      ? gridSections
      : gridSections.filter(section => visibleSections.has(section.key));

  return (
    <nav className="bg-white border-b border-gray-300" role="navigation" aria-label="Section navigation" data-testid="horizontal-nav">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto flex-1" role="tablist" aria-label="Available sections">
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
              >
                {section.name}
              </NavItem>
            ))}
          </div>
          <div className="flex-shrink-0" role="group" aria-label="Section visibility controls">
            <SectionsDropdown
              visibleSections={visibleSections}
              onSectionVisibilityChange={onSectionVisibilityChange}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HorizontalNav;
