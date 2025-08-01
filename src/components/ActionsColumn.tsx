import React from 'react';
import Icon from "@/components/ui/Icon";
import { useGridActions, GridAction } from "@/hooks/useGridActions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionsColumnProps {
  gridName: string;
  rowData: any;
  onActionClick: (actionName: string, rowData: any) => void;
  className?: string;
}

const ActionsColumn: React.FC<ActionsColumnProps> = ({ 
  gridName, 
  rowData, 
  onActionClick, 
  className = "" 
}) => {
  const { gridActions, isLoading, error } = useGridActions(gridName);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center gap-1 ${className}`} data-testid="actions-column-loading">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading grid actions:', error);
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
        className={`ag-cell flex items-center justify-center gap-1 ${className}`} 
        data-testid="actions-column"
        role="group"
        aria-label={`Actions for ${gridName}`}
      >
        {gridActions.map((gridAction: GridAction) => {
          const { action } = gridAction;
          
          if (!action.icon) {
            console.warn(`Icon not found for action: ${action.name}`);
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
