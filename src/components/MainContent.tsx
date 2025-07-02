import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faTable } from "@fortawesome/free-solid-svg-icons";
import DataGrid from "@/components/DataGrid";
import SidePanel from "@/components/SidePanel";
import { generateSampleData } from "@/lib/dataGenerator";
import { getColumnsForGrid } from "@/lib/columnConfigs";
import { gridDefinitions, getGridsByGroup } from "@/lib/gridDefinitions";
import { getIconByName } from "@/lib/iconMapping";
import { Provider } from "@/types";
import providerInfoConfig from "@/data/provider_info_details.json";

interface MainContentProps {
  selectedItem?: string | null;
  selectedSection?: string | null;
  visibleSections?: Set<string>;
  singleProviderNpi?: string;
  selectedRowsByGrid?: { [gridName: string]: string | null };
  selectedProviderByGrid?: { [gridName: string]: any | null };
  onGridRowSelect?: (gridName: string, rowId: string | null, provider: any | null) => void;
  onClearGridRowSelect?: (gridName: string) => void;
  sidePanelOpen?: boolean;
  setSidePanelOpen?: (open: boolean) => void;
  activePanelGridName?: string | null;
  onCloseSidePanel?: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  selectedItem,
  selectedSection,
  visibleSections = new Set(),
  singleProviderNpi,
  selectedRowsByGrid = {},
  selectedProviderByGrid = {},
  onGridRowSelect,
  onClearGridRowSelect,
  sidePanelOpen = false,
  setSidePanelOpen,
  activePanelGridName,
  onCloseSidePanel,
}) => {
  const [currentGridIndex, setCurrentGridIndex] = useState(0);
  const [selectedGridName, setSelectedGridName] = useState<string | null>(null);

  // Memoize sample data for all grids only once
  const sampleDataRef = React.useRef<{ [gridName: string]: any[] }>({});
  if (Object.keys(sampleDataRef.current).length === 0) {
    gridDefinitions.forEach(grid => {
      sampleDataRef.current[grid.tableName] = generateSampleData(grid.tableName, 15);
    });
  }

  // Function to get grids based on selection and filtered sections
  const getGridsToShow = () => {
    if (singleProviderNpi) {
      // Show grids in single-provider view, filtered by visible sections
      console.log('=== SINGLE PROVIDER VIEW DEBUG ===');
      console.log('visibleSections:', Array.from(visibleSections));
      console.log('visibleSections.size:', visibleSections.size);
      console.log('all gridDefinitions:', gridDefinitions.map(g => g.tableName));
      
      if (visibleSections.size === 0) {
        console.log('No filtering, showing all grids');
        return gridDefinitions; // No filtering, show all grids (same as main view)
      }
      
      const filteredGrids = gridDefinitions.filter((grid) => visibleSections.has(grid.tableName));
      console.log('Filtered grids:', filteredGrids.map(g => g.tableName));
      console.log('Grids that should be hidden:', gridDefinitions.filter(grid => !visibleSections.has(grid.tableName)).map(g => g.tableName));
      return filteredGrids;
    }
    if (selectedItem && selectedItem !== "all-sections") {
      // Show single grid - only if it's in visible sections or no filtering
      const grid = gridDefinitions.find((g) => g.tableName === selectedItem);
      if (
        grid &&
        (visibleSections.size === 0 || visibleSections.has(selectedItem))
      ) {
        return [grid];
      }
      return [];
    }
    if (selectedSection) {
      // Show grids in section, filtered by visible sections
      const sectionGrids = getGridsByGroup(selectedSection);
      if (visibleSections.size === 0) {
        return sectionGrids; // No filtering, show all grids in section
      }
      // Filter grids based on visible sections
      return sectionGrids.filter((grid) => visibleSections.has(grid.tableName));
    }
    if (selectedItem === "all-sections") {
      // Show all grids, filtered by visible sections
      if (visibleSections.size === 0) {
        return gridDefinitions; // No filtering, show all grids
      }
      return gridDefinitions.filter((grid) =>
        visibleSections.has(grid.tableName),
      );
    }
    // Default: show Provider Info if no filtering or provider info is visible
    if (visibleSections.size === 0 || visibleSections.has("Provider_Info")) {
      const defaultGrid = gridDefinitions.find(
        (g) => g.tableName === "Provider_Info",
      );
      return defaultGrid ? [defaultGrid] : [];
    }
    return [];
  };

  const gridsToShow = getGridsToShow();
  const isMultipleGrids = gridsToShow.length > 1;

  const getDataForGrid = (gridKey: string) => {
    return sampleDataRef.current[gridKey] || [];
  };

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

  // Handler for row click in main (All Providers) view
  const handleProviderSelect = (row: any) => {
    if (!currentGrid || !onGridRowSelect) return;
    const gridName = currentGrid.tableName;
    // If clicking the already selected row, unselect and close side panel
    if (selectedRowsByGrid[gridName] === row.id) {
      onGridRowSelect(gridName, null, null);
      setSidePanelOpen(false);
      setSelectedGridName(null);
    } else {
      // Clear any previous selections from other grids first
      Object.keys(selectedRowsByGrid).forEach(existingGridName => {
        if (existingGridName !== gridName && selectedRowsByGrid[existingGridName]) {
          onGridRowSelect(existingGridName, null, null);
        }
      });
      
      onGridRowSelect(gridName, row.id, row);
      setSelectedGridName(gridName.replace(/_/g, " "));
      setSidePanelOpen(true);
    }
  };

  // Handler to close side panel
  const handleSidePanelClose = () => {
    if (onCloseSidePanel) {
      onCloseSidePanel();
    } else {
      setSidePanelOpen(false);
      setSelectedGridName(null);
      // Clear selection for the current grid only
      if (currentGrid && onClearGridRowSelect) {
        onClearGridRowSelect(currentGrid.tableName);
      }
    }
  };

  if (singleProviderNpi) {
    // Find the selected provider's info from Provider Info grid
    const providerInfoGrid = gridDefinitions.find(g => g.tableName === "Provider_Info");
    const providerRows = providerInfoGrid ? generateSampleData(providerInfoGrid.tableName, 15) : [];
    const selectedProvider = providerRows.find(row => String(row.npi_number) === String(singleProviderNpi));

    // Helper to synthesize a row for any grid, matching the selected provider's info
    function synthesizeRowForGrid(grid: typeof gridDefinitions[number]) {
      const row = generateSampleData(grid.tableName, 1)[0] || {};
      if (selectedProvider) {
        // Copy over key provider fields
        row.provider_name = selectedProvider.provider_name;
        row.npi_number = selectedProvider.npi_number;
        row.primary_specialty = selectedProvider.primary_specialty;
        row.title = selectedProvider.title;
        row.first_name = selectedProvider.first_name;
        row.last_name = selectedProvider.last_name;
        row.work_email = selectedProvider.work_email;
        row.personal_email = selectedProvider.personal_email;
        row.mobile_phone_number = selectedProvider.mobile_phone_number;
      }
      // Ensure unique ID for each grid to prevent AG Grid issues
      row.id = `${grid.tableName}-1`;
      return row;
    }

    // Handler for row click in single-provider view
    const handleSingleProviderRowClick = (row: any) => {
      if (!onGridRowSelect) return;
      
      const gridName = row._gridTableName;
      const currentSelectedRowId = selectedRowsByGrid[gridName];
      
      if (currentSelectedRowId === row.id) {
        // Unselect and close side panel if clicking the already selected row
        onGridRowSelect(gridName, null, null);
        if (onCloseSidePanel) {
          onCloseSidePanel();
        }
      } else {
        // Clear any previous selections from other grids first
        Object.keys(selectedRowsByGrid).forEach(existingGridName => {
          if (existingGridName !== gridName && selectedRowsByGrid[existingGridName]) {
            onGridRowSelect(existingGridName, null, null);
          }
        });
        
        // Select the new row and open side panel
        onGridRowSelect(gridName, row.id, row);
      }
    };

    return (
      <div className="flex flex-col flex-1 min-h-0 w-full px-4 pt-4 pb-8">
        {gridsToShow.map((grid) => {
          const row = synthesizeRowForGrid(grid);
          // Attach grid name to row for side panel title
          row._gridName = grid.tableName.replace(/_/g, " ");
          row._gridTableName = grid.tableName;
          const columns = getColumnsForGrid(grid.tableName);
          
          // Check for missing columns in row data
          const missingColumns = columns
            .map(col => col.field)
            .filter(field => !(field in row));
          if (missingColumns.length > 0) {
            console.warn('  - Missing columns in row data:', missingColumns);
          }
          
          // Get the selected row ID for this grid
          const gridSelectedRowId = selectedRowsByGrid[grid.tableName];
          
          return (
            <div key={grid.tableName} className="flex flex-col mb-8 bg-white rounded shadow" style={{ height: 122 }}>
              <DataGrid
                title={grid.tableName.replace(/_/g, " ")}
                icon={getIconByName(grid.icon)}
                data={[row]}
                columns={columns}
                onRowClicked={handleSingleProviderRowClick}
                showCheckboxes={false}
                selectedRowId={gridSelectedRowId}
              />
            </div>
          );
        })}
        {/* Side Panel for single-provider view */}
        {sidePanelOpen && activePanelGridName && selectedProviderByGrid[activePanelGridName] && (
          <SidePanel
            isOpen={sidePanelOpen}
            selectedRow={selectedProviderByGrid[activePanelGridName]}
            inputConfig={providerInfoConfig}
            onClose={handleSidePanelClose}
            title={
              activePanelGridName && selectedProviderByGrid[activePanelGridName]?.provider_name
                ? `${activePanelGridName.replace(/_/g, " ")} for ${selectedProviderByGrid[activePanelGridName].provider_name}${selectedProviderByGrid[activePanelGridName].title ? ", " + selectedProviderByGrid[activePanelGridName].title : ""}`
                : undefined
            }
          />
        )}
      </div>
    );
  }

  if (gridsToShow.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center pt-4 px-4">
        <div className="text-gray-500">No content to display</div>
      </div>
    );
  }

  const currentGrid = gridsToShow[currentGridIndex];
  const currentGridName = currentGrid ? currentGrid.tableName : null;
  
  // Use active panel grid for side panel data, fallback to current grid
  const activeGridName = activePanelGridName || currentGridName;
  const selectedRowId = activeGridName ? selectedRowsByGrid[activeGridName] : null;
  const selectedProvider = activeGridName ? selectedProviderByGrid[activeGridName] : null;

  if (!currentGrid) {
    return (
      <div className="flex-1 flex items-center justify-center pt-4 px-4">
        <div className="text-gray-500">Grid configuration not found</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      {/* Main Content Area */}
      <div className="flex flex-1 gap-4 min-h-0 pt-4 px-4">
        {/* Current Grid */}
        <div className="flex-1 flex flex-col min-h-0">
          <DataGrid
            title={currentGrid.tableName.replace(/_/g, " ")}
            icon={getIconByName(currentGrid.icon)}
            data={getDataForGrid(currentGrid.tableName)}
            columns={getColumnsForGrid(currentGrid.tableName)}
            height="100%"
            onRowClicked={handleProviderSelect}
            selectedRowId={selectedRowId}
          />
        </div>

        {/* Scroll Navigation - Next to Grid */}
        {isMultipleGrids && (
          <div className="flex flex-col items-center gap-2 pt-2 flex-shrink-0">
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

      {/* Side Panel */}
      <SidePanel
        isOpen={sidePanelOpen}
        selectedRow={selectedProvider}
        inputConfig={providerInfoConfig}
        onClose={handleSidePanelClose}
        title={
          selectedProvider && activeGridName && selectedProvider.provider_name
            ? `${activeGridName.replace(/_/g, " ")} for ${selectedProvider.provider_name}${selectedProvider.title ? ", " + selectedProvider.title : ""}`
            : undefined
        }
      />
    </div>
  );
};

export default MainContent;
