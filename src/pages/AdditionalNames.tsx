import React from "react";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons";
import DataGrid from "@/components/DataGrid";
import { sampleProviders, standardColumns } from "@/lib/gridConfig";

const AdditionalNames: React.FC = () => {
  return (
    <div className="flex-1 min-h-0 pt-4 px-4">
      <DataGrid
        title="Additional Names"
        icon={faAddressBook}
        data={sampleProviders}
        columns={standardColumns}
        height="100%"
      />
    </div>
  );
};

export default AdditionalNames;
