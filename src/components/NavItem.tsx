import React from "react";
import { cn } from "@/lib/utils";

interface NavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: "main" | "horizontal";
  size?: "md" | "sm";
  children: React.ReactNode;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  active = false,
  variant = "main",
  size = "md",
  children,
  className = "",
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
      className={cn(baseStyles, variantStyles, sizeStyles, className)}
      {...props}
    >
      {content}
    </button>
  );
};

export default NavItem; 