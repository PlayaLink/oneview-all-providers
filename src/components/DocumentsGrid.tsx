import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-theme-quartz.css';

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
  const columnDefs = [
    { field: 'name' as keyof Document, headerName: 'Document Name', sortable: true, filter: true },
    { field: 'type' as keyof Document, headerName: 'Type', sortable: true, filter: true },
    { field: 'size' as keyof Document, headerName: 'Size', sortable: true, filter: true },
    { field: 'lastModified' as keyof Document, headerName: 'Last Modified', sortable: true, filter: true },
    { field: 'status' as keyof Document, headerName: 'Status', sortable: true, filter: true },
  ];

  return (
    <div className="ag-theme-quartz" style={{ width: '100%', height: 400 }}>
              <AgGridReact
          rowData={documents}
          columnDefs={columnDefs}
          headerHeight={40}
          rowHeight={42}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
            filterParams: {
              buttons: ['reset'],
              closeOnApply: true,
              suppressApplyButton: true,
            },
          }}
          cellSelection={false}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
        />
    </div>
  );
};

export default DocumentsGrid;

export const documentsTab = {
  id: 'documents',
  label: 'Docs',
  icon: 'file-lines',
  enabled: true,
  Component: DocumentsGrid,
}; 