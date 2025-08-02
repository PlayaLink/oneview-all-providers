import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-enterprise";
import Icon from "@/components/ui/Icon";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { useGridActions } from "@/hooks/useGridActions";
import ContextMenu from "./ContextMenu";
import ActionsColumn from "./ActionsColumn";

// Import AG Grid styles with Quartz theme
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-quartz.css";

// Custom Actions Header Component
const ActionsHeader: React.FC<{
  onAddRecord?: () => void;
  onMoreActions?: () => void;
  onHelp?: () => void;
}> = ({ onAddRecord, onMoreActions, onHelp }) => {
  return (
    <div
      className="flex items-center justify-between w-full h-full"
      data-testid="actions-header"
      role="columnheader"
      aria-label="Actions column header"
    >
      <div className="flex items-center gap-2">
        <span className="ag-header-cell-text" data-testid="actions-header-text">
          Actions
        </span>
        <button
          onClick={onHelp}
          className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
          data-testid="actions-help-button"
          data-referenceid="actions-help"
          aria-label="Help for actions"
          title="Help for actions"
        >
          <Icon icon="circle-exclamation" className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onAddRecord}
          className="w-6 h-6 bg-[#79AC48] hover:bg-[#6B9A3F] rounded transition-colors flex items-center justify-center"
          data-testid="actions-add-button"
          data-referenceid="actions-add"
          aria-label="Add new record"
          title="Add new record"
        >
          <Icon icon="plus" className="w-3 h-3 text-white" />
        </button>
        <button
          onClick={onMoreActions}
          className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center"
          data-testid="actions-more-button"
          data-referenceid="actions-more"
          aria-label="More actions"
          title="More actions"
        >
          <Icon icon="ellipsis-vertical" className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

interface DataGridProps {
  title: string;
  icon: string;
  data: any[];
  columns: ColDef[];
  onSelectionChanged?: (event: any) => void;
  onRowClicked?: (data: any) => void;
  height?: string | number;
  showCheckboxes?: boolean;
  showStatusBadges?: boolean;
  selectedRowId?: string | null;
  handleShowFacilityDetails?: (facility: any) => void;
  showActionsColumn?: boolean;
  onDownload?: (data: any) => void;
  onToggleAlert?: (data: any, enabled: boolean) => void;
  onToggleSidebar?: (data: any) => void;
  onToggleFlag?: (data: any, flagged: boolean) => void;
  onToggleSummary?: (data: any, included: boolean) => void;
  onAddRecord?: () => void;
  onMoreHeaderActions?: () => void;
  /** Whether to pin the actions column to the right */
  pinActionsColumn?: boolean;
  /** Callback to open the detail modal */
  onOpenDetailModal?: (rowData: any) => void;
}

const DataGrid: React.FC<DataGridProps> = (props) => {
  const {
    title,
    icon,
    data,
    columns,
    onSelectionChanged,
    onRowClicked,
    height,
    showCheckboxes = true,
    showStatusBadges = true,
    selectedRowId: controlledSelectedRowId,
    handleShowFacilityDetails,
    showActionsColumn = true,
    onDownload,
    onToggleAlert,
    onToggleSidebar,
    onToggleFlag,
    onToggleSummary,
    onAddRecord,
    onMoreHeaderActions,
    pinActionsColumn = true,
    onOpenDetailModal,
  } = props;

  // Collapsible state
  const [isExpanded, setIsExpanded] = React.useState(true);

  const [internalSelectedRowId, setInternalSelectedRowId] = React.useState<
    string | null
  >(null);
  const selectedRowId =
    controlledSelectedRowId !== undefined
      ? controlledSelectedRowId
      : internalSelectedRowId;

  // Context menu state
  const [contextMenu, setContextMenu] = React.useState<{
    show: boolean;
    x: number;
    y: number;
    rowData: any;
  } | null>(null);

  // Column state persistence
  const [gridApi, setGridApi] = React.useState<any>(null);
  const gridStateKey = `ag-grid-state-${title}`;

  // Use feature flag for floating filters
  const { value: showFloatingFilters } = useFeatureFlag("floating_filters");

  // Get actual actions for this grid
  const { gridActions } = useGridActions(title);

  // Calculate actions column width based on number of actions
  const minWidthActionsColumn = 165;
  const calculateActionsColumnWidth = React.useCallback(() => {
    if (!showActionsColumn || !pinActionsColumn) return 120;

    // Each action button width (adjust this value to change action button size)
    // Plus some padding for the container
    const actionWidth = 32; // Width per action button
    const containerPadding = 16; // Padding on each side

    // Use actual action count from the grid
    const actualActions = gridActions?.length; // Fallback to 4 if not loaded yet

    return Math.min(
      Math.max(
        minWidthActionsColumn,
        actualActions * actionWidth + containerPadding,
      ),
      300,
    );
  }, [showActionsColumn, pinActionsColumn, title, gridActions]);

  // Prepare column definitions
  const columnDefs = React.useMemo(() => {
    const hasSort = columns.some((col) => col.sort);

    return [
      // Checkbox column
      ...(showCheckboxes
        ? [
            {
              headerName: "",
              headerCheckboxSelection: true,
              checkboxSelection: true,
              width: 50,
              pinned: "left" as const,
              lockPosition: true,
              suppressMenu: true,
              sortable: false,
              filter: false,
              resizable: false,
            },
          ]
        : []),

      // Data columns
      ...columns.map((col) => {
        const baseCol = {
          ...col,
          floatingFilter: showFloatingFilters,
          suppressMenu: false,
          filter: true,
          resizable: true,
          sortable: true,
        };

        // Set default sort for provider_name if no sort is specified
        if (!hasSort && col.field === "provider_name") {
          baseCol.sort = "asc";
        }

        return baseCol;
      }),

      // Actions column - only show when pinActionsColumn is true
      ...(showActionsColumn && pinActionsColumn
        ? [
            {
              headerName: "",
              field: "actions",
              width: calculateActionsColumnWidth(), // Dynamic width: 32px per action + 16px padding
              minWidth: minWidthActionsColumn, // Minimum width
              maxWidth: 300, // Maximum width
              suppressSizeToFit: true, // Prevent AG Grid from auto-sizing this column
              pinned: "right" as const,
              lockPosition: true,
              suppressMenu: true,
              sortable: false,
              filter: false,
              resizable: false,
              floatingFilter: false,
              suppressRowClickSelection: true,
              headerComponent: (params: any) => (
                <ActionsHeader
                  onAddRecord={onAddRecord}
                  onMoreActions={onMoreHeaderActions}
                  onHelp={() => {}}
                />
              ),
              cellRenderer: (params: any) => (
                <ActionsColumn
                  gridName={title}
                  rowData={params.data}
                  onActionClick={(actionName, rowData) => {
                    switch (actionName) {
                      case "download":
                        onDownload?.(rowData);
                        break;
                      case "activate":
                        onDownload?.(rowData);
                        break;
                      case "alert":
                        onToggleAlert?.(rowData, true);
                        break;
                      case "side_panel":
                        onToggleSidebar?.(rowData);
                        break;
                      case "verifications":
                        onToggleFlag?.(rowData, true);
                        break;
                      case "flag":
                        onToggleFlag?.(rowData, true);
                        break;
                      case "view_details":
                        // Open the grid item details modal
                        onOpenDetailModal?.(rowData);
                        break;
                      case "deactivate":
                        break;
                      case "exclude":
                        break;
                      case "tracking":
                        break;
                      default:
                    }
                  }}
                  className="h-full flex items-center justify-center"
                />
              ),
            },
          ]
        : []),
    ];
  }, [
    columns,
    showCheckboxes,
    showFloatingFilters,
    showActionsColumn,
    onDownload,
    onToggleAlert,
    onToggleSidebar,
    onToggleFlag,
    onToggleSummary,
    onAddRecord,
    onMoreHeaderActions,
    pinActionsColumn,
    onOpenDetailModal,
    calculateActionsColumnWidth,
  ]);

  const isActionsColumnClickedRef = React.useRef(false);

  const handleCellClicked = (event: any) => {
    // If the click is on the actions column, set a flag to prevent row click
    if (event.column && event.column.getColId() === "actions") {
      isActionsColumnClickedRef.current = true;
      return;
    }
  };

  const handleRowClicked = (event: any) => {
    // Check if we just clicked on the actions column
    if (isActionsColumnClickedRef.current) {
      isActionsColumnClickedRef.current = false; // Reset the flag
      return;
    }
    event.api.setFocusedCell(null, null);

    if (selectedRowId === event.data.id) {
      if (controlledSelectedRowId === undefined) {
        setInternalSelectedRowId(null);
      }
      if (onRowClicked) {
        onRowClicked(null);
      }
      return;
    }

    if (controlledSelectedRowId === undefined) {
      setInternalSelectedRowId(event.data.id);
    }

    if (onRowClicked && event.data) {
      onRowClicked(event.data);
    }
  };

  const handleSelectionChanged = (event: any) => {
    if (onSelectionChanged) {
      onSelectionChanged(event);
    }
    if (controlledSelectedRowId === undefined) {
      setInternalSelectedRowId(null);
    }
  };

  const handleCellContextMenu = (event: any) => {
    event.event.preventDefault();
    const rowData = event.data;
    if (!rowData) return;

    setContextMenu({
      show: true,
      x: event.event.clientX,
      y: event.event.clientY,
      rowData: rowData,
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  // Save column state to localStorage
  const saveColumnState = React.useCallback(() => {
    if (gridApi) {
      const columnState = gridApi.getColumnState();
      localStorage.setItem(gridStateKey, JSON.stringify(columnState));
    }
  }, [gridApi, gridStateKey]);

  // Load column state from localStorage
  const loadColumnState = React.useCallback(() => {
    if (gridApi) {
      const savedState = localStorage.getItem(gridStateKey);
      if (savedState) {
        try {
          const columnState = JSON.parse(savedState);
          gridApi.applyColumnState({
            state: columnState,
            applyOrder: true,
            applyVisible: true,
            applySize: true,
            applySort: true,
            applyFilter: true,
          });
        } catch (error) {
          console.warn("Failed to load column state:", error);
        }
      }
    }
  }, [gridApi, gridStateKey]);

  const getRowStyle = (params: any) => {
    const baseStyle = {
      borderBottom: "0.5px solid #D2D5DC",
      backgroundColor: "white",
    };

    const isRowSelected = selectedRowId === params.data.id;

    if (isRowSelected) {
      return {
        ...baseStyle,
        backgroundColor: "#C4D8F7",
      };
    }

    if (params.node.isSelected()) {
      return {
        ...baseStyle,
        backgroundColor: "#E3F2FD",
      };
    }

    return baseStyle;
  };

  const getRowClass = (params: any) => {
    if (params.node.isSelected()) {
      return "checkbox-selected";
    }
    if (selectedRowId === params.data.id) {
      return "row-selected";
    }
    return "";
  };

  const computedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <section
      className="bg-white"
      role="region"
      aria-label={`${title} data grid`}
      data-testid="data-grid"
    >
      {/* Grid Header */}
      <header
        className="flex items-center justify-between pl-1 pr-3 py-[9px] bg-[#CFD8DC] border-b border-gray-300 flex-shrink-0 rounded-t overflow-hidden cursor-pointer hover:bg-[#B0BEC5] transition-colors"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`Toggle ${title} grid`}
        data-testid="grid-header"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex items-center gap-2 pl-4">
          <Icon
            icon={icon}
            className="pr-1 w-4 h-4 text-[#545454]"
            aria-hidden="true"
          />
          <h2 className="text-[#545454] font-semibold text-xs tracking-wider">
            {title}
          </h2>
          <div
            className="flex w-[18px] py-[6px] flex-col items-center gap-[10px] hover:opacity-70 transition-opacity"
            aria-hidden="true"
          >
            <div className="flex h-2 pb-[1px] justify-center items-center">
              <Icon
                icon={isExpanded ? "angle-up" : "angle-down"}
                className="text-[#545454] text-xl"
                aria-label={isExpanded ? "Collapse grid" : "Expand grid"}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {showStatusBadges && (
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Status indicators"
            >
              <div
                className="flex items-center gap-1 px-2.5 py-0.5 bg-[#F48100] rounded-full"
                role="status"
                aria-label="1 item expiring"
              >
                <span className="text-white font-bold text-xs">1</span>
                <span className="text-white font-bold text-xs">Expiring</span>
              </div>
              <div
                className="flex items-center gap-1 px-2.5 py-0.5 bg-[#DB0D00] rounded-full"
                role="status"
                aria-label="1 item expired"
              >
                <span className="text-white font-bold text-xs">1</span>
                <span className="text-white font-bold text-xs">Expired</span>
              </div>
              <div
                className="flex items-center gap-1 px-2.5 py-0.5 bg-[#545454] rounded-full"
                role="status"
                aria-label="900+ total items"
              >
                <span className="text-white font-bold text-xs">900+</span>
                <span className="text-white font-bold text-xs">Total</span>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <div
              className="w-9 h-5 bg-[#79AC48] rounded-full relative"
              role="switch"
              aria-label="Toggle view mode"
              aria-checked="true"
            >
              <div
                className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"
                aria-hidden="true"
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* AG Grid Container */}
      {isExpanded && (
        <div
          className="ag-theme-quartz"
          style={
            {
              width: "100%",
              ...(height ? { height: computedHeight } : {}),
            } as React.CSSProperties
          }
          role="grid"
          aria-label={`${title} data table`}
          aria-rowcount={data.length}
          aria-colcount={columnDefs.length}
          data-testid="ag-grid-container"
          onContextMenu={(e) => e.preventDefault()}
        >
        <AgGridReact
          theme="legacy"
          rowData={data}
          columnDefs={columnDefs}
          onSelectionChanged={handleSelectionChanged}
          onRowClicked={handleRowClicked}
          onCellClicked={handleCellClicked}
          onCellContextMenu={handleCellContextMenu}
          rowSelection={showCheckboxes ? "multiple" : undefined}
          headerHeight={40}
          rowHeight={42}
          suppressRowClickSelection={true}
          suppressCellFocus={true}
          {...(!height ? { domLayout: "autoHeight" } : {})}
          getRowStyle={getRowStyle}
          getRowClass={getRowClass}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            floatingFilter: showFloatingFilters,
            cellClass: "ag-cell-vertically-centered",
            filterParams: {
              buttons: ["reset"],
              closeOnApply: true,
              suppressApplyButton: true,
            },
          }}
          suppressColumnVirtualisation={false}
          cellSelection={false}
          maintainColumnOrder={true}
          onGridReady={(params) => {
            setGridApi(params.api);
            params.api.sizeColumnsToFit();
            // Load saved column state after grid is ready
            setTimeout(() => {
              loadColumnState();
            }, 100);
          }}
          onColumnMoved={saveColumnState}
          onColumnResized={saveColumnState}
          onSortChanged={saveColumnState}
          onFilterChanged={saveColumnState}
        />
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          rowData={contextMenu.rowData}
          gridName={title}
          onClose={handleContextMenuClose}
          handleShowFacilityDetails={handleShowFacilityDetails}
        />
      )}
    </section>
  );
};

export default DataGrid;
