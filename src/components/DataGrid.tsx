import React from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  SelectionChangedEvent,
  RowClickedEvent,
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
}) => {
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
      cellStyle: {
        color: "#545454",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        paddingLeft: "16px",
        ...col.cellStyle,
      },
    })),
  ];

  const handleSelectionChanged = (event: SelectionChangedEvent) => {
    if (onSelectionChanged) {
      onSelectionChanged(event);
    }
    if (onRowClicked) {
      const selectedRows = event.api.getSelectedRows();
      if (selectedRows.length > 0) {
        onRowClicked(selectedRows[0]);
      }
    }
  };

  return (
    <div className="bg-white flex flex-col h-full">
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
        className="ag-theme-alpine ag-grid-custom flex-1"
        style={
          {
            ...(height === "100%"
              ? { flexGrow: 1, height: "auto" }
              : { height }),
            width: "100%",
            border: "none",
            borderWidth: "0px",
            minHeight: 0,
            // Remove all vertical borders
            "--ag-border-color": "transparent",
            "--ag-cell-horizontal-border": "none",
            "--ag-header-column-separator-color": "transparent",
          } as React.CSSProperties
        }
      >
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          onSelectionChanged={handleSelectionChanged}
          onRowClicked={(event: RowClickedEvent) => {
            if (onRowClicked && event.data) {
              onRowClicked(event.data);
            }
          }}
          rowSelection={showCheckboxes ? "multiple" : "single"}
          headerHeight={40}
          rowHeight={42}
          suppressRowClickSelection={showCheckboxes}
          domLayout="normal"
          getRowStyle={() => ({
            borderBottom: "0.5px solid #D2D5DC",
            backgroundColor: "white",
          })}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            cellStyle: {
              borderRight: "none",
            },
          }}
          suppressColumnVirtualisation={false}
          gridOptions={{
            suppressBorderLeft: true,
            suppressBorderRight: true,
          }}
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
