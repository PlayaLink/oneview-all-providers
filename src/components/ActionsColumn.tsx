import React, { useRef } from 'react';
import Icon from "@/components/ui/Icon";
import { useGridActions, GridAction } from "@/hooks/useGridActions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        <span className="text-gray-400 text-xs">No actions</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
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
          
          if (!action.icon) {
            // Warning: Icon not found for action
            return null;
          }

          return (
            <Tooltip key={gridAction.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onActionClick(action.name, rowData)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  data-testid={`action-${action.name}`}
                  data-referenceid={`action-${action.name}-${rowData.id}`}
                  aria-label={action.tooltip}
                  title={action.tooltip}
                >
                  <Icon 
                    icon={action.icon} 
                    className="w-4 h-4 text-gray-600 hover:text-gray-800" 
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
    </TooltipProvider>
  );
};

export default ActionsColumn;
