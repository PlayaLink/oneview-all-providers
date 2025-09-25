import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Icon from "@/components/ui/Icon";
import {
  Tooltip,
  TooltipContent,
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
  count?: number;
}

const SidePanelTabLegacy: React.FC<SidePanelTabLegacyProps> = ({
  rowKey,
  fullLabel,
  iconLabel,
  icon,
  className = "",
  isActive = false,
  count,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip open={isHovered}>
      <TooltipTrigger asChild>
          <div
            className={cn(
              "flex w-full flex-col items-center justify-center gap-2 border-l border-b border-gray-200 px-1 py-5 transition-all duration-200 cursor-pointer",
              {
                // Active state (selected)
                "bg-gray-50": isActive && !isHovered,
                // Hover state
                "bg-gray-200": isHovered,
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
            <Icon
              icon={icon}
              className={cn("w-6 h-6 transition-colors", {
                "text-blue-600": isActive || isHovered,
                "text-gray-600": !isActive && !isHovered,
              })}
              aria-hidden="true"
            />
            {count !== undefined && (
              <div 
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  {
                    "bg-blue-600 text-white": isActive || isHovered,
                    "text-gray-600 font-semibold": !isActive && !isHovered,
                  }
                )}
                data-testid={`tab-count-legacy-${rowKey}`}
                aria-label={`${count} items`}
              >
                {count}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          className="bg-gray-600 text-white text-xs font-medium px-3 py-1.5 rounded border-none shadow-md"
          sideOffset={8}
        >
          {fullLabel}
        </TooltipContent>
      </Tooltip>
  );
};

export default SidePanelTabLegacy;
