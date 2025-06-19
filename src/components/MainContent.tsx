import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import DataGrid from "@/components/DataGrid";
import { sampleProviders, standardColumns } from "@/lib/gridConfig";
import { GridConfig } from "@/lib/gridConfig";

interface MainContentProps {
  selectedItem: string | null;
  selectedSection: string | null;
}

const MainContent: React.FC<MainContentProps> = ({
  selectedItem,
  selectedSection,
}) => {
  const [currentGridIndex, setCurrentGridIndex] = useState(0);

  // Function to get grids based on selection
  const getGridsToShow = () => {
    if (selectedItem && selectedItem !== "all-sections") {
      // Show single grid
      const grid = GridConfig.findGridByKey(selectedItem);
      return grid ? [grid] : [];
    }

    if (selectedSection) {
      // Show all grids in section
      return GridConfig.getGridsBySection(selectedSection);
    }

    if (selectedItem === "all-sections") {
      // Show all grids
      return GridConfig.getAllGrids();
    }

    // Default: show Provider Info
    return [GridConfig.findGridByKey("provider-info")].filter(Boolean);
  };

  const gridsToShow = getGridsToShow();
  const isMultipleGrids = gridsToShow.length > 1;

  const handlePrevious = () => {
    setCurrentGridIndex((prev) =>
      prev > 0 ? prev - 1 : gridsToShow.length - 1,
    );
  };

  const handleNext = () => {
    setCurrentGridIndex((prev) =>
      prev < gridsToShow.length - 1 ? prev + 1 : 0,
    );
  };

  if (gridsToShow.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center pt-4 px-4">
        <div className="text-gray-500">No content to display</div>
      </div>
    );
  }

  const currentGrid = gridsToShow[currentGridIndex];

  return (
    <div className="flex-1 flex flex-col pt-4 px-4 relative">
      {/* Current Grid */}
      <div className="flex-1 min-h-0">
        <DataGrid
          title={currentGrid.title}
          icon={currentGrid.icon}
          data={sampleProviders}
          columns={standardColumns}
          height="100%"
        />
      </div>

      {/* Scroll Navigation */}
      {isMultipleGrids && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
          <button
            onClick={handlePrevious}
            className="w-8 h-8 bg-[#008BC9] text-white rounded-full flex items-center justify-center hover:bg-[#007399] transition-colors shadow-lg"
          >
            <FontAwesomeIcon icon={faChevronUp} className="w-4 h-4" />
          </button>

          <div className="text-xs text-center text-[#545454] bg-white rounded px-2 py-1 shadow-sm">
            {currentGridIndex + 1} / {gridsToShow.length}
          </div>

          <button
            onClick={handleNext}
            className="w-8 h-8 bg-[#008BC9] text-white rounded-full flex items-center justify-center hover:bg-[#007399] transition-colors shadow-lg"
          >
            <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MainContent;
