import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGridDefinitions, fetchGridColumns, fetchGridData } from "@/lib/supabaseClient";
import DataGrid from "@/components/DataGrid";
import { useInView } from "react-intersection-observer";

interface LazyLoadGridProps {
  gridKey: string;
  mapper?: (row: any) => any;
  height?: string;
}

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
  return undefined;
};

const LazyLoadGrid: React.FC<LazyLoadGridProps> = ({ gridKey, mapper, height = "100%" }) => {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: "200px" });

  // Fetch grid definition only when in view
  const { data: gridDefs = [] } = useQuery({
    queryKey: ["grid_definitions"],
    queryFn: fetchGridDefinitions,
    enabled: inView,
    initialData: [],
  });
  const gridDef = (gridDefs as any[]).find((g) => g.key === gridKey);

  // Fetch columns only when gridDef is available and in view
  const { data: columns = [] } = useQuery({
    queryKey: gridDef ? ["grid_columns", gridDef.id] : ["grid_columns", "none"],
    queryFn: () => gridDef ? fetchGridColumns(gridDef.id) : Promise.resolve([]),
    enabled: !!gridDef && inView,
    initialData: [],
  });

  // Fetch data only when gridDef is available and in view
  const { data: gridData = [], isLoading, error } = useQuery({
    queryKey: gridDef ? ["grid_data", gridDef.table_name] : ["grid_data", "none"],
    queryFn: () => gridDef ? fetchGridData(gridDef.table_name) : Promise.resolve([]),
    enabled: !!gridDef && inView,
    initialData: [],
  });

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
    }));
  }, [columns]);

  // Map data if a mapper is provided
  const mappedData = React.useMemo(() => {
    if (!Array.isArray(gridData)) return [];
    return mapper ? gridData.map(mapper) : gridData;
  }, [gridData, mapper]);

  if (!inView) {
    return <div ref={ref} style={{ height }} />;
  }

  if (isLoading) {
    return <div ref={ref} style={{ height }} className="flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div ref={ref} style={{ height }} className="flex items-center justify-center text-red-500">Error loading grid: {error.message}</div>;
  }

  return (
    <div ref={ref} style={{ height }}>
      <DataGrid
        title={gridDef?.display_name || gridKey}
        icon={gridDef?.icon}
        data={mappedData}
        columns={agGridColumns}
        showCheckboxes={true}
        height={height}
        // Add more props as needed
      />
    </div>
  );
};

export default LazyLoadGrid; 