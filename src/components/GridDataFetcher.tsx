import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGridDefinitions, fetchGridColumns, fetchGridData, supabase } from "@/lib/supabaseClient";
import DataGrid from "@/components/DataGrid";
import { getIconByName } from "@/lib/iconMapping";

// Example mapping functions for specific grids
const gridDataMappers: Record<string, (row: any) => any> = {
  provider_info: (row) => ({
    ...row,
    provider_name: `${row.last_name || ''}, ${row.first_name || ''}`.trim(),
    id: row.provider_id || row.id, // Ensure id is set for AG Grid selection/navigation
  }),
  // Add more grid-specific mappers as needed
};

const getValueFormatterForType = (type: string) => {
  if (type === "boolean") {
    return (params: any) => {
      if (params.value === true) return "Yes";
      if (params.value === false) return "No";
      return null; // AG Grid will render a truly empty cell
    };
  }
  if (type === "date") {
    return (params: any) => {
      if (!params.value) return "";
      const date = new Date(params.value);
      if (isNaN(date.getTime())) return params.value;
      return (
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        date.getDate().toString().padStart(2, "0") +
        "/" +
        date.getFullYear()
      );
    };
  }
  // Add more as needed (multi-select, etc.)
  return undefined;
};

const booleanCellRenderer = (params: any) => {
  if (params.value === true) return "Yes";
  if (params.value === false) return "No";
  return ""; // This will render a truly blank cell
};

interface GridDataFetcherProps {
  gridKey: string;
  titleOverride?: string;
  iconOverride?: any;
  onRowClicked?: (row: any) => void;
  height?: number | string;
  providerIdFilter?: string; // Optional filter
}

const GridDataFetcher: React.FC<GridDataFetcherProps> = ({ gridKey, titleOverride, iconOverride, onRowClicked, height, providerIdFilter }) => {
  const lowerKey = gridKey.toLowerCase();
  // Fetch all grid definitions and find the one for this gridKey
  const { data: gridDefs = [] } = useQuery({
    queryKey: ["grid_definitions"],
    queryFn: fetchGridDefinitions,
    initialData: [],
  });
  const gridDef = Array.isArray(gridDefs) ? gridDefs.find((g: any) => (g.key || g.table_name)?.toLowerCase() === lowerKey) : undefined;

  // Fetch columns for this grid
  const { data: columns = [] } = useQuery({
    queryKey: gridDef ? ["grid_columns", gridDef.id] : ["grid_columns", "none"],
    queryFn: () => gridDef ? fetchGridColumns(gridDef.id) : Promise.resolve([]),
    enabled: !!gridDef,
    initialData: [],
  });
  
  // Fetch data for this grid, filtered by providerIdFilter if present
  const { data: gridData = [], isLoading, error } = useQuery({
    queryKey: gridDef ? ["grid_data", gridDef.table_name, providerIdFilter] : ["grid_data", "none"],
    queryFn: async () => {
      if (!gridDef || !gridDef.table_name) return [];
      if (providerIdFilter) {
        const filterColumn = gridDef.table_name === "providers" ? "id" : "provider_id";
        const { data, error } = await supabase
          .from(gridDef.table_name)
          .select("*")
          .eq(filterColumn, providerIdFilter);
        if (error) throw error;
        return data;
      } else {
        return fetchGridData(gridDef.table_name);
      }
    },
    enabled: !!(gridDef && gridDef.table_name),
    initialData: [],
  });

  // Remove mapping logic, use gridData directly
  const mappedData = gridData;

  // Build AG Grid columns dynamically from backend config
  const agGridColumns = React.useMemo(() => {
    if (!Array.isArray(columns)) return [];
    return columns.map((col: any) => ({
      field: col.name,
      headerName: col.display_name,
      minWidth: col.width || 120,
      flex: 1,
      valueFormatter: col.type === "boolean" ? undefined : getValueFormatterForType(col.type),
      cellRenderer: col.type === "boolean" ? booleanCellRenderer : undefined,
      hide: !col.visible,
      // ...add more as needed
    }));
  }, [columns]);
  

  
  // Check for field mismatches
  if (mappedData.length > 0 && agGridColumns.length > 0) {
    const columnFields = agGridColumns.map(col => col.field);
    const dataKeys = Object.keys(mappedData[0]);
    
    // Find missing fields in data
    const missingInData = columnFields.filter(field => !dataKeys.includes(field));
    if (missingInData.length > 0) {
      console.warn("GridDataFetcher - Fields missing in data:", missingInData);
    }
    
    // Find extra fields in data
    const extraInData = dataKeys.filter(key => !columnFields.includes(key));
    if (extraInData.length > 0) {
    }
    
    // Check for exact matches
    const exactMatches = columnFields.filter(field => dataKeys.includes(field));
    
    if (missingInData.length === 0) {
    } else {
      console.error("GridDataFetcher - ❌ Column fields missing from data:", missingInData);
    }
  }



  if (!gridDef) return null;



  return (
    <section className="flex-1 min-h-0 flex flex-col pl-3 pr-3 pt-4" role="region" aria-label={`${gridDef.display_name} Data Grid`}>
      <DataGrid
        title={titleOverride || gridDef.display_name}
        icon={iconOverride || getIconByName(gridDef.icon)}
        data={mappedData}
        columns={agGridColumns}
        showCheckboxes={true}
        height={height || '100%'}
        onRowClicked={onRowClicked}
      />
      {isLoading && <div className="text-gray-500 mt-4">Loading...</div>}
      {error && <div className="text-red-500 mt-4">Error loading data: {error.message}</div>}
    </section>
  );
};

export default GridDataFetcher; 