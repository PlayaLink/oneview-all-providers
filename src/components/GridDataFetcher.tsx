import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchGridDefinitions,
  fetchGridColumnsByGridName,
  fetchGridData,
  supabase,
} from "@/lib/supabaseClient";
import DataGrid from "@/components/DataGrid";
import { getIconByName } from "@/lib/iconMapping";
import { extractTitleAcronym, generateProviderName } from "@/lib/utils";
import { getTitleAcronym } from "./grid-item-details/ProviderInfoDetails";

// Example mapping functions for specific grids
const gridDataMappers: Record<string, (row: any) => any> = {
  provider_info: (row) => ({
    ...row,
    provider_name: row.provider_name || `${row.last_name || ""}, ${row.first_name || ""}`.trim().replace(/^, |, $/, ""),
    id: row.provider_id || row.id, // Ensure id is set for AG Grid selection/navigation
  }),
  // Add more grid-specific mappers as needed
};

const getValueFormatterForType = (type: string) => {
  if (type === "boolean") {
    return (params: any) => {
      if (params.value === true) return "Yes";
      if (params.value === false) return "No";
      return ""; // Return empty string for null/undefined values
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
  height?: number | string;
  providerIdFilter?: string; // Optional filter
  handleShowFacilityDetails?: (facility: any) => void;
  selectedRowId?: string | null;
  selectedGridKey?: string | null;
  onOpenDetailModal?: (row: any, gridName: string) => void;
  onAddRecord?: (gridName: string) => void;
  /** Whether to pin the actions column to the right */
  pinActionsColumn?: boolean;
  /** Whether the side panel is open */
  isSidePanelOpen?: boolean;
}

const GridDataFetcher: React.FC<GridDataFetcherProps> = ({
  gridKey,
  titleOverride,
  iconOverride,
  onRowClicked,
  height,
  providerIdFilter,
  handleShowFacilityDetails,
  selectedRowId,
  selectedGridKey,
  onOpenDetailModal,
  onAddRecord,
  pinActionsColumn = true,
  isSidePanelOpen = false,
}) => {
  const queryClient = useQueryClient();
  const lowerKey = gridKey.toLowerCase();
  
  // Fetch all grid definitions and find the one for this gridKey
  const { data: gridDefs = [] } = useQuery({
    queryKey: ["grid_definitions"],
    queryFn: fetchGridDefinitions,
    initialData: [],
  });
  const gridDef = Array.isArray(gridDefs)
    ? gridDefs.find(
        (g: any) => (g.key || g.table_name)?.toLowerCase() === lowerKey,
      )
    : undefined;

  // Function to invalidate grid data cache after deletion
  const handleRecordsDeleted = React.useCallback((deletedIds: string[]) => {
    console.log('Records deleted, invalidating cache for:', gridDef?.table_name);
    
    // Invalidate the specific grid data query
    if (gridDef?.table_name) {
      queryClient.invalidateQueries({
        queryKey: ["grid_data", gridDef.table_name, providerIdFilter]
      });
    }
  }, [queryClient, gridDef?.table_name, providerIdFilter]);

  // Fetch columns for this grid
  const { data: gridColumnsData } = useQuery({
    queryKey: gridDef ? ["grid_columns_by_name", gridKey] : ["grid_columns_by_name", "none"],
    queryFn: () =>
      gridDef ? fetchGridColumnsByGridName(gridKey) : Promise.resolve({ columns: [], gridDefinition: null }),
    enabled: !!gridDef,
    initialData: { columns: [], gridDefinition: null },
  });
  
  const columns = (gridColumnsData as any)?.columns || [];
  const gridDefinition = (gridColumnsData as any)?.gridDefinition;

  // Fetch data for this grid, filtered by providerIdFilter if present
  const {
    data: gridData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: gridDef
      ? ["grid_data", gridDef.table_name, providerIdFilter]
      : ["grid_data", "none"],
    queryFn: async () => {
      if (!gridDef || !gridDef.table_name) {
        return [];
      }

      if (providerIdFilter) {
        const filterColumn =
          gridDef.table_name === "providers" ||
          gridDef.table_name === "providers_with_full_name"
            ? "id"
            : "provider_id";

        const { data, error } = await supabase
          .from(gridDef.table_name)
          .select("*")
          .eq(filterColumn, providerIdFilter);

        if (error) {
          throw error;
        }

        return data;
      } else {
        const result = await fetchGridData(gridDef.table_name);
        return result;
      }
    },
    enabled: !!(gridDef && gridDef.table_name),
    initialData: [],
  });

  // Always generate provider_name for every row, using joined provider if present
  const mappedData = Array.isArray(gridData)
    ? gridData.map((row) => {
        const provider = row.provider || {};
        const lastName = provider.last_name || row.last_name || "";
        const firstName = provider.first_name || row.first_name || "";
        return {
          ...row,
          provider_name:
            lastName || firstName
              ? `${lastName}, ${firstName}`.replace(/^, |, $/, "").trim()
              : row.provider_name || "",
        };
      })
    : [];


  // Build AG Grid columns dynamically from backend config
  const agGridColumns = React.useMemo(() => {
    if (!Array.isArray(columns)) return [];
    
    // Check if any column contains "title" in the name
    const titleColumns = columns.filter(col => col.name.toLowerCase().includes('title'));
    
    return columns.map((col: any) => {
      const colDef: any = {
        field: col.name,
        headerName: col.display_name,
        minWidth: 120, // Set a reasonable minimum width that allows shrinking
        width: col.width, // Use database width if available
        flex: col.width ? undefined : 1, // Only use flex if no fixed width
        valueFormatter: getValueFormatterForType(col.type),
        hide: !col.visible,
        // ...add more as needed
      };

      // Apply custom valueFormatter for title field
      if (col.name === "title" || col.name.toLowerCase() === "title") {

        colDef.valueFormatter = (params: any) => {
          const fullTitle = params.value;
          // Use provider-specific title formatting if this is a provider grid
          const acronym = gridDef?.table_name === "providers" || gridDef?.table_name === "providers_with_full_name" 
            ? getTitleAcronym(fullTitle)
            : extractTitleAcronym(fullTitle);
          return acronym;
        };
      }

      return colDef;
    });
  }, [columns]);

  // Helper function to get base table name from view names
  const getBaseTableName = (tableOrViewName: string): string => {
    // Map view names to their base table names
    const viewToTableMap: Record<string, string> = {
      'state_licenses_with_provider': 'state_licenses',
      'providers_with_full_name': 'providers',
      'facility_affiliations_with_provider': 'facility_affiliations',
      'addresses_with_provider': 'addresses',
      'birth_info_with_provider': 'birth_info',
      'additional_names_with_provider': 'additional_names',
      'facilities_with_properties': 'facilities',
      'facilities_with_all_data': 'facilities',
      'facilities_with_property_values': 'facilities',
      'facilities_with_property_values_json': 'facilities',
      'contacts_with_facility': 'contacts',
      'requirements_with_data': 'requirements'
    };
    
    // If it's a view, return the base table name, otherwise return as-is
    return viewToTableMap[tableOrViewName] || tableOrViewName;
  };

  // Check for field mismatches
  if (mappedData.length > 0 && agGridColumns.length > 0) {
    const columnFields = agGridColumns.map((col) => col.field);
    const dataKeys = Object.keys(mappedData[0]);

    // Find missing fields in data
    const missingInData = columnFields.filter(
      (field) => !dataKeys.includes(field),
    );
    if (missingInData.length > 0) {
      // console.warn("GridDataFetcher - Fields missing in data:", missingInData);
    }

    // Find extra fields in data
    const extraInData = dataKeys.filter((key) => !columnFields.includes(key));
    if (extraInData.length > 0) {
    }

    // Check for exact matches
    const exactMatches = columnFields.filter((field) =>
      dataKeys.includes(field),
    );

    if (missingInData.length === 0) {
    } else {
      // console.error("GridDataFetcher - ❌ Column fields missing from data:", missingInData);
    }
  }

  if (!gridDef) return null;



  return (
    <section
      className=""
      role="region"
      aria-label={`${gridDef.display_name} Data Grid`}
      data-debug-gridkey={gridKey}
      data-debug-datacount={mappedData?.length || 0}
      data-debug-columncount={agGridColumns?.length || 0}
    >
      <DataGrid
        title={titleOverride || gridDef.display_name}
        icon={iconOverride || gridDef.icon}
        data={mappedData}
        columns={agGridColumns}
        showCheckboxes={true}
        height={height || "100%"}
        onRowClicked={onRowClicked}
        handleShowFacilityDetails={handleShowFacilityDetails}
        selectedRowId={selectedGridKey === gridKey ? selectedRowId : null}
        showActionsColumn={true}
                  onDownload={(data) => {}}
                  onToggleAlert={(data, enabled) => {}}
        onToggleSidebar={(data) => {
          // For side_panel action, we want to open the side panel directly
          // This bypasses the row click suppression logic
          onRowClicked?.(data);
        }}
                  onToggleFlag={(data, flagged) => {}}
        onOpenDetailModal={(data) => onOpenDetailModal?.(data, gridKey)}
        onAddRecord={() => onAddRecord?.(gridKey)}
                  onMoreHeaderActions={() => {}}
        pinActionsColumn={pinActionsColumn}
        isSidePanelOpen={isSidePanelOpen}
        gridColumnsData={columns}
        gridName={gridKey}
        tableName={getBaseTableName(gridDef.table_name)}
        onRecordsDeleted={handleRecordsDeleted}
        defaultExpiringDays={gridDefinition?.expiring_within}
      />
      {isLoading && <div className="text-gray-500 mt-4">Loading...</div>}
      {error && (
        <div className="text-red-500 mt-4">
          Error loading data: {error.message}
        </div>
      )}
    </section>
  );
};

export default GridDataFetcher;
