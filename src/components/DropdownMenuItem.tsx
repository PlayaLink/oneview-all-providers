import React from "react";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface DropdownMenuItemProps {
  icon?: string;
  name: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  selected?: boolean;
  type?: "checkbox" | "radio" | "action";
  children?: React.ReactNode;
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  icon,
  name,
  onClick,
  disabled = false,
  className = "",
  selected = false,
  type = "action",
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center justify-start gap-2 px-2 py-1 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      role="menuitem"
      aria-label={name}
      data-testid={`dropdown-menu-item-${name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Icon Space - 20px width for consistency */}
      <div className="flex w-5 h-4 justify-center items-center flex-shrink-0">
        {type === "checkbox" || type === "radio" ? (
          selected && (
            <Icon 
              icon="check" 
              className="w-4 h-4 text-[#202938]" 
              aria-hidden="true"
            />
          )
        ) : (
          icon && (
            <Icon 
              icon={icon} 
              className="w-4 h-4 text-[#202938]" 
              aria-hidden="true"
            />
          )
        )}
      </div>

      {/* Text Content */}
      <div className="flex items-center gap-2 flex-1">
        <span
          className="text-xs font-medium tracking-[0.429px] text-[#202938]"
          style={{
            fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
          }}
        >
          {name}
        </span>
      </div>

      {/* Additional content (like keyboard shortcuts) */}
      {children}
    </button>
  );
};

export default DropdownMenuItem;
