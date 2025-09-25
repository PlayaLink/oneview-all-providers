import React, { useRef } from 'react';
import Icon from "@/components/ui/Icon";
import { useGridActions, GridAction } from "@/hooks/useGridActions";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Action icon mapping based on action names
const ACTION_ICON_MAP: Record<string, string> = {
  'side_panel': 'sidebar-flip',
  'verifications': 'shield-check',
  'download': 'circle-down',
  'activate': 'circle-plus',
  'toggle_on': 'toggle-on',
  'alert': 'bell',
  'flag': 'flag',
  'tracking': 'star-half-stroke',
  'toggle_off': 'toggle-off',
  'deactivate': 'circle-x',
  'view_details': 'pen-to-square',
  'exclude': 'times-circle'
};

interface ActionsColumnProps {
  gridKey: string;
  rowData: any;
  onActionClick: (actionName: string, rowData: any) => void;
  className?: string;
  excludeActions?: string[];
}

const ActionsColumn: React.FC<ActionsColumnProps> = ({ 
  gridKey, 
  rowData, 
  onActionClick, 
  className = "",
  excludeActions = []
}) => {
  const { gridActions, isLoading, error } = useGridActions(gridKey);
  const containerRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center gap-1 ${className}`} data-testid="actions-column-loading">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    // Error: Error loading grid actions for gridKey
    return (
      <div className={`flex items-center justify-center ${className}`} data-testid="actions-column-error">
        <span className="text-red-500 text-xs">Error</span>
      </div>
    );
  }

  if (!gridActions || gridActions.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} data-testid="actions-column-empty">
        <span className="text-gray-800 text-xs">No actions</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`flex items-center justify-center gap-1 ${className}`} 
      data-testid="actions-column"
      role="group"
      aria-label={`Actions for ${gridKey}`}
    >
      {gridActions
        .filter((gridAction: GridAction) => !excludeActions.includes(gridAction.action.name))
        .map((gridAction: GridAction) => {
    
        const { action } = gridAction;
        
        // Get icon from mapping object instead of database
        const iconName = ACTION_ICON_MAP[action.name];
        
        if (!iconName) {
          // Warning: Icon not found for action
          return null;
        }

        return (
          <Tooltip key={gridAction.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onActionClick(action.name, rowData)}
                className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                data-testid={`action-${action.name}`}
                data-referenceid={`action-${action.name}-${rowData.id}`}
                aria-label={action.tooltip}
              >
                <Icon 
                  icon={iconName} 
                  className="w-4 h-4 text-gray-800 hover:text-gray-900" 
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{action.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ActionsColumn;
