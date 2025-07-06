import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = true,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`flex pb-4 flex-col items-start gap-2 self-stretch ${className}`}
    >
      {/* Header */}
      <div onClick={() => setIsExpanded(!isExpanded)} role="collapsible-header" className="flex py-2 px-4 items-center gap-3 self-stretch rounded bg-[#CFD8DC]">
        <div className="flex items-center gap-[10px] flex-1">
          <div className="text-[#545454] text-xs font-bold leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
            {title}
          </div>
        </div>
        <button
          className="flex w-[18px] py-[6px] flex-col items-center gap-[10px] hover:opacity-70 transition-opacity"
        >
          <div className="flex h-2 pb-[1px] justify-center items-center">
            <FontAwesomeIcon
              icon={isExpanded ? faAngleUp : faAngleDown}
              className="text-[#545454] text-xl"
            />
          </div>
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="flex p-2 flex-col items-start gap-2 self-stretch">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
