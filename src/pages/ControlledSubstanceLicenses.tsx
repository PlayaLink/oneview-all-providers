import React from "react";
import { faPills } from "@fortawesome/free-solid-svg-icons";
import DataGrid from "@/components/DataGrid";
import { sampleProviders, standardColumns } from "@/lib/gridConfig";

const ControlledSubstanceLicenses: React.FC = () => {
  return (
    <div className="flex-1 min-h-0 pt-4 px-4">
      <DataGrid
        title="State Controlled Substance Licenses"
        icon={faPills}
        data={sampleProviders}
        columns={standardColumns}
        height="100%"
      />
    </div>
  );
};

export default ControlledSubstanceLicenses;
