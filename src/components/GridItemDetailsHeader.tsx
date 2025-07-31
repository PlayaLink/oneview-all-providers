import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter, faXmark } from "@fortawesome/free-solid-svg-icons";
import ActionsColumn from "./ActionsColumn";

interface GridItemDetailsHeaderProps {
  headerText: string;
  context: "sidepanel" | "modal";
  onExpandDetailModal?: () => void;
  onClose: () => void;
  gridName?: string;
  rowData?: any;
  onActionClick?: (actionName: string, rowData: any) => void;
}

const GridItemDetailsHeader: React.FC<GridItemDetailsHeaderProps> = ({
  headerText,
  context,
  onExpandDetailModal,
  onClose,
  gridName,
  rowData,
  onActionClick,
}) => {
  const headerClassName =
    context === "sidepanel"
      ? "flex justify-between px-4 pb-1 border-b border-gray-200"
      : "flex flex-row items-center justify-between pb-4 flex-shrink-0 border-b border-gray-200";

  return (
    <div
      className={headerClassName}
      data-testid={`grid-item-details-header-${context}`}
    >
      <div className="flex-1">
        <h2 className="flex items-start gap-2 text-lg font-bold text-gray-700 tracking-wider mr-2">{headerText}</h2>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row justify-end">
                   {/* Expand icon button - only for sidepanel context */}
      {context === "sidepanel" && onExpandDetailModal && (
        <button
          onClick={onExpandDetailModal}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          aria-label="Expand details modal"
          data-testid="expand-detail-modal-button"
        >
          <FontAwesomeIcon
            icon={faUpRightAndDownLeftFromCenter}
            className="w-5 h-5"
          />
        </button>
      )}
      {/* Close icon button - only for sidepanel context */}
      {context === "sidepanel" && (
        <button
          onClick={onClose}
          className={`p-2 rounded-full transition-colors hover:bg-white hover:bg-opacity-20`}
          aria-label={`Close sidepanel`}
          data-testid={`close-sidepanel-button`}
        >
          <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
        </button>
      )}
        </div>
         {/* Actions Column below header text */}
         {gridName && rowData && onActionClick && (
          <div className="mt-1">
            <ActionsColumn
              gridName={gridName}
              rowData={rowData}
              onActionClick={onActionClick}
              className="justify-start"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GridItemDetailsHeader; 