import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchGridDefinitions, fetchProviders, supabase, getSupabaseUrl, fetchAllProviderGrids } from "@/lib/supabaseClient";
import AllProvidersHeader from "@/components/AllProvidersHeader";
import GridDataFetcher from "./GridDataFetcher";
import { getIconByName } from "@/lib/iconMapping";

const SingleProvider: React.FC = () => {
  const { provider_id } = useParams<{ provider_id: string }>();

  // Fetch provider info for header
  const { data: providers = [] } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
    initialData: [],
  });
  const provider = providers.find((p: any) => String(p.id) === String(provider_id));

  // Fetch all grid definitions
  const { data: gridDefs = [] } = useQuery({
    queryKey: ["grid_definitions"],
    queryFn: fetchGridDefinitions,
    initialData: [],
  });

  // Fetch all grid data for this provider from the edge function
  const { data: allGrids, isLoading, error } = useQuery({
    queryKey: ["all-provider-grids", provider_id],
    queryFn: () => fetchAllProviderGrids(provider_id!),
    enabled: !!provider_id,
  });

  return (
    <div className="flex flex-col min-h-0 w-full px-4 pb-8">
      <AllProvidersHeader
        provider_id={provider_id}
        provider={provider}
        providerSearchList={[]}
      />
      {isLoading && <div>Loading all provider data...</div>}
      {error && <div className="text-red-500">Error: {String(error)}</div>}
      <div className="flex flex-col gap-8 mt-4 max-h-[70vh] overflow-y-auto" data-testid="single-provider-grids-list">
        {gridDefs.map((grid: any) => {
          const gridKey = grid.key || grid.table_name || grid.tableName;
          return (
            <GridDataFetcher
              key={gridKey}
              gridKey={gridKey}
              titleOverride={grid.display_name || grid.displayName}
              iconOverride={grid.icon}
              providerIdFilter={provider_id}
              height={300}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SingleProvider; 