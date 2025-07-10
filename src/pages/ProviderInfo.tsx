import React from "react";
import { faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import DataGrid from "@/components/DataGrid";
import { standardColumns } from "@/lib/gridConfig";
import { useQuery } from '@tanstack/react-query';
import { fetchProviders } from '@/lib/supabaseClient';

const ProviderInfo: React.FC = () => {
  const { data: providers, isLoading, error } = useQuery<any[], Error>({
    queryKey: ['providers'],
    queryFn: fetchProviders,
  });

  // Map the data to the expected grid format
  const gridData = React.useMemo(() => {
    console.log('gridData', gridData);

    if (!providers) return [];
    return providers.map((row) => ({
      ...row,
      provider_name: `${row.last_name || ''}, ${row.first_name || ''}`.trim(),
      primary_specialty: row.primary_specialty,
      npi_number: row.npi_number,
      work_email: row.work_email,
      personal_email: row.personal_email,
      mobile_phone_number: row.mobile_phone_number,
      title: row.title,
      tags: row.tags || [],
      last_updated: row.last_updated,
    }));
  }, [providers]);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading providers: {error.message}</div>;

  return (
    <div className="flex-1 min-h-0 pt-4 px-4">
      <DataGrid
        title="Provider Info"
        icon={faUserDoctor}
        data={gridData}
        columns={standardColumns}
        height="100%"
      />
    </div>
  );
};

export default ProviderInfo;
