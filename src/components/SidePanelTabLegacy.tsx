import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "@/lib/iconMapping";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface SidePanelTabLegacyProps {
  rowKey: string;
  fullLabel: string;
  iconLabel: string;
  icon: string;
  className?: string;
  isActive?: boolean;
}

const SidePanelTabLegacy: React.FC<SidePanelTabLegacyProps> = ({
  rowKey,
  fullLabel,
  iconLabel,
  icon,
  className = "",
  isActive = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={isHovered}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex h-[52px] w-full flex-col items-center justify-center gap-2 border-l border-b border-[#EAECEF] p-1 transition-all duration-200 cursor-pointer",
              {
                // Active state (selected)
                "bg-[#F7F7F7]": isActive && !isHovered,
                // Hover state
                "bg-[#EAECEF]": isHovered,
                // Default state
                "bg-white": !isActive && !isHovered,
                // Right border for non-active tabs
                "border-r": !isActive,
              },
              className,
            )}
            data-testid={`tab-title-legacy-${rowKey}`}
            role="tab"
            aria-label={`${fullLabel} tab`}
            aria-selected={isActive}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <FontAwesomeIcon
              icon={getIconByName(icon)}
              className={cn("w-5 h-5 transition-colors", {
                "text-[#008BC9]": isActive || isHovered,
                "text-[#545454]": !isActive && !isHovered,
              })}
              aria-hidden="true"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-[#545454] text-white text-xs font-medium px-3 py-1.5 rounded border-none shadow-md"
          sideOffset={8}
        >
          {fullLabel}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidePanelTabLegacy;
