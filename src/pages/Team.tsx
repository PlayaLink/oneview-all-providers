import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProviders } from "@/lib/supabaseClient";
import DataGrid from "@/components/DataGrid";
import { getColumnsForGrid } from "@/lib/columnConfigs";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

const TeamPage: React.FC<{ user: any }> = ({ user }) => {
  console.log("TeamPage loaded");
  const { data: providerInfoData = [], isLoading, error } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });

  // Map data to include provider_name and ensure all expected fields exist
  const mappedData = providerInfoData.map((row: any) => ({
    ...row,
    provider_name: `${row.last_name || ''}, ${row.first_name || ''}`.trim(),
  }));

  console.log("providerInfoData", providerInfoData);
  console.log("mappedData", mappedData);

  return (
    <main className="flex flex-col flex-1 min-h-0 h-full w-full px-4 pt-4 pb-8 bg-white" role="main" aria-label="Team Providers Page" data-testid="team-page">
      <header className="mb-6">
        <h1 className="text-2xl font-bold" role="heading" aria-level={1} data-testid="team-title">Providers</h1>
      </header>
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
    </main>
  );
};

export default TeamPage; 