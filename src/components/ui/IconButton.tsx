import React from "react";
import { cn } from "@/lib/utils";
import Icon from "./Icon";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost" | "outline";
  hoverColor?: "blue" | "gray" | "red" | "green";
  "data-testid"?: string;
  "data-referenceid"?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = "md",
  variant = "default",
  hoverColor = "blue",
  className,
  children,
  "data-testid": dataTestId,
  "data-referenceid": dataReferenceId,
  ...props
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10"
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const hoverColorClasses = {
    blue: "hover:bg-blue-50 focus:ring-blue-500",
    gray: "hover:bg-gray-50 focus:ring-gray-500", 
    red: "hover:bg-red-50 focus:ring-red-500",
    green: "hover:bg-green-50 focus:ring-green-500"
  };

  const variantClasses = {
    default: "text-gray-600 hover:text-gray-800",
    ghost: "text-gray-500 hover:text-gray-700",
    outline: "text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400"
  };

  return (
    <button
      className={cn(
        // Base styles
        "flex items-center justify-center rounded transition-colors  focus:ring-2 focus:ring-offset-2",
        // Size
        sizeClasses[size],
        // Hover color
        hoverColorClasses[hoverColor],
        // Variant
        variantClasses[variant],
        className
      )}
      data-testid={dataTestId}
      data-referenceid={dataReferenceId}
      {...props}
    >
      <Icon 
        icon={icon} 
        className={cn(
          iconSizeClasses[size],
          variantClasses[variant]
        )} 
      />
      {children}
    </button>
  );
};

export default IconButton;
