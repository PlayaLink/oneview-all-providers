import React from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface CollapsibleSideNavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  uppercase?: boolean;
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

const CollapsibleSideNavItem: React.FC<CollapsibleSideNavItemProps> = ({
  active = false,
  expanded = true,
  onClick,
  onToggle,
  uppercase = false,
  children,
  className = "",
  "data-testid": dataTestId,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(
        "w-full text-left p-2 flex items-center justify-between rounded cursor-pointer transition-colors",
        active ? "bg-[#008BC9] text-white" : "font-normal hover:bg-gray-50 text-[#545454]",
        className
      )}
      aria-current={active ? "page" : undefined}
      aria-pressed={active ? "true" : "false"}
      aria-expanded={expanded}
      onClick={onClick}
      data-testid={dataTestId}
      role="treeitem"
      {...props}
    >
      <span className={cn("flex-1 truncate text-sm", uppercase && "uppercase")} data-testid="collapsible-sidenavitem-content">
        {children}
      </span>
      {typeof expanded === "boolean" && onToggle && (
        <span
          className={cn("ml-2 flex items-center transition-transform", expanded ? "rotate-0" : "-rotate-90")}
          role="button"
          aria-label={expanded ? "Collapse section" : "Expand section"}
          tabIndex={-1}
          onClick={e => { e.stopPropagation(); onToggle(); }}
          data-testid="collapsible-sidenavitem-chevron"
        >
          <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3" />
        </span>
      )}
    </button>
  );
};

export default CollapsibleSideNavItem; 