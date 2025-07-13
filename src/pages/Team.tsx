import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProviders, fetchGridDefinitions, fetchGridColumns } from "@/lib/supabaseClient";
import DataGrid from "@/components/DataGrid";
import { faUsers, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import NavItem from "@/components/NavItem";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import AllProvidersHeader from "@/components/AllProvidersHeader";

// Helper to get valueFormatter by type
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

interface GridDef {
  id: string;
  key: string;
  display_name: string;
  [key: string]: any;
}
interface GridColumn {
  name: string;
  display_name: string;
  type: string;
  width?: number;
  visible: boolean;
  [key: string]: any;
}

const TeamPage: React.FC = () => {
  const { user } = useUser();
  const { data: gridDefs = [] } = useQuery<{ id: string; key: string; display_name: string }[]>({
    queryKey: ["grid_definitions"],
    queryFn: fetchGridDefinitions,
    initialData: [],
  });
  const providerInfoGrid = (gridDefs as GridDef[]).find((g) => g.key === "Provider_Info");
  const { data: columns = [] } = useQuery<GridColumn[]>({
    queryKey: providerInfoGrid ? ["grid_columns", providerInfoGrid.id] : ["grid_columns", "none"],
    queryFn: () => providerInfoGrid ? fetchGridColumns(providerInfoGrid.id) : Promise.resolve([]),
    enabled: !!providerInfoGrid,
    initialData: [],
  });
  // For now, keep using fetchProviders for data
  const { data: providerInfoData = [], isLoading, error } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Map data to include provider_name and ensure all expected fields exist
  const mappedData = Array.isArray(providerInfoData) ? providerInfoData.map((row: any) => ({
    ...row,
    provider_name: `${row.last_name || ''}, ${row.first_name || ''}`.trim(),
  })) : [];

  // Build AG Grid columns dynamically from backend config
  const agGridColumns = React.useMemo(() => {
    if (!Array.isArray(columns)) return [];
    return columns.map((col) => ({
      field: col.name,
      headerName: col.display_name,
      minWidth: col.width || 120,
      flex: 1,
      valueFormatter: getValueFormatterForType(col.type),
      hide: !col.visible,
      // ...add more as needed
    }));
  }, [columns]);

  // Build the search list from live data for the header
  const providerSearchList = React.useMemo(() => (
    Array.isArray(providerInfoData)
      ? providerInfoData.map(row => ({
          fullName: `${row.first_name || ""} ${row.last_name || ""}`.trim(),
          firstName: row.first_name || "",
          lastName: row.last_name || "",
          title: row.title || "",
          npi: row.npi_number || "",
          specialty: row.primary_specialty || "",
          email: row.work_email || row.personal_email || "",
        }))
      : []
  ), [providerInfoData]);

  // Handler for provider search selection
  const handleProviderSelect = (providerNpi: string) => {
    if (providerNpi) {
      navigate(`/${providerNpi}`);
    } else {
      navigate('/all-records');
    }
  };

  // Handler for DataGrid row clicks - navigate to provider detail page
  const handleRowClick = (rowData: any) => {
    if (rowData.npi_number) {
      navigate(`/${rowData.npi_number}`);
    }
  };

  return (
    <>
      {/* All Providers Header */}
      <AllProvidersHeader
        title="Team"
        npi={undefined}
        onProviderSelect={handleProviderSelect}
        providerSearchList={providerSearchList}
        icon={faUsers}
        buttonText="Add Provider"
        buttonIcon={faUserPlus}
        onButtonClick={() => {
          // Add Provider functionality
        }}
        buttonClassName="bg-[#79AC48] hover:bg-[#6B9A3F] text-white"
      />
      <section className="flex-1 min-h-0 flex flex-col pl-3 pr-4 pt-4" role="region" aria-label="Providers Data Grid">
        <DataGrid
          title={providerInfoGrid?.display_name || "Team"}
          icon={faUsers}
          data={mappedData}
          columns={agGridColumns}
          showCheckboxes={true}
          height="100%"
          onRowClicked={handleRowClick}
        />
        {isLoading && <div className="text-gray-500 mt-4">Loading providers...</div>}
        {error && <div className="text-red-500 mt-4">Error loading providers: {error.message}</div>}
      </section>
    </>
  );
};

export default TeamPage; 