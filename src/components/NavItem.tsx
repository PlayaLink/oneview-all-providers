import React from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "@/lib/iconMapping";

interface NavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: "main" | "horizontal";
  size?: "md" | "sm";
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode; // Optional icon prop
  settingsIcon?: React.ReactNode | false; // Optional settings icon prop, can be false
  uppercase?: boolean; // Optional prop to make text uppercase
}

const NavItem: React.FC<NavItemProps> = ({
  active = false,
  variant = "main",
  size = "md",
  children,
  className = "",
  icon, // Destructure icon
  settingsIcon = false, // Default to false
  uppercase = false, // Default to false
  ...props
}) => {
  let baseStyles = "font-semibold rounded transition-colors";
  let variantStyles = "";
  let sizeStyles = "";

  if (variant === "main") {
    variantStyles = active
      ? "bg-white text-[#3BA8D1]"
      : "text-white hover:bg-[#ffffff22]";
    sizeStyles = size === "sm" ? "text-xs px-2 py-1" : "text-sm px-2 py-1";
  } else if (variant === "horizontal") {
    variantStyles = active
      ? "bg-[#008BC9] text-white"
      : "text-[#545454] hover:bg-[#E0F2FB]";
    sizeStyles = size === "sm" ? "text-xs px-3 py-1.5" : "text-sm px-4 py-2";
  }

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
        baseStyles,
        variantStyles,
        sizeStyles,
        "w-full flex items-center justify-between gap-2", // Ensure flex layout for alignment
        className
      )}
      aria-current={active ? "page" : undefined}
      aria-pressed={active ? "true" : "false"}
      data-testid={`nav-item-${typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : 'default'}`}
      {...props}
    >
      <span className="flex items-center min-w-0" style={{flex: 1}}>
        {icon && (
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