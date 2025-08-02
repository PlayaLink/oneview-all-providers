import React from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "@/lib/iconMapping";

interface NavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: "global" | "horizontal" | "sidenav";
  size?: "md" | "sm";
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode; // Optional icon prop
  settingsIcon?: React.ReactNode | false; // Optional settings icon prop, can be false
  uppercase?: boolean; // Optional prop to make text uppercase
  centered?: boolean; // Optional prop to center content
  settingsDropdown?: React.ReactNode; // Optional custom settings dropdown/menu
}

const NAVITEM_VARIANTS = {
  global: {
    base: "font-bold rounded transition-colors select-none px-4 py-2 text-sm w-full flex items-center gap-2",
    active: "bg-white text-[#3BA8D1]",
    inactive: "text-white hover:bg-[#5CB9DA]",
    alignment: "justify-start",
  },
  horizontal: {
    base: "transition-colors select-none px-4 py-2.5 text-xs tracking-[0.429px] w-full flex items-center gap-2 rounded-t border border-gray-300 border-transparent border-b-0 font-normal",
    active:
      "bg-white border-gray-300 border-t border-r border-l",
    inactive: "text-[#1565c0] font-normal hover:bg-[#E0F2FB]",
    alignment: "justify-center",
  },
  sidenav: {
    base: "font-bold rounded transition-colors select-none px-4 py-2 text-sm w-full flex items-center gap-2",
    active: "bg-[#008BC9] text-white",
    inactive: "text-[#545454] hover:bg-gray-50",
    alignment: "justify-start",
  },
};

const NavItem: React.FC<NavItemProps> = ({
  active = false,
  variant = "sidenav",
  size = "md",
  children,
  className = "",
  icon, // Destructure icon
  settingsIcon = false, // Default to false
  uppercase = false, // Default to false
  centered = false, // Default to false
  settingsDropdown,
  ...props
}) => {
  let variantStyles = NAVITEM_VARIANTS[variant];
  if (!variantStyles) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Unknown NavItem variant: ${variant}, defaulting to 'sidenav'`);
    }
    variantStyles = NAVITEM_VARIANTS.sidenav;
  }
  const stateStyles = active ? variantStyles.active : variantStyles.inactive;

  // Always render CAQH in all caps
  let content = children;
  if (
    typeof children === "string" &&
    children.trim().toLowerCase() === "caqh"
  ) {
    content = children.toUpperCase();
  }

  return (
    <button
      className={cn(
        variantStyles.base,
        stateStyles,
        variantStyles.alignment,
        className
      )}
      aria-current={active ? "page" : undefined}
      aria-pressed={active ? "true" : "false"}
      data-testid={`nav-item-${typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : 'default'}`}
      {...props}
    >
      <span className={cn("flex items-center min-w-0", variantStyles.alignment)}>
        {icon && variant === "sidenav" && (
          <span
            className="mr-2 flex items-center"
            role="img"
            aria-label="icon"
            data-testid="nav-item-icon"
          >
            {icon}
          </span>
        )}
        <span className={`truncate${uppercase ? ' uppercase' : ''}`} data-testid="nav-item-content">{content}</span>
      </span>
      {settingsDropdown && (
        <span className="ml-auto flex items-center" data-testid="nav-item-settings-dropdown">
          {settingsDropdown}
        </span>
      )}
      {settingsIcon !== false && settingsIcon !== undefined && (
        <span
          className="ml-auto flex items-center"
          role="img"
          aria-label="settings"
          data-testid="nav-item-settings-icon"
        >
          {settingsIcon}
        </span>
      )}
    </button>
  );
};

export default NavItem; 