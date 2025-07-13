import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGridDefinitions, fetchGridColumns, fetchGridData } from "@/lib/supabaseClient";
import DataGrid from "@/components/DataGrid";

// Example mapping functions for specific grids
const gridDataMappers: Record<string, (row: any) => any> = {
  provider_info: (row) => ({
    ...row,
    provider_name: `${row.last_name || ''}, ${row.first_name || ''}`.trim(),
  }),
  // Add more grid-specific mappers as needed
};

const getValueFormatterForType = (type: string) => {
  if (type === "boolean") {
    return (params: any) => {
      if (params.value === true) return "Yes";
      if (params.value === false) return "No";
      return "";
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

interface GridDataFetcherProps {
  gridKey: string;
  titleOverride?: string;
  iconOverride?: any;
  onRowClicked?: (row: any) => void;
}

const GridDataFetcher: React.FC<GridDataFetcherProps> = ({ gridKey, titleOverride, iconOverride, onRowClicked }) => {
  const lowerKey = gridKey.toLowerCase();
  // Fetch all grid definitions and find the one for this gridKey
  const { data: gridDefs = [] } = useQuery({
    queryKey: ["grid_definitions"],
    queryFn: fetchGridDefinitions,
    initialData: [],
  });
  const gridDef = Array.isArray(gridDefs) ? gridDefs.find((g: any) => g.key.toLowerCase() === lowerKey) : undefined;

  // Fetch columns for this grid
  const { data: columns = [] } = useQuery({
    queryKey: gridDef ? ["grid_columns", gridDef.id] : ["grid_columns", "none"],
    queryFn: () => gridDef ? fetchGridColumns(gridDef.id) : Promise.resolve([]),
    enabled: !!gridDef,
    initialData: [],
  });

  // Fetch data for this grid
  const { data: gridData = [], isLoading, error } = useQuery({
    queryKey: gridDef ? ["grid_data", gridDef.table_name] : ["grid_data", "none"],
    queryFn: () => gridDef && gridDef.table_name ? fetchGridData(gridDef.table_name) : Promise.resolve([]),
    enabled: !!(gridDef && gridDef.table_name),
    initialData: [],
  });

  // Apply mapping if needed
  const mappedData = React.useMemo(() => {
    const mapper = lowerKey && gridDataMappers[lowerKey];
    return Array.isArray(gridData)
      ? (mapper ? gridData.map(mapper) : gridData)
      : [];
  }, [gridData, lowerKey]);

  // Build AG Grid columns dynamically from backend config
  const agGridColumns = React.useMemo(() => {
    if (!Array.isArray(columns)) return [];
    return columns.map((col: any) => ({
      field: col.name,
      headerName: col.display_name,
      minWidth: col.width || 120,
      flex: 1,
      valueFormatter: getValueFormatterForType(col.type),
      hide: !col.visible,
      // ...add more as needed
    }));
  }, [columns]);

  if (!gridDef) return null;

  return (
    <section className="flex-1 min-h-0 flex flex-col pl-3 pr-4 pt-4" role="region" aria-label={`${gridDef.display_name} Data Grid`}>
      <DataGrid
        title={titleOverride || gridDef.display_name}
        icon={iconOverride || undefined}
        data={mappedData}
        columns={agGridColumns}
        showCheckboxes={true}
        height="100%"
        onRowClicked={onRowClicked}
      />
      {isLoading && <div className="text-gray-500 mt-4">Loading...</div>}
      {error && <div className="text-red-500 mt-4">Error loading data: {error.message}</div>}
    </section>
  );
};

export default GridDataFetcher; 