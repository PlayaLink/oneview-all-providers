import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "@/lib/iconMapping";

export interface SidePanelTabProps {
  rowKey: string;
  fullLabel: string;
  iconLabel: string;
  icon: string;
  className?: string;
  isActive?: boolean;
  count?: number;
}

const SidePanelTab: React.FC<SidePanelTabProps> = ({ 
  rowKey, 
  fullLabel, 
  iconLabel, 
  icon, 
  className = "",
  isActive = false,
  count
}) => {
  return (
    <div 
      className={`flex flex-col items-center gap-1 py-6 px-2 w-full transition-colors rounded ${
        isActive 
          ? 'bg-[#008BC9] text-white hover:bg-[#0077B3]' 
          : 'text-[#545454] hover:bg-gray-100'
      } ${className}`}
      data-testid={`tab-title-${rowKey}`}
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
      {count !== undefined && (
        <div 
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            isActive 
              ? 'bg-white text-[#008BC9]' 
              : 'bg-[#545454] text-white'
          }`}
          data-testid={`tab-count-${rowKey}`}
          aria-label={`${count} items`}
        >
          {count}
        </div>
      )}
    </div>
  );
};

export default SidePanelTab; 