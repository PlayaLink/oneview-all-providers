import React, { useEffect, useState, useRef, useCallback } from "react";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import SideNav from "@/components/SideNav";
import HorizontalNavNew from "@/components/HorizontalNavNew";
import AllProvidersHeader from "@/components/AllProvidersHeader";
// import MainContent from "@/components/MainContent"; // Currently unused

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { supabase, fetchGridDefinitions, fetchGridSections, fetchFacilityRequirementValuesByFacility } from '@/lib/supabaseClient';
import { useUser } from '@/contexts/UserContext';
import { useFeatureFlag } from '@/contexts/FeatureFlagContext';
import GridDataFetcher from "./GridDataFetcher";
import { getIconByName } from "@/lib/iconMapping";
import { useSectionFilterStore } from "@/lib/useVisibleSectionsStore";
import SidePanel from "@/components/SidePanel";
import { getTemplateConfigByGrid } from "@/lib/templateConfigs";
import { getOrderedSectionsAndGrids } from "@/lib/gridOrdering";
import { FacilityDetailsModal } from "./FacilityDetailsModal";
import GridItemDetailModal from "./GridItemDetailModal";

const fetchProviders = async () => {
  const { data, error } = await supabase.from('providers').select('*');
  if (error) throw error;
  return data;
};

// Helper component to render the grids section (DRY)
function GridsSection({
  gridsToShow,
  gridHeight,
  gridsLoading,
  gridsError,
  selectedRow,
  handleRowSelect,
  getIconByName,
  handleCloseSidePanel,
  providerInfoData,
  user,
  selectedProviderInfo,
  handleProviderSelect,
  handleShowFacilityDetails,
  onOpenDetailModal,
  handleAddRecord,
  inputConfig,
  setDetailModalRow,
  setSelectedRow,
  setShowDetailModal,
  ...rest
}: any) {
  // Add refs for each grid container
  const gridRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [currentGridIndex, setCurrentGridIndex] = React.useState(0);

  // Debug: Log gridsToShow
  // Debug: GridsSection Debug
    gridsToShow: gridsToShow.length,
    gridsToShowData: gridsToShow.map(item => ({
      type: item.type,
      gridKey: item.grid?.key,
      gridDisplayName: item.grid?.display_name,
      gridGroup: item.grid?.group,
      sectionKey: item.section?.key
    }))
  });

  // Scroll to a specific grid by index
  const scrollToGrid = (idx: number) => {
    const gridEl = gridRefs.current[idx];
    if (gridEl && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Calculate the offset of the grid relative to the scroll container
      const gridTop = gridEl.offsetTop - container.offsetTop;
      container.scrollTo({ top: gridTop, behavior: "smooth" });
      setCurrentGridIndex(idx);
    }
  };

  // Handlers for arrows
  const handleScrollUp = () => {
    if (currentGridIndex > 0) {
      scrollToGrid(currentGridIndex - 1);
    }
  };
  const handleScrollDown = () => {
    if (currentGridIndex < gridsToShow.length - 1) {
      scrollToGrid(currentGridIndex + 1);
    }
  };

  // Optionally, update currentGridIndex on manual scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
    let closestIdx = 0;
    let minDistance = Infinity;
    gridRefs.current.forEach((el, idx) => {
      if (el) {
        const dist = Math.abs(el.getBoundingClientRect().top - containerTop);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      }
    });
    setCurrentGridIndex(closestIdx);
  };

  // Helper to get only grid items for refs
  const gridItems = gridsToShow;

  return (
    <section className="flex-1 min-h-0 flex flex-row" role="region" aria-label="Grids list" data-testid="grids-list">
      {/* Grids List, Scroll Arrows, and SidePanel Side by Side */}
      <div className="flex-1 min-h-0 flex flex-row px-4">
        {/* Grids List */}
        <div className="flex-1 min-h-0 overflow-y-auto" data-testid="grids-scroll-container" ref={scrollContainerRef} onScroll={handleScroll}>
          {gridsLoading ? (
            <div className="flex-1 flex items-center justify-center pt-4 px-4">
              <div className="text-gray-500">Loading grids...</div>
            </div>
          ) : gridsError ? (
            <div className="flex-1 flex items-center justify-center pt-4 px-4">
              <div className="text-red-500">Error loading grids: {gridsError.message}</div>
            </div>
          ) : gridsToShow.length === 0 ? (
            <div className="flex-1 flex items-center justify-center pt-4 px-4">
              <div className="text-gray-500">No content to display</div>
            </div>
          ) : (
            <div>
              {gridsToShow.map((item: any, idx: number) => (
                <div
                  key={item.grid.key}
                  ref={el => (gridRefs.current[idx] = el)}
                  style={{ marginBottom: 16 }}
                  data-testid={`grid-container-${item.grid.key}`}
                >
                  <GridDataFetcher
                    gridKey={item.grid.key}
                    titleOverride={item.grid.display_name}
                    iconOverride={item.grid.icon}
                    height={gridHeight}
                    onRowClicked={(row: any) => handleRowSelect(row, item.grid.key)}
                    handleShowFacilityDetails={handleShowFacilityDetails}
                    selectedRowId={selectedRow?.id}
                    selectedGridKey={selectedRow?.gridKey}
                    onOpenDetailModal={onOpenDetailModal}
                    onAddRecord={handleAddRecord}
                    pinActionsColumn={!selectedRow}
                    isSidePanelOpen={!!selectedRow}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {gridItems.length > 1 && (
          <div className="flex flex-col items-center justify-center gap-2 pl-0 sticky top-0 self-start" style={{ minWidth: 40 }} role="group" aria-label="Scroll controls" data-testid="grids-scroll-arrows">
            <button
              onClick={handleScrollUp}
              disabled={currentGridIndex === 0}
              aria-label="Scroll to previous grid"
              data-testid="scroll-up-arrow"
              className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              role="button"
            >
              <Icon icon="chevron-up" />
            </button>
            <button
              onClick={handleScrollDown}
              disabled={currentGridIndex === gridItems.length - 1}
              aria-label="Scroll to next grid"
              data-testid="scroll-down-arrow"
              className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              role="button"
            >
              <Icon icon="chevron-down" />
            </button>
          </div>
        )}
        {/* SidePanel - rendered inline next to grids list */}
        <SidePanel
          isOpen={!!selectedRow}
          selectedRow={selectedRow}
          inputConfig={inputConfig}
          onClose={handleCloseSidePanel}
          user={user}
          onExpandDetailModal={() => {
            setDetailModalRow(selectedRow);
            setSelectedRow(null);
            setShowDetailModal(true);
          }}
        />
      </div>
    </section>
  );
}

const AllRecords: React.FC = () => {
  const { user } = useUser();
  const { provider_id } = useParams<{ provider_id?: string }>();
  const navigate = useNavigate();
  const { value: isLeftNav, isLoading: navLoading } = useFeatureFlag("left_nav");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>("provider_info");
  // Remove local visibleSections and setVisibleSections state
  // const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [selectedRow, setSelectedRow] = useState<(any & { gridKey: string }) | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailModalRow, setDetailModalRow] = useState<any>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // Facility details modal state
  const [facilityDetailsModal, setFacilityDetailsModal] = useState<{
    isOpen: boolean;
    facility: any | null;
    requirementValues: any[];
  }>({
    isOpen: false,
    facility: null,
    requirementValues: [],
  });

  const globalNavRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const horizontalNavRef = useRef<HTMLDivElement>(null);
  const [gridHeight, setGridHeight] = useState<number>(400);

  const calculateGridHeight = useCallback(() => {
    const viewportHeight = window.innerHeight;
    const globalNavHeight = globalNavRef.current?.offsetHeight || 0;
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const horizontalNavHeight = (!isLeftNav && horizontalNavRef.current) ? horizontalNavRef.current.offsetHeight : 0;
    const totalHeaderHeight = globalNavHeight + headerHeight + horizontalNavHeight;
    setGridHeight(Math.max(viewportHeight - totalHeaderHeight -175, 200)); // 200px min height
  }, [isLeftNav]);

  useEffect(() => {
    calculateGridHeight();
    window.addEventListener('resize', calculateGridHeight);
    return () => window.removeEventListener('resize', calculateGridHeight);
  }, [calculateGridHeight]);

  const { data: providerInfoData, isLoading, error } = useQuery<any[], Error>({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });

  // Fetch grid definitions from backend
  const { data: gridDefs = [], isLoading: gridsLoading, error: gridsError } = useQuery({
    queryKey: ["grid_definitions"],
    queryFn: fetchGridDefinitions,
    initialData: [],
  });

  // Fetch grid sections from backend
  const { data: gridSections = [], isLoading: sectionsLoading, error: sectionsError } = useQuery({
    queryKey: ["grid_sections"],
    queryFn: fetchGridSections,
    initialData: [],
  });

  // Helper to get grids by group from backend grid definitions
  // const getGridsByGroup = (group: string) => gridDefs.filter((g: any) => g.group === group);

  const providerSearchList = React.useMemo(() => (
    Array.isArray(providerInfoData)
      ? providerInfoData.map(row => ({
          provider_id: row.id,
          fullName: `${row.first_name || ""} ${row.last_name || ""}`.trim(),
          firstName: row.first_name || "",
          lastName: row.last_name || "",
          title: row.title || "",
          npi: row.npi_number || "",
          specialty: row.primary_specialty || "",
          email: row.work_email || row.personal_email || "",
        }))
      : []
  ), [providerInfoData]);

  const selectedProviderInfo = provider_id
    ? providerSearchList.find(p => String(p.provider_id) === String(provider_id))
    : undefined;

  useEffect(() => {
    if (!selectedSection && !selectedItem) {
      setSelectedSection("provider_info");
    }
  }, [selectedSection, selectedItem]);

  useEffect(() => {
    if (!navLoading && !isLeftNav && !selectedSection) {
      setSelectedSection("provider_info");
    }
  }, [isLeftNav, navLoading, selectedSection]);

  const handleItemSelect = (item: string) => {
    setSelectedItem(item);
    setSelectedSection(null);
  };

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section);
    setSelectedItem(null);
  };

  const handleSectionVisibilityChange = (
    sectionKey: string,
    visible: boolean,
  ) => {
    // setVisibleSections((prev) => { // This line is removed
    //   const newSet = new Set(prev);
    //   if (visible) {
    //     newSet.add(sectionKey);
    //   } else {
    //     newSet.delete(sectionKey);
    //   }
    //   return newSet;
    // });
  };

  const handleProviderSelect = (providerId: string) => {
    if (providerId) {
      navigate(`/${providerId}`);
    } else {
      navigate("/");
    }
  };

  const handleRowSelect = (row: any | null, gridKey?: string) => {
    // If clicking the already selected row, unselect it and close sidepanel
    if (row && gridKey && selectedRow && selectedRow.id === row.id && selectedRow.gridKey === gridKey) {
      setSelectedRow(null);
    } else if (row) {
      // Use gridKey from row data if available, otherwise use the parameter
      const effectiveGridKey = row.gridKey || gridKey;
      if (effectiveGridKey) {
        setSelectedRow({ ...row, gridKey: effectiveGridKey });
      }
    } else {
      setSelectedRow(null);
    }
  };

  const handleCloseSidePanel = () => {
    setSelectedRow(null);
  };

  // Handler for showing facility details modal
  const handleShowFacilityDetails = async (facilityAffiliation: any) => {
    try {

      
      // After the database refactor, facility_affiliations now has facility_id
      if (!facilityAffiliation.facility_id) {
        // Warning: No facility_id found in facility affiliation
        // Create a facility object with just the name for display
        const facility = {
          id: 'unknown',
          label: facilityAffiliation.facility_name || 'Unknown Facility',
          icon: undefined,
          properties: [], // Include properties field for consistency
          requirements: [],
          providers: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setFacilityDetailsModal({
          isOpen: true,
          facility,
          requirementValues: [],
        });
        return;
      }
      
      // Fetch facility details with all data using the new view
      const { data: facility, error: facilityError } = await supabase
        .from('facilities_with_all_data')
        .select('*')
        .eq('id', facilityAffiliation.facility_id)
        .single();
      
      if (facilityError || !facility) {
        // Warning: No facility found with id
        // Create a facility object with just the name for display
        const fallbackFacility = {
          id: facilityAffiliation.facility_id,
          label: facilityAffiliation.facility_name || 'Unknown Facility',
          icon: undefined,
          properties: [], // Include properties field for consistency
          requirements: [],
          providers: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setFacilityDetailsModal({
          isOpen: true,
          facility: fallbackFacility,
          requirementValues: [],
        });
        return;
      }
      

      
      // Now fetch facility requirement values for this facility
      const requirementValues = await fetchFacilityRequirementValuesByFacility(facility.id);

      
      // Pass the complete facility object with all data (including properties)
      const facilityForModal = facility;
      

      
      setFacilityDetailsModal({
        isOpen: true,
        facility: facilityForModal,
        requirementValues,
      });
    } catch (error) {
      // Error: Error fetching facility details
    }
  };

  const handleCloseFacilityDetailsModal = () => {
    setFacilityDetailsModal({
      isOpen: false,
      facility: null,
      requirementValues: [],
    });
  };

  const handleOpenDetailModal = (row: any, gridKey: string) => {
    const rowWithGridKey = { ...row, gridKey };
    setDetailModalRow(rowWithGridKey);
    setShowDetailModal(true);
    setIsCreateMode(false);
  };

  const handleAddRecord = (gridKey: string) => {
    const rowWithGridKey = { gridKey };
    setDetailModalRow(rowWithGridKey);
    setShowDetailModal(true);
    setIsCreateMode(true);
  };

  const handleAddProvider = () => {
    handleAddRecord("provider_info");
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailModalRow(null);
    setIsCreateMode(false);
    setSelectedRow(null); // Clear the main selectedRow when modal closes
  };

  const handleRecordCreated = (newRecord: any) => {
    // Refresh the grid data after creating a new record
    // This will be handled by the query invalidation in GridItemDetails
    // Debug: New record created
  };

  // Use sectionFilters for filtering
  const sectionFilters = useSectionFilterStore((s) => s.sectionFilters);

  // Use shared utility for grouping/ordering
  const { grouped, flat } = React.useMemo(() => getOrderedSectionsAndGrids(gridSections, gridDefs, sectionFilters), [gridSections, gridDefs, sectionFilters]);

  // Debug: Log grid system data
  // Debug: AllRecords Grid System Debug
    selectedItem,
    selectedSection,
    gridDefs: gridDefs.length,
    gridSections: gridSections.length,
    sectionFilters: sectionFilters?.size || 0,
    grouped: grouped.length,
    flat: flat.length,
    flatItems: flat.map(item => ({
      type: item.type,
      gridKey: item.grid?.key,
      gridDisplayName: item.grid?.display_name,
      gridGroup: item.grid?.group,
      sectionKey: item.section?.key
    }))
  });

  // Helper to determine which grids to show in all-records view (backend-driven)
  const getGridsToShow = () => {
    // Debug: getGridsToShow Debug
      selectedItem,
      selectedSection,
      flatLength: flat.length,
      groupedLength: grouped.length
    });

    if (selectedItem === "all-sections") {
      // Show all visible grids, grouped and ordered, flat list
      const result = flat.filter(item => item.type === 'grid');
      // Debug: All-sections result
      return result;
    } else if (selectedItem) {
      // Single grid selected
      const grid = gridDefs.find((g: any) => g.table_name === selectedItem || g.key === selectedItem);
      if (!grid) return [];
      // Find the section for this grid
      const section = gridSections.find((s: any) => s.key === grid.group);
      return [{ type: 'grid', grid, section }];
    } else if (selectedSection) {
      // Grids in a section
      const group = grouped.find(g => g.section.key === selectedSection);
      if (!group || !group.grids.length) return [];
      // Just return grid items for this section
      const result = group.grids.map(grid => ({ type: 'grid', grid, section: group.section }));
      // Debug: Section result
      return result;
    } else {
      // Fallback: show all visible grids
      const result = flat.filter(item => item.type === 'grid');
      // Debug: Fallback result
      return result;
    }
  };

  const gridsToShow = getGridsToShow();

  // Remove normalizeGridName and use selectedRow?.gridKey directly
  const templateConfig = selectedRow?.gridKey
    ? getTemplateConfigByGrid(selectedRow.gridKey)
    : null;

  const inputConfig = templateConfig
    ? templateConfig.fieldGroups.flatMap(group =>
        group.fields.map(field => ({
          ...field,
          group: group.title, // Add group title for collapsible sections if needed
        }))
      )
    : [];

  // Generate inputConfig for modal based on detailModalRow
  const modalTemplateConfig = detailModalRow?.gridKey
    ? getTemplateConfigByGrid(detailModalRow.gridKey, 'modal')
    : null;

  const modalInputConfig = modalTemplateConfig
    ? modalTemplateConfig.fieldGroups.flatMap(group =>
        group.fields.map(field => ({
          ...field,
          group: group.title, // Add group title for collapsible sections if needed
        }))
      )
    : [];


  return (
    <>
      {/* GridItemDetailModal (expandable modal) */}
      <GridItemDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        selectedRow={detailModalRow}
        inputConfig={modalInputConfig}
        title={modalTemplateConfig?.name || detailModalRow?.gridKey || "Details"}
        user={user}
        onUpdateSelectedProvider={(gridKey: string, updatedProvider: any) => {
          // Update the detailModalRow state when changes are saved
          setDetailModalRow(updatedProvider);
        }}
        isCreateMode={isCreateMode}
        onRecordCreated={handleRecordCreated}
      />
      {/* Global Navigation (add ref) */}
      <div ref={globalNavRef} id="global-navigation-ref" />
      {/* All Providers Header (add ref) */}
      <div ref={headerRef} id="all-providers-header-ref">
        <AllProvidersHeader
          provider={selectedProviderInfo ? {
            id: selectedProviderInfo.provider_id,
            provider_name: selectedProviderInfo.fullName,
            npi_number: selectedProviderInfo.npi,
            title: selectedProviderInfo.title,
            primary_specialty: selectedProviderInfo.specialty,
            work_email: selectedProviderInfo.email,
            first_name: selectedProviderInfo.firstName,
            last_name: selectedProviderInfo.lastName,
          } : undefined}
          onAddProvider={handleAddProvider}
        />
      </div>
      {/* Main Content */}
      {navLoading || isLeftNav ? (
        <div className="flex-1 min-h-0 h-full flex flex-row">
            <aside
              className={cn(
                "relative bg-white transition-all duration-300 flex flex-col h-full min-h-0",
                sidebarCollapsed ? "w-0" : "w-48",
              )}
              role="complementary"
              aria-label="Sidebar navigation"
              data-testid="sidebar-navigation"
            >
              <SideNav
                collapsed={sidebarCollapsed}
                selectedItem={selectedItem}
                selectedSection={selectedSection}
                onItemSelect={handleItemSelect}
                onSectionSelect={handleSectionSelect}
                gridSections={gridSections}
                gridDefs={gridDefs}
              />
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="absolute w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-20"
                style={{
                  right: sidebarCollapsed ? "-28px" : "-12px",
                  top: "-12px",
                }}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={!sidebarCollapsed}
                data-testid="sidebar-toggle"
              >
                {sidebarCollapsed ? (
                  <Icon icon="chevron-right" className="w-4 h-4" aria-hidden="true" />
                ) : (
                                      <Icon icon="chevron-left" className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </aside>
            {/* Use GridsSection for DRY rendering */}
            <GridsSection
              gridsToShow={gridsToShow}
              gridHeight={gridHeight}
              gridsLoading={gridsLoading}
              gridsError={gridsError}
              selectedRow={selectedRow}
              handleRowSelect={handleRowSelect}
              getIconByName={getIconByName}
              handleCloseSidePanel={handleCloseSidePanel}
              providerInfoData={providerInfoData}
              user={user}
              selectedProviderInfo={selectedProviderInfo}
              handleProviderSelect={handleProviderSelect}
              handleShowFacilityDetails={handleShowFacilityDetails}
              onOpenDetailModal={handleOpenDetailModal}
              inputConfig={inputConfig}
              setDetailModalRow={setDetailModalRow}
              setSelectedRow={setSelectedRow}
              setShowDetailModal={setShowDetailModal}
              handleAddRecord={handleAddRecord}
              // Remove visibleSections and handleSectionVisibilityChange props
              // visibleSections={visibleSections}
              // handleSectionVisibilityChange={handleSectionVisibilityChange}
            />
        </div>
      ) : (
        <div className="flex-1 min-h-0 h-full flex flex-col">
            {/* HorizontalNav (add ref) */}
            <div ref={horizontalNavRef} id="horizontal-nav-ref">
              <HorizontalNavNew
                selectedSection={selectedSection}
                onSectionSelect={handleSectionSelect}
                gridSections={gridSections}
              />
            </div>
            {/* Use GridsSection for DRY rendering */}
            <GridsSection
              gridsToShow={gridsToShow}
              gridHeight={gridHeight}
              gridsLoading={gridsLoading}
              gridsError={gridsError}
              selectedRow={selectedRow}
              handleRowSelect={handleRowSelect}
              getIconByName={getIconByName}
              handleCloseSidePanel={handleCloseSidePanel}
              providerInfoData={providerInfoData}
              user={user}
              selectedProviderInfo={selectedProviderInfo}
              handleProviderSelect={handleProviderSelect}
              handleShowFacilityDetails={handleShowFacilityDetails}
              onOpenDetailModal={handleOpenDetailModal}
              inputConfig={inputConfig}
              setDetailModalRow={setDetailModalRow}
              setSelectedRow={setSelectedRow}
              setShowDetailModal={setShowDetailModal}
              handleAddRecord={handleAddRecord}
            />
        </div>
      )}
      
      {/* Facility Details Modal */}
      {facilityDetailsModal.isOpen && facilityDetailsModal.facility && (
        <FacilityDetailsModal
          isOpen={facilityDetailsModal.isOpen}
          onClose={handleCloseFacilityDetailsModal}
          facility={facilityDetailsModal.facility}
          requirementValues={facilityDetailsModal.requirementValues}
        />
      )}
    </>
  );
};

export default AllRecords;
