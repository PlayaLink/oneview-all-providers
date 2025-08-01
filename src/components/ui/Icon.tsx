import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { getIconByName, isCustomIcon } from "@/lib/iconMapping";

interface IconProps {
  icon: string;
  className?: string;
  size?: "xs" | "sm" | "lg" | "1x" | "2x" | "3x" | "4x" | "5x" | "6x" | "7x" | "8x" | "9x" | "10x";
  [key: string]: any; // Allow other props to be passed through
}

const Icon: React.FC<IconProps> = ({ 
  icon, 
  className = "", 
  size = "1x",
  ...props 
}) => {
  const iconData = getIconByName(icon);
  
  // Check if it's a custom SVG icon (returns a string path)
  if (isCustomIcon(icon)) {
    return (
      <img 
        src={iconData as string}
        alt={icon}
        className={className}
        {...props}
      />
    );
  }
  
  // Otherwise it's a FontAwesome icon
  return (
    <FontAwesomeIcon 
      icon={iconData as IconDefinition} 
      size={size}
      className={className}
      {...props}
    />
  );
};

export default Icon;