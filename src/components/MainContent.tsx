import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import DataGrid from "@/components/DataGrid";
import SidePanel from "@/components/SidePanel";
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
    <div className="flex-1 flex flex-col pt-4 px-4">
      {/* Main Content Area */}
      <div className="flex flex-1 gap-4 min-h-0">
        {/* Current Grid */}
        <div className="flex-1 flex flex-col min-h-0">
          <DataGrid
            title={currentGrid.title}
            icon={currentGrid.icon}
            data={sampleProviders}
            columns={standardColumns}
            height="100%"
          />
        </div>

        {/* Scroll Navigation - Next to Grid */}
        {isMultipleGrids && (
          <div className="flex flex-col items-center gap-2 pt-2">
            {/* Scroll Arrows */}
            <div
              className="flex flex-col gap-0.5 rounded p-1"
              style={{
                backgroundColor: "rgba(84, 84, 84, 0.75)",
                borderRadius: "4px",
              }}
            >
              <button
                onClick={handlePrevious}
                className="flex items-center justify-center w-6 h-6 text-white hover:bg-white hover:bg-opacity-10 transition-colors rounded"
              >
                <FontAwesomeIcon
                  icon={faChevronUp}
                  className="w-4 h-4 text-white"
                />
              </button>
              <button
                onClick={handleNext}
                className="flex items-center justify-center w-6 h-6 text-white hover:bg-white hover:bg-opacity-10 transition-colors rounded"
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="w-4 h-4 text-white"
                />
              </button>
            </div>

            {/* Scroll Indicator Track */}
            <div
              className="w-1 bg-gray-300 rounded-full relative"
              style={{ height: "200px" }}
            >
              {/* Scroll Indicator */}
              <div
                className="w-full bg-[#545454] rounded-full transition-all duration-300 ease-out"
                style={{
                  height: `${Math.max(20, 200 / gridsToShow.length)}px`,
                  transform: `translateY(${(currentGridIndex * (200 - Math.max(20, 200 / gridsToShow.length))) / (gridsToShow.length - 1)}px)`,
                }}
              />
            </div>

            {/* Grid Counter */}
            <div className="text-xs text-center text-[#545454] bg-white rounded px-2 py-1 shadow-sm border">
              {currentGridIndex + 1} / {gridsToShow.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
