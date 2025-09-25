import React from "react";
import ActionsColumn from "./ActionsColumn";
import IconButton from "./ui/IconButton";
import ProviderSearch from "./ProviderSearch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "@/lib/localStorageUtils";

interface GridItemDetailsHeaderProps {
  headerText: string;
  context: "sidepanel" | "modal";
  onExpandDetailModal?: () => void;
  onClose: () => void;
  gridKey?: string;
  rowData?: any;
  onActionClick?: (actionName: string, rowData: any) => void;
  isCreateMode?: boolean;
  /** Provider selection controls for create mode on non-provider_info grids */
  selectedProvider?: any;
  onSelectProvider?: (provider: any) => void;
  onClearSelectedProvider?: () => void;
}

const GridItemDetailsHeader: React.FC<GridItemDetailsHeaderProps> = ({
  headerText,
  context,
  onExpandDetailModal,
  onClose,
  gridKey,
  rowData,
  onActionClick,
  isCreateMode = false,
  selectedProvider,
  onSelectProvider,
  onClearSelectedProvider,
}) => {
  const [showRowDetailsInModal, setShowRowDetailsInModal] = useLocalStorage(
    LOCAL_STORAGE_KEYS.SHOW_ROW_DETAILS_IN_MODAL,
    false
  );
  const headerClassName =
    context === "sidepanel"
      ? "flex justify-between px-4 pb-1 pt-4 border-b border-gray-200"
      : "flex flex-row items-center justify-between pb-1 flex-shrink-0 border-b border-gray-300";
  return (
    <TooltipProvider>
      <div
        className={headerClassName}
        data-testid={`grid-item-details-header-${context}`}
      >
        <div className="flex-1 flex-col">
          <h2 className="text-lg font-bold text-gray-700 tracking-wider mr-2">{headerText}</h2>
          {/* Provider Search - create mode only for non-provider_info grids */}
          {isCreateMode && gridKey !== "provider_info" && onSelectProvider && (
            <div
              className="mt-4 mb-4"
              role="region"
              aria-label="Select Provider"
              data-testid="provider-selector-header"
              data-referenceid="provider-selector-header"
            >
              <ProviderSearch
                className="w-[450px]"
                placeholder="Search for a provider to associate with this new record..."
                onSelect={onSelectProvider}
                onClear={onClearSelectedProvider}
                isCreateMode={isCreateMode}
              />
            </div>
          )}
          {gridKey && rowData && onActionClick && !isCreateMode && (
            <div className="flex flex-row justify-between items-center my-2">
              <ActionsColumn
                className="justify-start"
                gridKey={gridKey}
                rowData={rowData}
                onActionClick={onActionClick}
                excludeActions={["side_panel", "view_details", "deactivate", "activate"]}
              />
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRowDetailsInModal}
                  onChange={(e) => setShowRowDetailsInModal(e.target.checked)}
                  className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
                  data-testid="open-modal-by-default-checkbox"
                  data-referenceid="open-modal-by-default-checkbox"
                />
                Open modal by default
              </label>
            </div>

          )}
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-end">
            {/* Expand icon button - only for sidepanel context */}
            {context === "sidepanel" && onExpandDetailModal && (
              <Tooltip>
                <TooltipTrigger>
                  <IconButton
                    icon="expand"
                    onClick={onExpandDetailModal}
                    aria-label="Expand details modal"
                    data-testid="expand-detail-modal-button"
                    data-referenceid="expand-detail-modal-button"
                  />
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p>Expand to modal</p>
                </TooltipContent>
              </Tooltip>
            )}
            {/* Close icon button - only for sidepanel context */}
            {context === "sidepanel" && (
              <IconButton
                icon="xmark"
                onClick={onClose}
                aria-label="Close sidepanel"
                data-testid="close-sidepanel-button"
                data-referenceid="close-sidepanel-button"
              />
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default GridItemDetailsHeader; 