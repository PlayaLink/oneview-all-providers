import React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  SelectionChangedEvent,
  RowClickedEvent,
  RowDoubleClickedEvent,
} from "ag-grid-community";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import type { ColumnMenuTab } from "ag-grid-community";
import ContextMenu from "./ContextMenu";

// Import AG Grid styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface DataGridProps {
  title: string;
  icon: IconDefinition;
  data: any[];
  columns: ColDef[];
  onSelectionChanged?: (event: SelectionChangedEvent) => void;
  onRowClicked?: (data: any) => void;
  height?: string | number;
  showCheckboxes?: boolean;
  showStatusBadges?: boolean;
  selectedRowId?: string | null;
  handleShowFacilityDetails?: (facility: any) => void;
}

const DataGrid: React.FC<DataGridProps> = (props) => {
  const {
    title,
    icon,
    data,
    columns,
    onSelectionChanged,
    onRowClicked,
    height, // removed = "400px"
    showCheckboxes = true,
    showStatusBadges = true,
    selectedRowId: controlledSelectedRowId,
    handleShowFacilityDetails,
  } = props;

  const [internalSelectedRowId, setInternalSelectedRowId] = React.useState<string | null>(null);
  const selectedRowId = controlledSelectedRowId !== undefined ? controlledSelectedRowId : internalSelectedRowId;

  // Context menu state
  const [contextMenu, setContextMenu] = React.useState<{
    show: boolean;
    x: number;
    y: number;
    rowData: any;
  } | null>(null);

  // Use feature flag for floating filters
  const { value: showFloatingFilters } = useFeatureFlag("floating_filters");

  // Prepare column definitions with optional checkbox column
  const columnDefs = React.useMemo(() => {
    // Check if any column has sort set
    const hasSort = columns.some(col => col.sort);
    return [
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
              cellClass: "ag-cell-no-border",
              headerClass: "ag-header-no-border",
              floatingFilter: false, // never show floating filter for checkbox column
            },
          ]
        : []),
      ...columns.map((col) => {
        // If no sort is set anywhere, set provider_name to ascending
        if (!hasSort && col.field === 'provider_name') {
          return {
            ...col,
            sort: 'asc' as 'asc', // Explicitly cast to SortDirection
            floatingFilter: showFloatingFilters,
            suppressMenu: false,
            filter: true,
            menuTabs: [
              'filterMenuTab',
              'generalMenuTab',
              'columnsMenuTab',
            ] as ColumnMenuTab[],
            cellStyle: (params: any) => {
              const baseCellStyle = {
                color: "#545454",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                paddingLeft: "16px",
                borderRight: "none",
                ...col.cellStyle,
              };
              const isRowSelected = selectedRowId === params.data.id;
              if (isRowSelected) {
                return {
                  ...baseCellStyle,
                  color: "white",
                };
              }
              return baseCellStyle;
            },
          };
        }
        return {
          ...col,
          floatingFilter: showFloatingFilters,
          suppressMenu: false,
          filter: true,
          menuTabs: [
            'filterMenuTab',
            'generalMenuTab',
            'columnsMenuTab',
          ] as ColumnMenuTab[],
          cellStyle: (params: any) => {
            const baseCellStyle = {
              color: "#545454",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "16px",
              borderRight: "none",
              ...col.cellStyle,
            };
            const isRowSelected = selectedRowId === params.data.id;
            if (isRowSelected) {
              return {
                ...baseCellStyle,
                color: "white",
              };
            }
            return baseCellStyle;
          },
        };
      }),
    ];
  }, [columns, showCheckboxes, showFloatingFilters, selectedRowId]);



  const handleRowClicked = (event: RowClickedEvent) => {
    // Prevent cell focus on single click
    event.api.setFocusedCell(null, null);
    
    // Always set row selection on row click
    if (controlledSelectedRowId === undefined) {
      setInternalSelectedRowId(event.data.id);
    }
    
    // Call onRowClicked callback
    if (onRowClicked && event.data) {
      onRowClicked(event.data);
    }
  };

  const handleSelectionChanged = (event: SelectionChangedEvent) => {
    if (onSelectionChanged) {
      onSelectionChanged(event);
    }
    // When checkbox selection changes, clear row selection
    if (controlledSelectedRowId === undefined) {
      setInternalSelectedRowId(null);
    }
  };

  const handleRowDoubleClicked = (event: RowDoubleClickedEvent) => {
    // Allow cell focus only on double click
    // This will let AG Grid handle cell focus naturally
  };

  const handleCellContextMenu = (event: any) => {
    // Prevent default browser context menu
    event.event.preventDefault();
    
    // Get the row data
    const rowData = event.data;
    if (!rowData) return;
    
    // Set context menu position and data
    setContextMenu({
      show: true,
      x: event.event.clientX,
      y: event.event.clientY,
      rowData: rowData
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

    // Check if this is row selection (not checkbox selection)
    const isRowSelected = selectedRowId === params.data.id;
    
    if (isRowSelected) {
      // Dark blue background for row selection (same as horizontal nav)
      return {
        ...baseStyle,
        backgroundColor: "#008BC9",
      };
    }

    // Check if this is checkbox selection
    if (params.node.isSelected()) {
      // Light blue background for checkbox selection
      return {
        ...baseStyle,
        backgroundColor: "#E3F2FD",
      };
    }

    return baseStyle;
  };

  const getRowClass = (params: any) => {
    // Check if this is checkbox selection
    if (params.node.isSelected()) {
      return 'checkbox-selected';
    }
    
    // Check if this is row selection
    if (selectedRowId === params.data.id) {
      return 'row-selected';
    }
    
    return '';
  };

  // Convert height to string with px if it's a number
  const computedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <section className="bg-white" role="region" aria-label={`${title} data grid`} data-testid="data-grid">
      {/* Grid Header */}
      <header className="flex items-center justify-between pl-1 pr-3 py-[9px] bg-[#CFD8DC] border-b border-gray-300 flex-shrink-0 rounded-t overflow-hidden" role="grid-header" aria-label="Grid header" data-testid="grid-header">
        <div className="flex items-center gap-2 pl-4">
          <FontAwesomeIcon icon={icon} className="pr-1 w-4 h-4 text-[#545454]" aria-hidden="true" />
          <h2 className="text-[#545454] font-semibold text-xs tracking-wider">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {showStatusBadges && (
            <div className="flex items-center gap-2" role="group" aria-label="Status indicators">
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#F48100] rounded-full" role="status" aria-label="1 item expiring">
                <span className="text-white font-bold text-xs">1</span>
                <span className="text-white font-bold text-xs">Expiring</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#DB0D00] rounded-full" role="status" aria-label="1 item expired">
                <span className="text-white font-bold text-xs">1</span>
                <span className="text-white font-bold text-xs">Expired</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#545454] rounded-full" role="status" aria-label="900+ total items">
                <span className="text-white font-bold text-xs">900+</span>
                <span className="text-white font-bold text-xs">Total</span>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <div className="w-9 h-5 bg-[#79AC48] rounded-full relative" role="switch" aria-label="Toggle view mode" aria-checked="true">
              <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </header>


      {/* AG Grid Container */}
      <div
        className="ag-theme-alpine ag-grid-custom"
        style={{ 
          width: '100%',
          ...(height ? { height: computedHeight } : {})
        } as React.CSSProperties}
        role="grid"
        aria-label={`${title} data table`}
        aria-rowcount={data.length}
        aria-colcount={columnDefs.length}
        data-testid="ag-grid-container"
        data-debug-height={computedHeight}
        data-debug-rowcount={data.length}
        data-debug-colcount={columnDefs.length}
        onContextMenu={(e) => e.preventDefault()}
      >
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          onSelectionChanged={handleSelectionChanged}
          onRowClicked={handleRowClicked}
          onRowDoubleClicked={handleRowDoubleClicked}
          onCellContextMenu={handleCellContextMenu}
          rowSelection={showCheckboxes ? "multiple" : "single"}
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
          icons={{
            filter: () => (
              <FontAwesomeIcon
                icon={faFilter}
                className="w-3 h-3 text-[#545454]"
                style={{ fontSize: "12px" }}
                aria-hidden="true"
              />
            ),
            menu: undefined, // Use AG Grid's default menu icon
          }}
          sideBar={{
            toolPanels: [
              {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
              },
            ],
            defaultToolPanel: 'columns',
            position: 'right',
          }} // Sidebar open by default to Columns panel
          suppressMenuHide={true}
          columnMenu="legacy"
          onGridReady={params => params.api.sizeColumnsToFit()}
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
