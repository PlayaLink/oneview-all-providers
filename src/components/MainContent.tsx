import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faTable } from "@fortawesome/free-solid-svg-icons";
import DataGrid from "@/components/DataGrid";
import SidePanel from "@/components/SidePanel";
import { generateSampleData } from "@/lib/dataGenerator";
import { getColumnsForGrid, getColumnsForSingleProviderView, formatProviderName } from "@/lib/columnConfigs";
import { gridDefinitions, getGridsByGroup } from "@/lib/gridDefinitions";
import { getIconByName } from "@/lib/iconMapping";
import { Provider } from "@/types";
import providerInfoConfig from "@/data/provider_info_details.json";
import { useQuery } from '@tanstack/react-query';
import { fetchProviders, fetchStateLicenses, fetchBirthInfo, fetchAddresses, fetchFacilityAffiliations } from '@/lib/supabaseClient';
import { getTemplateConfigByGrid } from '@/lib/templateConfigs';
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
// Removed: import { providerInfoTemplate, stateLicenseTemplate } from '@/lib/templateConfigs';
// Removed: import { useGridData } from '@/hooks/useGridData';

interface MainContentProps {
  selectedItem?: string | null;
  selectedSection?: string | null;
  visibleSections?: Set<string>;
  singleProviderNpi?: string;
  selectedRowsByGrid?: { [gridName: string]: string | null };
  selectedProviderByGrid?: { [gridName: string]: (any & { gridName: string }) | null };
  onGridRowSelect?: (gridName: string, rowId: string | null, provider: any | null) => void;
  onClearGridRowSelect?: (gridName: string) => void;
  onUpdateSelectedProvider?: (gridName: string, updatedProvider: any) => void; // Add this callback
  sidePanelOpen?: boolean;
  setSidePanelOpen?: (open: boolean) => void;
  activePanelGridName?: string | null;
  providerInfoData?: any[];
  user: any;
  selectedRow: (any & { gridName: string }) | null;
  onRowSelect: (row: any | null, gridName?: string) => void;
  onCloseSidePanel: () => void;
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
  onUpdateSelectedProvider,
  sidePanelOpen = false,
  setSidePanelOpen,
  activePanelGridName,
  providerInfoData = [],
  user,
  selectedRow,
  onRowSelect,
  onCloseSidePanel,
}) => {
  const { value: showFooter } = useFeatureFlag("footer");
  const { value: gridScrollArrowsLeft } = useFeatureFlag("grid_scroll_arrows_left");
  const [currentGridIndex, setCurrentGridIndex] = useState(0);
  const [selectedGridName, setSelectedGridName] = useState<string | null>(null);
  // Render the first two grids by default
  const [visibleGrids, setVisibleGrids] = useState<Set<number>>(new Set([0, 1])); // Track which grids are loaded
  
  // Add refs for grid scrolling
  const gridRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRefs = useRef<(IntersectionObserver | null)[]>([]);

  // Centralized grid data fetching (now using per-table helpers)
  const providerInfoQuery = useQuery({
    queryKey: ['providers'],
    queryFn: fetchProviders,
  });
  const stateLicensesQuery = useQuery({
    queryKey: ['state_licenses'],
    queryFn: fetchStateLicenses,
  });
  const birthInfoQuery = useQuery({
    queryKey: ['birth_info'],
    queryFn: fetchBirthInfo,
  });

  const addressesQuery = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
  });
  const facilityAffiliationsQuery = useQuery({
    queryKey: ['facility_affiliations'],
    queryFn: fetchFacilityAffiliations,
  });

  // DRY mapping of grid keys to data sources and mapping logic
  const gridDataSources: Record<string, { query: any, map: (row: any) => any }> = {
    Provider_Info: {
      query: providerInfoQuery,
      map: (row) => ({
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
      }),
    },
    State_Licenses: {
      query: stateLicensesQuery,
      map: (license) => {

        return {
          ...license,
          provider_name: license.provider ? formatProviderName(license.provider.last_name, license.provider.first_name) : '',
          title: license.provider?.title || '',
          primary_specialty: license.provider?.primary_specialty || '',
        };
      },
    },
    Birth_Info: {
      query: birthInfoQuery,
      map: (row) => {
        return {
          ...row,
          provider_name: row.provider ? formatProviderName(row.provider.last_name, row.provider.first_name) : '',
          title: row.provider?.title || '',
          primary_specialty: row.provider?.primary_specialty || '',
        };
      },
    },
    Addresses: {
      query: addressesQuery,
      map: (row) => ({
        ...row,
        provider_name: row.provider ? formatProviderName(row.provider.last_name, row.provider.first_name) : '',
        title: row.provider?.title || '',
        primary_specialty: row.provider?.primary_specialty || '',
      }),
    },
    Facility_Affiliations: {
      query: facilityAffiliationsQuery,
      map: (row) => ({
        ...row,
        provider_name: row.provider ? formatProviderName(row.provider.last_name, row.provider.first_name) : '',
        title: row.provider?.title || '',
        primary_specialty: row.provider?.primary_specialty || '',
      }),
    },
    // Add more grids as needed
  };

  // Function to get data for each grid (now DRY)
  const getDataForGrid = (gridKey: string) => {
    const source = gridDataSources[gridKey];
    if (source) {
      const { data } = source.query;
      if (!data) return [];
      return data.map(source.map);
    }
    // For all other grids, return empty
    return [];
  };

  // Function to get grids based on selection and filtered sections
  const getGridsToShow = () => {
    if (singleProviderNpi) {
      // Show grids in single-provider view, filtered by visible sections
      if (visibleSections.size === 0) {
        return gridDefinitions; // No filtering, show all grids (same as main view)
      }
      
      const filteredGrids = gridDefinitions.filter((grid) => visibleSections.has(grid.tableName));
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

  // Function to get provider info data for single provider view (without provider-specific columns)
  const getProviderInfoDataForSingleView = () => {
    if (!providerInfoData || !singleProviderNpi) return [];
    
    const provider = providerInfoData.find(row => String(row.npi_number) === String(singleProviderNpi));
    if (!provider) return [];
    
    // Return provider data without provider-specific fields
    return [{
      id: provider.id,
      // Remove provider-specific fields for single provider view
      // provider_name, title, primary_specialty are excluded
      npi_number: provider.npi_number || '',
      work_email: provider.work_email || '',
      personal_email: provider.personal_email || '',
      mobile_phone_number: provider.mobile_phone_number || '',
      tags: provider.tags || [],
      last_updated: provider.last_updated || '',
      // Include the original data for side panel
      ...provider,
    }];
  };

  // Function to transform provider-specific state licenses data
  const getProviderStateLicensesData = () => {
    if (!stateLicensesQuery.data) return [];
    
    return stateLicensesQuery.data.map((license) => ({
      id: license.id,
      // Remove provider-specific fields for single provider view
      // provider_name, title, primary_specialty are excluded
      license_type: license.license_type || '',
      license_additional_info: license.license_additional_info || '',
      state: license.state || '',
      status: license.status || '',
      issue_date: license.issue_date || '',
      expiration_date: license.expiration_date || '',
      expires_within: license.expires_within || '',
      tags: license.tags || [],
      last_updated: license.last_updated || '',
      // Include the original data for side panel
      ...license,
    }));
  };

  const handlePrevious = () => {
    const newIndex = currentGridIndex > 0 ? currentGridIndex - 1 : gridsToShow.length - 1;
    setCurrentGridIndex(newIndex);
    
    // Add the new grid to visible grids for lazy loading
    setVisibleGrids(prev => new Set([...prev, newIndex]));
    
    // Smooth scroll within the grid container
    setTimeout(() => {
      const targetGrid = gridRefs.current[newIndex];
      const scrollContainer = containerRef.current?.querySelector('[role="grid-scroll-container"]') as HTMLElement;
      if (targetGrid && scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const targetRect = targetGrid.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop + (targetRect.top - containerRect.top);
        
        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleNext = () => {
    const newIndex = currentGridIndex < gridsToShow.length - 1 ? currentGridIndex + 1 : 0;
    setCurrentGridIndex(newIndex);
    
    // Add the new grid to visible grids for lazy loading
    setVisibleGrids(prev => new Set([...prev, newIndex]));
    
    // Smooth scroll within the grid container
    setTimeout(() => {
      const targetGrid = gridRefs.current[newIndex];
      const scrollContainer = containerRef.current?.querySelector('[role="grid-scroll-container"]') as HTMLElement;
      if (targetGrid && scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const targetRect = targetGrid.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop + (targetRect.top - containerRect.top);
        
        scrollContainer.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    }, 100);
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
    }
    setSidePanelOpen(false);
    setSelectedGridName(null);
    // Always clear selection for the active panel grid
    if (activePanelGridName && onClearGridRowSelect) {
      onClearGridRowSelect(activePanelGridName);
    } else if (currentGrid && onClearGridRowSelect) {
      onClearGridRowSelect(currentGrid.tableName);
    }
  };

  // Function to get the appropriate template configuration for the active grid
  const getTemplateConfigForActiveGrid = () => {
    // Use activePanelGridName if available, otherwise use selectedRow.gridName
    const gridName = activePanelGridName || selectedRow?.gridName;
    const templateConfig = gridName ? getTemplateConfigByGrid(gridName) : null;
    
    if (templateConfig && Array.isArray(templateConfig.fieldGroups)) {
      const fields = templateConfig.fieldGroups.flatMap(group => group.fields);
      return fields;
    }
    
    // fallback to providerInfoConfig or an empty array
    return providerInfoConfig;
  };

  // Memoize inputConfig for SidePanel
  const inputConfig = useMemo(() => getTemplateConfigForActiveGrid(), [activePanelGridName]);

  // Define handleRowClick before usage
  const handleRowClick = (row: any, gridName: string) => {
    if (selectedRow && selectedRow.id === row.id && selectedRow.gridName === gridName) {
      onRowSelect(null);
    } else {
      onRowSelect(row, gridName);
    }
  };

  const handleGridInView = useCallback((index: number) => {
    setVisibleGrids(prev => {
      if (!prev.has(index)) {
        return new Set([...prev, index]);
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    gridsToShow.forEach((_, index) => {
      const gridEl = gridRefs.current[index];
      if (!gridEl) return;
      if (observerRefs.current[index]) {
        observerRefs.current[index]?.disconnect();
      }
      observerRefs.current[index] = new window.IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            handleGridInView(index);
          }
        },
        { threshold: 0 } // Trigger as soon as the top of the grid enters the viewport
      );
      observerRefs.current[index]?.observe(gridEl);
    });
    return () => {
      observerRefs.current.forEach((observer) => observer?.disconnect());
    };
  }, [gridsToShow, handleGridInView]);

  if (singleProviderNpi) {
    // Find the selected provider's info from live providerInfoData (Supabase)
    const providerInfoGrid = gridDefinitions.find(g => g.tableName === "Provider_Info");
    const stateLicensesGrid = gridDefinitions.find(g => g.tableName === "State_Licenses");
    const providerRows = Array.isArray(providerInfoData) ? providerInfoData : [];
    const selectedProvider = providerRows.find(row => String(row.npi_number) === String(singleProviderNpi));

    // Handler for row click in single-provider view
    const handleSingleProviderRowClick = (row: any) => {
      if (!onGridRowSelect) return;
      const gridName = providerInfoGrid?.tableName || "Provider_Info";
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

    // Handler for state license row click
    const handleStateLicenseRowClick = (row: any) => {
      if (!onGridRowSelect) return;
      const gridName = stateLicensesGrid?.tableName || "State_Licenses";
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
        {/* Provider Info Grid */}
        {providerInfoGrid && (
          <div key={providerInfoGrid.tableName} className="flex flex-col mb-8 bg-white rounded shadow" style={{ height: 122 }}>
            <DataGrid
              title={providerInfoGrid.tableName.replace(/_/g, " ")}
              icon={getIconByName(providerInfoGrid.icon)}
              data={getProviderInfoDataForSingleView()}
              columns={getColumnsForSingleProviderView(providerInfoGrid.tableName)}
              onRowClicked={handleSingleProviderRowClick}
              showCheckboxes={false}
              selectedRowId={selectedRowsByGrid[providerInfoGrid.tableName]}
            />
          </div>
        )}

        {/* State Licenses Grid */}
        {stateLicensesGrid && (
          <div key={stateLicensesGrid.tableName} className="flex flex-col mb-8 bg-white rounded shadow" style={{ height: 400 }}>
            {stateLicensesQuery.isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Loading state licenses...</div>
              </div>
            ) : stateLicensesQuery.error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-500">Error loading state licenses: {stateLicensesQuery.error.message}</div>
              </div>
            ) : (
              <DataGrid
                title={`${stateLicensesGrid.tableName.replace(/_/g, " ")} for ${selectedProvider?.provider_name || 'Provider'}`}
                icon={getIconByName(stateLicensesGrid.icon)}
                data={getProviderStateLicensesData()}
                columns={getColumnsForSingleProviderView(stateLicensesGrid.tableName)}
                onRowClicked={handleStateLicenseRowClick}
                showCheckboxes={false}
                selectedRowId={selectedRowsByGrid[stateLicensesGrid.tableName]}
              />
            )}
          </div>
        )}

        {/* Side Panel for single-provider view */}
        {sidePanelOpen && activePanelGridName && selectedProviderByGrid[activePanelGridName] && (
          <SidePanel
            isOpen={sidePanelOpen}
            selectedRow={selectedProviderByGrid[activePanelGridName]}
            inputConfig={getTemplateConfigForActiveGrid()}
            onClose={handleSidePanelClose}
            title={
              activePanelGridName && selectedProviderByGrid[activePanelGridName]?.provider_name
                ? `${activePanelGridName.replace(/_/g, " ")} for ${selectedProviderByGrid[activePanelGridName].provider_name}${selectedProviderByGrid[activePanelGridName].title ? ", " + selectedProviderByGrid[activePanelGridName].title : ""}`
                : undefined
            }
            user={user}
            onUpdateSelectedProvider={onUpdateSelectedProvider}
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

  // Show loading state for State Licenses grid
  if (currentGrid.tableName === "State_Licenses" && stateLicensesQuery.isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center pt-4 px-4">
        <div className="text-gray-500">Loading state licenses...</div>
      </div>
    );
  }

  // Show error state for State Licenses grid
  if (currentGrid.tableName === "State_Licenses" && stateLicensesQuery.error) {
    return (
      <div className="flex-1 flex items-center justify-center pt-4 px-4">
        <div className="text-red-500">Error loading state licenses: {stateLicensesQuery.error.message}</div>
      </div>
    );
  }
  console.log("gridsToShow", gridsToShow);


  return (
    <div className="flex-1 flex flex-col min-h-0 h-full" role="region" aria-label="Main Content" data-testid="main-content">
      {/* Main Content Area */}
      <div ref={containerRef} className={`flex flex-1 gap-2 min-h-0 pt-2 ${gridScrollArrowsLeft ? 'flex-row-reverse pl-2 pr-4' : 'pl-4 pr-2'}`}>
          {/* Grids Container */}
        <div className="flex-1 flex flex-col min-h-0">
          <div 
            role="grid-scroll-container" 
            aria-label="Grid Scroll Container"
            className={`overflow-y-auto flex-1${showFooter ? ' pb-24' : ''}`}
          >
            {gridsToShow.map((grid, index) => (
              <div
                key={grid.tableName}
                ref={(el) => gridRefs.current[index] = el}
                className="flex flex-col min-h-0 mb-4 last:mb-0 h-full"
              >
                {/* Only render DataGrid if it's been visited or is the current grid */}
                {visibleGrids.has(index) ? (
                  <DataGrid
                    title={grid.tableName.replace(/_/g, " ")}
                    icon={getIconByName(grid.icon)}
                    data={getDataForGrid(grid.tableName)}
                    columns={getColumnsForGrid(grid.tableName)}
                    height="100%"
                    onRowClicked={(row) => handleRowClick(row, grid.tableName)}
                    selectedRowId={selectedRow && selectedRow.gridName === grid.tableName ? selectedRow.id : null}
                  />
                ) : (
                  // Placeholder for unloaded grids
                  <div 
                    className="flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded flex-1"
                  >
                    <div className="text-gray-500 text-center">
                      <FontAwesomeIcon icon={faTable} className="w-8 h-8 mb-2" />
                      <p>Click navigation to load {grid.tableName.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Navigation - Always Visible */}
        {isMultipleGrids && (
          <div className="flex flex-col items-center gap-2 flex-shrink-0" role="grid-scroll-navigation" aria-label="Grid Scroll Navigation">
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
                aria-label="Previous grid"
                data-testid="previous-grid-button"
              >
                <FontAwesomeIcon
                  icon={faChevronUp}
                  className="w-4 h-4 text-white"
                />
              </button>
              <button
                onClick={handleNext}
                className="flex items-center justify-center w-6 h-6 text-white hover:bg-white hover:bg-opacity-10 transition-colors rounded"
                aria-label="Next grid"
                data-testid="next-grid-button"
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
      {selectedRow && (
        <SidePanel
          isOpen={!!selectedRow}
          selectedRow={selectedRow}
          inputConfig={getTemplateConfigForActiveGrid()}
          onClose={onCloseSidePanel}
          title={
            selectedRow?.provider_name
              ? `${selectedRow.gridName.replace(/_/g, " ")} for ${selectedRow.provider_name}${selectedRow.title ? ", " + selectedRow.title : ""}`
              : undefined
          }
          user={user}
          onUpdateSelectedProvider={onUpdateSelectedProvider}
        />
      )}
    </div>
  );
};

export default MainContent;
