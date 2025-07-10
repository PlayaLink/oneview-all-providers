import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProviders } from "@/lib/supabaseClient";
import DataGrid from "@/components/DataGrid";
import { getColumnsForGrid } from "@/lib/columnConfigs";
import { faUsers, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import NavItem from "@/components/NavItem";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import AllProvidersHeader from "@/components/AllProvidersHeader";

const TeamPage: React.FC = () => {
  const { user } = useUser();
  console.log("TeamPage loaded");
  const { data: providerInfoData = [], isLoading, error } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Map data to include provider_name and ensure all expected fields exist
  const mappedData = providerInfoData.map((row: any) => ({
    ...row,
    provider_name: `${row.last_name || ''}, ${row.first_name || ''}`.trim(),
  }));

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

  console.log("providerInfoData", providerInfoData);
  console.log("mappedData", mappedData);

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
      <section className="flex-1 min-h-0 flex flex-col" role="region" aria-label="Providers Data Grid">
        <DataGrid
          title="Providers"
          icon={faUsers}
          data={mappedData}
          columns={getColumnsForGrid("Provider_Info")}
          showCheckboxes={true}
          height="100%"
        />
        {isLoading && <div className="text-gray-500 mt-4">Loading providers...</div>}
        {error && <div className="text-red-500 mt-4">Error loading providers: {error.message}</div>}
      </section>
    </>
  );
};

export default TeamPage; 