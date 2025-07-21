import React, { useEffect, useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserPlus,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import SideNav from "@/components/SideNav";
import HorizontalNav from "@/components/HorizontalNav";
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
  ...rest
}: any) {
  // Add refs for each grid container
  const gridRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [currentGridIndex, setCurrentGridIndex] = React.useState(0);

  // Debug: Log gridsToShow
  console.log('[DEBUG] GridsSection gridsToShow:', gridsToShow.map(g => g.key || g.table_name));

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
      {/* Grids List and Scroll Arrows Side by Side */}
      <div className="flex-1 min-h-0 flex flex-row pl-4 pt-4">
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
                    iconOverride={getIconByName(item.grid.icon)}
                    height={gridHeight}
                    onRowClicked={(row: any) => handleRowSelect(row, item.grid.key)}
                    handleShowFacilityDetails={handleShowFacilityDetails}
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
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
            <button
              onClick={handleScrollDown}
              disabled={currentGridIndex === gridItems.length - 1}
              aria-label="Scroll to next grid"
              data-testid="scroll-down-arrow"
              className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              role="button"
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </div>
        )}
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
  const [selectedRow, setSelectedRow] = useState<(any & { gridName: string }) | null>(null);

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

  const handleRowSelect = (row: any | null, gridName?: string) => {
    // Debug: Log handleRowSelect call
    console.log('[AllRecords] handleRowSelect called:', { row, gridName });
    if (row && gridName) {
      setSelectedRow({ ...row, gridName });
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
      console.log('Facility affiliation data:', facilityAffiliation);
      
      // After the database refactor, facility_affiliations now has facility_id
      if (!facilityAffiliation.facility_id) {
        console.warn('No facility_id found in facility affiliation:', facilityAffiliation);
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
        console.warn('No facility found with id:', facilityAffiliation.facility_id);
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
      
      console.log('Found facility with all data:', facility);
      
      // Now fetch facility requirement values for this facility
      const requirementValues = await fetchFacilityRequirementValuesByFacility(facility.id);
      console.log('Facility requirement values payload:', requirementValues);
      
      // Pass the complete facility object with all data (including properties)
      const facilityForModal = facility;
      
      console.log('Facility object being passed to modal:', facilityForModal);
      
      setFacilityDetailsModal({
        isOpen: true,
        facility: facilityForModal,
        requirementValues,
      });
    } catch (error) {
      console.error('Error fetching facility details:', error);
    }
  };

  const handleCloseFacilityDetailsModal = () => {
    setFacilityDetailsModal({
      isOpen: false,
      facility: null,
      requirementValues: [],
    });
  };

  // Use sectionFilters for filtering
  const sectionFilters = useSectionFilterStore((s) => s.sectionFilters);

  // Use shared utility for grouping/ordering
  const { grouped, flat } = React.useMemo(() => getOrderedSectionsAndGrids(gridSections, gridDefs, sectionFilters), [gridSections, gridDefs, sectionFilters]);

  // Helper to determine which grids to show in all-records view (backend-driven)
  const getGridsToShow = () => {
    if (selectedItem === "all-sections") {
      // Show all visible grids, grouped and ordered, flat list
      return flat.filter(item => item.type === 'grid');
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
      return group.grids.map(grid => ({ type: 'grid', grid, section: group.section }));
    } else {
      // Fallback: show all visible grids
      return flat.filter(item => item.type === 'grid');
    }
  };

  const gridsToShow = getGridsToShow();

  // Remove normalizeGridName and use selectedRow?.gridName directly
  const templateConfig = selectedRow?.gridName
    ? getTemplateConfigByGrid(selectedRow.gridName)
    : null;

  const inputConfig = templateConfig
    ? templateConfig.fieldGroups.flatMap(group =>
        group.fields.map(field => ({
          ...field,
          group: group.title, // Add group title for collapsible sections if needed
        }))
      )
    : [];

  // Remove all debug console.log statements

  return (
    <>
      {/* Render SidePanel overlay if a row is selected */}
      <SidePanel
        isOpen={!!selectedRow}
        selectedRow={selectedRow}
        inputConfig={inputConfig}
        onClose={handleCloseSidePanel}
        user={user}
      />
      {/* Global Navigation (add ref) */}
      <div ref={globalNavRef} id="global-navigation-ref" />
      {/* All Providers Header (add ref) */}
      <div ref={headerRef} id="all-providers-header-ref">
        <AllProvidersHeader
          title={provider_id ? undefined : "All Providers"}
          provider_id={provider_id}
          providerInfo={selectedProviderInfo}
          onProviderSelect={handleProviderSelect}
          providerSearchList={providerSearchList}
          icon={faUsers}
          buttonText="Add Provider"
          buttonIcon={faUserPlus}
          onButtonClick={() => {
            // Add Provider functionality
          }}
          buttonClassName="bg-[#79AC48] hover:bg-[#6B9A3F] text-white"
          // Remove visibleSections and onSectionVisibilityChange props
          // visibleSections={npi ? visibleSections : undefined}
          // onSectionVisibilityChange={npi ? handleSectionVisibilityChange : undefined}
        />
      </div>
      {/* Main Content */}
      {navLoading || isLeftNav ? (
        <div className="flex-1 min-h-0 h-full flex flex-row">
            <aside
              className={cn(
                "relative border-r border-gray-300 bg-white transition-all duration-300 flex flex-col h-full min-h-0",
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
                className="absolute w-6 h-6 bg-[#545454] text-white rounded-full flex items-center justify-center hover:bg-[#3f3f3f] transition-colors z-20"
                style={{
                  right: sidebarCollapsed ? "-28px" : "-12px",
                  top: "-12px",
                }}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={!sidebarCollapsed}
                data-testid="sidebar-toggle"
              >
                {sidebarCollapsed ? (
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" aria-hidden="true" />
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
              // Remove visibleSections and handleSectionVisibilityChange props
              // visibleSections={visibleSections}
              // handleSectionVisibilityChange={handleSectionVisibilityChange}
            />
        </div>
      ) : (
        <div className="flex-1 min-h-0 h-full flex flex-col">
            {/* HorizontalNav (add ref) */}
            <div ref={horizontalNavRef} id="horizontal-nav-ref">
              <HorizontalNav
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
