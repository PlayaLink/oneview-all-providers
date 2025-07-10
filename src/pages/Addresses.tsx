import React from "react";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import DataGrid from "@/components/DataGrid";
import { getColumnsForGrid } from "@/lib/columnConfigs";
import { useQuery } from '@tanstack/react-query';
import { fetchAddresses } from '@/lib/supabaseClient';

const Addresses: React.FC = () => {
  const { data: addresses, isLoading, error } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
  });

  // Map the data to the expected grid format
  const gridData = React.useMemo(() => {
    if (!addresses) return [];
    return addresses.map((row) => ({
      ...row,
      provider_name: row.provider
        ? `${row.provider.last_name}, ${row.provider.first_name}`
        : "",
      title: row.provider?.title || "",
      primary_specialty: row.provider?.primary_specialty || "",
    }));
  }, [addresses]);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading addresses: {error.message}</div>;

  return (
    <div className="flex-1 min-h-0 pt-4 px-4">
      <DataGrid
        title="Addresses"
        icon={faHouse}
        data={gridData}
        columns={getColumnsForGrid("Addresses")}
        height="100%"
      />
    </div>
  );
};

export default Addresses;
