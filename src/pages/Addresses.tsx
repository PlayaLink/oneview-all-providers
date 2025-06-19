import React from "react";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import DataGrid from "@/components/DataGrid";
import { sampleProviders, standardColumns } from "@/lib/gridConfig";

const Addresses: React.FC = () => {
  return (
    <div className="flex-1 min-h-0 pt-4 px-4">
      <DataGrid
        title="Addresses"
        icon={faHouse}
        data={sampleProviders}
        columns={standardColumns}
        height="100%"
      />
    </div>
  );
};

export default Addresses;
