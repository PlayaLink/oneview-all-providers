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
  height?: string;
  showCheckboxes?: boolean;
  showStatusBadges?: boolean;
  selectedRowId?: string | null;
}

const DataGrid: React.FC<DataGridProps> = ({
  title,
  icon,
  data,
  columns,
  onSelectionChanged,
  onRowClicked,
  height = "400px",
  showCheckboxes = true,
  showStatusBadges = true,
  selectedRowId: controlledSelectedRowId,
}) => {
  const [internalSelectedRowId, setInternalSelectedRowId] = React.useState<string | null>(null);
  const selectedRowId = controlledSelectedRowId !== undefined ? controlledSelectedRowId : internalSelectedRowId;

  // Prepare column definitions with optional checkbox column
  const columnDefs: ColDef[] = [
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
          },
        ]
      : []),
    ...columns.map((col) => ({
      ...col,
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

        // Check if this is row selection (not checkbox selection)
        const isRowSelected = selectedRowId === params.data.id;
        
        if (isRowSelected) {
          // White text for row selection
          return {
            ...baseCellStyle,
            color: "white",
          };
        }

        return baseCellStyle;
      },
    })),
  ];

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

  return (
    <div className="bg-white flex flex-col flex-1 min-h-0">
      {/* Grid Header */}
      <div className="flex items-center justify-between px-2 py-[9px] bg-[#CFD8DC] border-b border-gray-300 flex-shrink-0 rounded overflow-hidden">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={icon} className="w-4 h-4 text-[#545454]" />
          <span className="text-[#545454] font-bold text-xs tracking-wider uppercase">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {showStatusBadges && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#F48100] rounded-full">
                <span className="text-white font-bold text-xs">1</span>
                <span className="text-white font-bold text-xs">Expiring</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#DB0D00] rounded-full">
                <span className="text-white font-bold text-xs">1</span>
                <span className="text-white font-bold text-xs">Expired</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#545454] rounded-full">
                <span className="text-white font-bold text-xs">900+</span>
                <span className="text-white font-bold text-xs">Total</span>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <div className="w-9 h-5 bg-[#79AC48] rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* AG Grid Container */}
      <div
        className="ag-theme-alpine ag-grid-custom flex-1 min-h-0"
        style={{ width: "100%", border: "none", borderWidth: "0px", ...(height !== "100%" ? { height } : {}) } as React.CSSProperties}
      >
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          onSelectionChanged={handleSelectionChanged}
          onRowClicked={handleRowClicked}
          onRowDoubleClicked={handleRowDoubleClicked}
          rowSelection={showCheckboxes ? "multiple" : "single"}
          headerHeight={40}
          rowHeight={42}
          suppressRowClickSelection={true}
          suppressCellFocus={true}
          domLayout="normal"
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
              />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default DataGrid;
