import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProviders } from "@/lib/supabaseClient";
import DataGrid from "@/components/DataGrid";
import { getColumnsForGrid } from "@/lib/columnConfigs";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import NavItem from "@/components/NavItem";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalNavigation from "@/components/GlobalNavigation";
import PageContainer from "@/components/PageContainer";
import MainContentArea from "@/components/MainContentArea";

const TeamPage: React.FC<{ user: any }> = ({ user }) => {
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

  console.log("providerInfoData", providerInfoData);
  console.log("mappedData", mappedData);

  return (
    <PageContainer>
      <GlobalNavigation user={user} />
      <MainContentArea>
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
      </MainContentArea>
    </PageContainer>
  );
};

export default TeamPage; 