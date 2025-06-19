import React from "react";
import { faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import DataGrid from "@/components/DataGrid";
import { sampleProviders, standardColumns } from "@/lib/gridConfig";

const ProviderInfo: React.FC = () => {
  return (
    <div className="flex-1 min-h-0 pt-4 px-4">
      <DataGrid
        title="Provider Info"
        icon={faUserDoctor}
        data={sampleProviders}
        columns={standardColumns}
        height="100%"
      />
    </div>
  );
};

export default ProviderInfo;
