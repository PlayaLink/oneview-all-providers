import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-enterprise";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faEllipsisVertical, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import ContextMenu from "./ContextMenu";
import ActionsColumn from "./ActionsColumn";

// Import AG Grid styles with Balham theme
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-balham.css";

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
        <span 
          className="ag-header-cell-text"
          data-testid="actions-header-text"
        >
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
          <FontAwesomeIcon 
            icon={faCircleExclamation} 
            className="w-4 h-4" 
          />
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
          <FontAwesomeIcon 
            icon={faPlus} 
            className="w-3 h-3 text-white" 
          />
        </button>
        <button
          onClick={onMoreActions}
          className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center"
          data-testid="actions-more-button"
          data-referenceid="actions-more"
          aria-label="More actions"
          title="More actions"
        >
          <FontAwesomeIcon 
            icon={faEllipsisVertical} 
            className="w-3 h-3" 
          />
        </button>
      </div>
    </div>
  );
};

interface DataGridProps {
  title: string;
  icon: IconDefinition;
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
  } = props;

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

  // Use feature flag for floating filters
  const { value: showFloatingFilters } = useFeatureFlag("floating_filters");

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
      
      // Actions column
      ...(showActionsColumn
        ? [
            {
              headerName: "",
              field: "actions",
              width: 194,
              pinned: "right" as const,
              lockPosition: true,
              suppressMenu: true,
              sortable: false,
              filter: false,
              resizable: false,
              floatingFilter: false,
              headerComponent: (params: any) => (
                <ActionsHeader
                  onAddRecord={onAddRecord}
                  onMoreActions={onMoreHeaderActions}
                  onHelp={() => console.log('Help clicked for', title)}
                />
              ),
              cellRenderer: (params: any) => (
                <ActionsColumn
                  gridName={title}
                  rowData={params.data}
                  onActionClick={(actionName, rowData) => {
                    switch (actionName) {
                      case 'download':
                        onDownload?.(rowData);
                        break;
                      case 'activate':
                        onDownload?.(rowData);
                        break;
                      case 'alert':
                        onToggleAlert?.(rowData, true);
                        break;
                      case 'side_panel':
                        onToggleSidebar?.(rowData);
                        break;
                      case 'verifications':
                        onToggleFlag?.(rowData, true);
                        break;
                      case 'flag':
                        onToggleFlag?.(rowData, true);
                        break;
                      case 'view_details':
                        onToggleSummary?.(rowData, true);
                        break;
                      case 'deactivate':
                        console.log('Deactivate action clicked for row:', rowData);
                        break;
                      case 'exclude':
                        console.log('Exclude action clicked for row:', rowData);
                        break;
                      case 'tracking':
                        console.log('Tracking action clicked for row:', rowData);
                        break;
                      default:
                        console.log(`Action ${actionName} clicked for row:`, rowData);
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
  ]);

  const handleRowClicked = (event: any) => {
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

  const getRowStyle = (params: any) => {
    const baseStyle = {
      borderBottom: "0.5px solid #D2D5DC",
      backgroundColor: "white",
    };

    const isRowSelected = selectedRowId === params.data.id;

    if (isRowSelected) {
      return {
        ...baseStyle,
        backgroundColor: "#008BC9",
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
        className="flex items-center justify-between pl-1 pr-3 py-[9px] bg-[#CFD8DC] border-b border-gray-300 flex-shrink-0 rounded-t overflow-hidden"
        role="grid-header"
        aria-label="Grid header"
        data-testid="grid-header"
      >
        <div className="flex items-center gap-2 pl-4">
          <FontAwesomeIcon
            icon={icon}
            className="pr-1 w-4 h-4 text-[#545454]"
            aria-hidden="true"
          />
          <h2 className="text-[#545454] font-semibold text-xs tracking-wider">
            {title}
          </h2>
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
      <div
        className="ag-theme-balham"
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
          rowData={data}
          columnDefs={columnDefs}
          onSelectionChanged={handleSelectionChanged}
          onRowClicked={handleRowClicked}
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
          }}
          suppressColumnVirtualisation={false}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
      
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
