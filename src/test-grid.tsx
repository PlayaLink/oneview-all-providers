import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const TestGrid = () => {
  const rowData = [
    { name: "García, Sofia", title: "MD", specialty: "Acupuncture" },
    { name: "Petty, Tom", title: "MD", specialty: "General Surgery" },
  ];

  const columnDefs = [
    { field: "name", headerName: "Provider Name" },
    { field: "title", headerName: "Title" },
    { field: "specialty", headerName: "Specialty" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>AG Grid Test</h2>
      <div
        style={{ height: "300px", width: "100%" }}
        className="ag-theme-alpine"
      >
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
      </div>
    </div>
  );
};

export default TestGrid;
