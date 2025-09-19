import React from "react";
import ActionsColumn from "./ActionsColumn";
import Icon from "@/components/ui/Icon";
import ProviderSearch from "./ProviderSearch";

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
  const headerClassName =
    context === "sidepanel"
      ? "flex justify-between px-4 pb-1 pt-4 border-b border-gray-200"
      : "flex flex-row items-center justify-between pb-1 flex-shrink-0 border-b border-gray-300";
  return (
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
          <div className="flex flex-row justify-start my-2">
            <ActionsColumn
              gridKey={gridKey}
              rowData={rowData}
              onActionClick={onActionClick}
              className="justify-start"
              excludeActions={["side_panel", "view_details", "deactivate", "activate"]}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row justify-end">
                   {/* Expand icon button - only for sidepanel context */}
      {context === "sidepanel" && onExpandDetailModal && (
        <button
          onClick={onExpandDetailModal}
          className="px-2 pb-2 pt-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          aria-label="Expand details modal"
          data-testid="expand-detail-modal-button"
        >
          <Icon
            icon="expand"
            className="w-5 h-5"
          />
        </button>
      )}
      {/* Close icon button - only for sidepanel context */}
      {context === "sidepanel" && (
        <button
          onClick={onClose}
          className={`pl-2 pr-4 pb-2 pt-1 rounded-full transition-colors hover:bg-white hover:bg-opacity-20`}
          aria-label={`Close sidepanel`}
          data-testid={`close-sidepanel-button`}
        >
          <Icon icon="xmark" className="w-5 h-5" />
        </button>
      )}
        </div>
      </div>
    </div>
  );
};

export default GridItemDetailsHeader; 