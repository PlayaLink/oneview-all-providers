import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "@/lib/iconMapping";

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
  isActive = false
}) => {
  return (
    <div 
      className={`flex flex-col items-center gap-1 py-6 px-2 w-full transition-colors rounded ${
        isActive 
          ? 'bg-[#D32F2F] text-white hover:bg-[#B71C1C]' // Red for selected state
          : 'text-[#545454] hover:bg-gray-100'
      } ${className}`}
      data-testid={`tab-title-legacy-${rowKey}`}
      role="tab"
      aria-label={`${fullLabel} tab`}
      aria-selected={isActive}
    >
      <FontAwesomeIcon 
        icon={getIconByName(icon)} 
        className="w-6 h-6 mb-1" 
        aria-hidden="true"
      />
      <span className="text-xs">{iconLabel}</span>
    </div>
  );
};

export default SidePanelTabLegacy; 