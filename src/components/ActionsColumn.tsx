import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleDown,
  faBell,
  faBellSlash,
  faFlag,
  faEllipsisVertical,
  faCircleExclamation,
  faPlus,
  faColumns,
} from "@fortawesome/free-solid-svg-icons";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ActionsColumnProps {
  rowData: any;
  onDownload?: (data: any) => void;
  onToggleAlert?: (data: any, enabled: boolean) => void;
  onToggleSidebar?: (data: any) => void;
  onToggleFlag?: (data: any, flagged: boolean) => void;
  onToggleSummary?: (data: any, included: boolean) => void;
  onMoreActions?: (data: any) => void;
}

interface ActionsHeaderProps {
  onAddRecord?: () => void;
  onMoreHeaderActions?: () => void;
}

export const ActionsHeader: React.FC<ActionsHeaderProps> = ({
  onAddRecord,
  onMoreHeaderActions,
}) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-[#545454] font-bold text-[13px] font-[Poppins]">
          Actions
        </span>
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="w-5 h-5 text-[#545454]"
          aria-label="Actions info"
        />
      </div>
      
      <div className="flex items-center gap-2">
        {onAddRecord && (
          <button
            onClick={onAddRecord}
            className="flex items-center justify-center w-6 h-6 bg-[#79AC48] rounded px-2 py-1.5"
            aria-label="Add Record"
            data-testid="add-record-button"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3 h-3 text-white" />
          </button>
        )}
        
        {onMoreHeaderActions && (
          <button
            onClick={onMoreHeaderActions}
            className="flex items-center justify-center w-5 h-5"
            aria-label="More header actions"
            data-testid="more-header-actions-button"
          >
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className="w-5 h-5 text-[#545454]"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export const ActionsCell: React.FC<ActionsColumnProps> = ({
  rowData,
  onDownload,
  onToggleAlert,
  onToggleSidebar,
  onToggleFlag,
  onToggleSummary,
}) => {
  const [alertEnabled, setAlertEnabled] = React.useState(true);
  const [flagged, setFlagged] = React.useState(false);
  const [summaryIncluded, setSummaryIncluded] = React.useState(true);

  const handleDownload = () => {
    onDownload?.(rowData);
  };

  const handleToggleAlert = () => {
    const newState = !alertEnabled;
    setAlertEnabled(newState);
    onToggleAlert?.(rowData, newState);
  };

  const handleToggleSidebar = () => {
    onToggleSidebar?.(rowData);
  };

  const handleToggleFlag = () => {
    const newState = !flagged;
    setFlagged(newState);
    onToggleFlag?.(rowData, newState);
  };

  const handleToggleSummary = (checked: boolean) => {
    setSummaryIncluded(checked);
    onToggleSummary?.(rowData, checked);
  };

  return (
    <div className="flex items-center justify-end gap-2 w-full px-4">
      {/* Download */}
      <button
        onClick={handleDownload}
        className="flex items-center justify-center w-5 h-5"
        aria-label="Download"
        data-testid="download-action"
      >
        <FontAwesomeIcon
          icon={faCircleDown}
          className="w-5 h-5 text-[#545454] hover:text-[#3BA8D1] transition-colors"
        />
      </button>

      {/* Alert Toggle */}
      <button
        onClick={handleToggleAlert}
        className="flex items-center justify-center w-5 h-5"
        aria-label={alertEnabled ? "Disable alerts" : "Enable alerts"}
        data-testid="alert-toggle"
      >
        <FontAwesomeIcon
          icon={alertEnabled ? faBell : faBellSlash}
          className="w-5 h-5 text-[#545454] hover:text-[#3BA8D1] transition-colors"
        />
      </button>

      {/* Sidebar Toggle */}
      <button
        onClick={handleToggleSidebar}
        className="flex items-center justify-center w-5 h-5"
        aria-label="Toggle sidebar"
        data-testid="sidebar-toggle"
      >
        <FontAwesomeIcon
          icon={faColumns}
          className="w-5 h-5 text-[#545454] hover:text-[#3BA8D1] transition-colors"
        />
      </button>

      {/* Flag Toggle */}
      <button
        onClick={handleToggleFlag}
        className="flex items-center justify-center w-5 h-5"
        aria-label={flagged ? "Unflag item" : "Flag item"}
        data-testid="flag-toggle"
      >
        <FontAwesomeIcon
          icon={faFlag}
          className={cn(
            "w-5 h-5 transition-colors",
            flagged ? "text-[#DB0D00]" : "text-[#545454] hover:text-[#3BA8D1]"
          )}
        />
      </button>

      {/* Summary Toggle */}
      <div className="flex items-center justify-center">
        <Switch
          checked={summaryIncluded}
          onCheckedChange={handleToggleSummary}
          className="data-[state=checked]:bg-[#79AC48] data-[state=unchecked]:bg-[#D2D5DC] h-3 w-[23px] border-0"
          aria-label="Include in summary"
          data-testid="summary-toggle"
        />
      </div>
    </div>
  );
};
