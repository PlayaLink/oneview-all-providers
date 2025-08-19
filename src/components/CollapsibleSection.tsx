import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

// Helper to convert a string to sentence case
function toSentenceCase(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const sectionId = `collapsible-section-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const contentId = `${sectionId}-content`;

  return (
    <section
      className={`flex pb-4 flex-col items-start gap-2 self-stretch ${className}`}
      role="region"
      aria-labelledby={`${sectionId}-header`}
      data-testid="collapsible-section"
    >
      {/* Header */}
      <header 
        onClick={() => setIsExpanded(!isExpanded)} 
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        aria-label={`Toggle ${title} section`}
        className="flex py-2 px-4 items-center gap-3 self-stretch rounded bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        data-testid="collapsible-section-header"
      >
        <div className="flex items-center gap-[10px] flex-1">
          <h3 
            id={`${sectionId}-header`}
            className="text-gray-600 text-xs font-bold leading-normal tracking-wide font-['Poppins',sans-serif]"
          >
            {toSentenceCase(title)}
          </h3>
        </div>
        <div
          className="flex w-[18px] py-[6px] flex-col items-center gap-[10px] hover:opacity-70 transition-opacity"
          aria-hidden="true"
        >
          <div className="flex h-2 pb-[1px] justify-center items-center">
            <FontAwesomeIcon
              icon={isExpanded ? faAngleUp : faAngleDown}
              className="text-gray-600 text-xl"
              aria-label={isExpanded ? "Collapse section" : "Expand section"}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      {isExpanded && (
        <div 
          id={contentId}
          className="flex p-2 flex-col items-start gap-2 self-stretch"
          role="region"
          aria-labelledby={`${sectionId}-header`}
          data-testid="collapsible-section-content"
        >
          {children}
        </div>
      )}
    </section>
  );
};

export default CollapsibleSection;
