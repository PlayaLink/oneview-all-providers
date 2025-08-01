import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise/styles/ag-grid.css";
import "ag-grid-enterprise/styles/ag-theme-quartz.css";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  status: string;
}

interface DocumentsGridProps {
  documents: Document[];
}

const DocumentsGrid: React.FC<DocumentsGridProps> = ({ documents }) => {
  // Column state persistence
  const [gridApi, setGridApi] = React.useState<any>(null);
  const gridStateKey = "ag-grid-state-documents";

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

  const columnDefs = [
    {
      field: "name" as keyof Document,
      headerName: "Document Name",
      sortable: true,
      filter: true,
    },
    {
      field: "type" as keyof Document,
      headerName: "Type",
      sortable: true,
      filter: true,
    },
    {
      field: "size" as keyof Document,
      headerName: "Size",
      sortable: true,
      filter: true,
    },
    {
      field: "lastModified" as keyof Document,
      headerName: "Last Modified",
      sortable: true,
      filter: true,
    },
    {
      field: "status" as keyof Document,
      headerName: "Status",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <div className="ag-theme-quartz" style={{ width: "100%", height: 400 }}>
      <AgGridReact
        theme="legacy"
        rowData={documents}
        columnDefs={columnDefs}
        headerHeight={40}
        rowHeight={42}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          cellClass: "ag-cell-vertically-centered",
          filterParams: {
            buttons: ["reset"],
            closeOnApply: true,
            suppressApplyButton: true,
          },
        }}
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
  );
};

export default DocumentsGrid;

export const documentsTab = {
  id: "documents",
  label: "Docs",
  icon: "file-lines",
  enabled: true,
  Component: DocumentsGrid,
};
