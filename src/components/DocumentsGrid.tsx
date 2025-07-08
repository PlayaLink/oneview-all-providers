import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface Document {
  id: string;
  name: string;
  size: number;
  document_type: string;
  permission: string;
  date: string;
  exp_date: string;
  verif_date: string;
  exp_na: boolean;
  bucket: string;
  path: string;
}

interface DocumentsGridProps {
  documents: Document[];
  onEdit: (doc: Document) => void;
  onDelete: (doc: Document) => void;
}

const formatSize = (size: number) => {
  if (!size) return '';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 102.4) / 10} KB`;
  return `${Math.round(size / 1024 / 102.4) / 10} MB`;
};

const DocumentsGrid: React.FC<DocumentsGridProps> = ({ documents, onEdit, onDelete }) => {
  const columnDefs = [
    {
      headerName: 'Name',
      field: 'name',
      flex: 3,
      minWidth: 200,
      cellRenderer: (params: any) => (
        <a
          href={`https://nsqushsijqnlstgwgkzx.supabase.co/storage/v1/object/public/${params.data.bucket}/${params.data.path}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {params.value} <span className="text-xs text-gray-500">({formatSize(params.data.size)})</span>
        </a>
      ),
      filter: 'agTextColumnFilter',
    },
    { 
      headerName: 'Document Type', 
      field: 'document_type', 
      flex: 2, 
      minWidth: 120,
      filter: 'agTextColumnFilter' 
    },
    { 
      headerName: 'Permission', 
      field: 'permission', 
      flex: 1.5, 
      minWidth: 100,
      filter: 'agTextColumnFilter' 
    },
    { 
      headerName: 'Date', 
      field: 'date', 
      flex: 2, 
      minWidth: 130,
      filter: 'agDateColumnFilter' 
    },
    { 
      headerName: 'Exp. Date', 
      field: 'exp_date', 
      flex: 2, 
      minWidth: 130,
      filter: 'agDateColumnFilter' 
    },
    { 
      headerName: 'Verif. Date', 
      field: 'verif_date', 
      flex: 2, 
      minWidth: 130,
      filter: 'agDateColumnFilter' 
    },
    {
      headerName: 'Exp. N/A',
      field: 'exp_na',
      flex: 1,
      minWidth: 80,
      filter: 'agTextColumnFilter',
      valueFormatter: (params: any) => (params.value ? 'Yes' : 'No'),
    },
    {
      headerName: 'Actions',
      field: 'actions',
      flex: 1.5,
      minWidth: 120,
      cellRenderer: (params: any) => (
        <div className="flex gap-2">
          <button className="text-blue-600 underline text-xs" onClick={() => onEdit(params.data)}>Edit</button>
          <button className="text-red-500 underline text-xs" onClick={() => onDelete(params.data)}>Delete</button>
        </div>
      ),
      filter: false,
      sortable: false,
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: 400 }}>
      <AgGridReact
        rowData={documents}
        columnDefs={columnDefs as any}
        domLayout="autoHeight"
        suppressRowClickSelection
        rowSelection="single"
      />
    </div>
  );
};

export default DocumentsGrid; 