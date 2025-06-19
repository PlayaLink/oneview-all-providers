import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import DataGrid from "@/components/DataGrid";
import { sampleProviders, standardColumns } from "@/lib/gridConfig";

interface GridPageProps {
  title: string;
  icon: IconDefinition;
}

const GridPage: React.FC<GridPageProps> = ({ title, icon }) => {
  return (
    <div className="flex-1 min-h-0 pt-4 px-4">
      <DataGrid
        title={title}
        icon={icon}
        data={sampleProviders}
        columns={standardColumns}
        height="100%"
      />
    </div>
  );
};

export default GridPage;
