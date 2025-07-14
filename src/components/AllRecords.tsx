import React, { useEffect, useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserPlus,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import SideNav from "@/components/SideNav";
import HorizontalNav from "@/components/HorizontalNav";
import AllProvidersHeader from "@/components/AllProvidersHeader";
import MainContent from "@/components/MainContent";

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { supabase, fetchGridDefinitions, fetchGridSections } from '@/lib/supabaseClient';
import { useUser } from '@/contexts/UserContext';
import { useFeatureFlag } from '@/contexts/FeatureFlagContext';
import GridDataFetcher from "./GridDataFetcher";
import { getIconByName } from "@/lib/iconMapping";

const fetchProviders = async () => {
  const { data, error } = await supabase.from('providers').select('*');
  if (error) throw error;
  return data;
};

const AllRecords: React.FC = () => {
  const { user } = useUser();
  const { npi } = useParams<{ npi?: string }>();
  const navigate = useNavigate();
  const { value: isLeftNav, isLoading: navLoading } = useFeatureFlag("left_nav");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>("provider_info");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [selectedRow, setSelectedRow] = useState<(any & { gridName: string }) | null>(null);

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
    setGridHeight(Math.max(viewportHeight - totalHeaderHeight, 200)); // 200px min height
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

  // Helper to get unique groups from backend grid definitions
  const getGroups = () => Array.from(new Set(gridDefs.map((g: any) => g.group)));
  // Helper to get grids by group from backend grid definitions
  const getGridsByGroup = (group: string) => gridDefs.filter((g: any) => g.group === group);

  const providerSearchList = React.useMemo(() => (
    Array.isArray(providerInfoData)
      ? providerInfoData.map(row => ({
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

  const selectedProviderInfo = npi
    ? providerSearchList.find(p => String(p.npi) === String(npi))
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
    setVisibleSections((prev) => {
      const newSet = new Set(prev);
      if (visible) {
        newSet.add(sectionKey);
      } else {
        newSet.delete(sectionKey);
      }
      return newSet;
    });
  };

  const handleProviderSelect = (providerNpi: string) => {
    if (providerNpi) {
      navigate(`/${providerNpi}`);
    } else {
      navigate("/");
    }
  };

  const handleRowSelect = (row: any | null, gridName?: string) => {
    if (row && gridName) {
      setSelectedRow({ ...row, gridName });
    } else {
      setSelectedRow(null);
    }
  };

  const handleCloseSidePanel = () => {
    setSelectedRow(null);
  };

  // Helper to determine which grids to show in all-records view (backend-driven)
  const getGridsToShow = () => {
    let gridsToShow: any[] = [];

    if (selectedItem && selectedItem !== "all-sections") {
      gridsToShow = gridDefs.filter((g: any) => g.table_name === selectedItem || g.key === selectedItem);
    } else if (selectedSection) {
      const sectionGrids = getGridsByGroup(selectedSection);
      if (visibleSections.size === 0) {
        gridsToShow = sectionGrids;
      } else {
        gridsToShow = sectionGrids.filter((g: any) => visibleSections.has(g.table_name) || visibleSections.has(g.key));
      }
    } else {
      if (visibleSections.size === 0) {
        gridsToShow = gridDefs;
      } else {
        gridsToShow = gridDefs.filter((g: any) => visibleSections.has(g.table_name) || visibleSections.has(g.key));
      }
    }

    // Sort grids by their order property
    return gridsToShow.sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      return orderA - orderB;
    });
  };

  const gridsToShow = getGridsToShow();
  console.log("gridsToShow", gridsToShow);

  return (
    <>
      {/* Global Navigation (add ref) */}
      <div ref={globalNavRef} id="global-navigation-ref" />
      {/* All Providers Header (add ref) */}
      <div ref={headerRef} id="all-providers-header-ref">
        <AllProvidersHeader
          title={npi ? undefined : "All Providers"}
          npi={npi}
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
          visibleSections={npi ? visibleSections : undefined}
          onSectionVisibilityChange={npi ? handleSectionVisibilityChange : undefined}
        />
      </div>
      {/* Main Content */}
      {npi ? (
        <div>
          <div className="flex-1 flex flex-col min-h-0 w-full px-4 pt-4 pb-8">
            <MainContent
              singleProviderNpi={npi}
              visibleSections={visibleSections}
              selectedRow={selectedRow}
              onRowSelect={handleRowSelect}
              onCloseSidePanel={handleCloseSidePanel}
              providerInfoData={providerInfoData}
              user={user}
            />
          </div>
        </div>
      ) : navLoading || isLeftNav ? (
        <div>
          <div className="flex flex-1">
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
            <section
              className={cn(
                "flex-1 flex flex-col min-h-0",
                sidebarCollapsed && "ml-4 border-l border-gray-300",
              )}
              role="region"
              aria-label="Content area"
              data-testid="content-area"
            >
              {/* Render a GridDataFetcher for each grid */}
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
                gridsToShow.map((grid: any, idx: number) => (
                  <div
                    key={grid.key || grid.table_name}
                    style={{ height: gridHeight, marginBottom: idx !== gridsToShow.length - 1 ? 24 : 0 }}
                  >
                    <GridDataFetcher
                      gridKey={grid.key || grid.table_name}
                      titleOverride={grid.display_name}
                      iconOverride={getIconByName(grid.icon)}
                      height={gridHeight}
                    />
                  </div>
                ))
              )}
            </section>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex-1 flex flex-col min-h-0 vh-80">
            {/* HorizontalNav (add ref) */}
            <div ref={horizontalNavRef} id="horizontal-nav-ref">
              <HorizontalNav
                selectedSection={selectedSection}
                onSectionSelect={handleSectionSelect}
                visibleSections={visibleSections}
                onSectionVisibilityChange={handleSectionVisibilityChange}
                gridSections={gridSections}
              />
            </div>
            <section className="flex-1 min-h-0" role="region" aria-label="Grids list" data-testid="grids-list">
              {/* Render a GridDataFetcher for each grid */}
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
                gridsToShow.map((grid: any, idx: number) => (
                  <div
                    key={grid.key || grid.table_name}
                    style={{ height: gridHeight, marginBottom: idx !== gridsToShow.length - 1 ? 24 : 0 }}
                  >
                    <GridDataFetcher
                      gridKey={grid.key || grid.table_name}
                      titleOverride={grid.display_name}
                      iconOverride={getIconByName(grid.icon)}
                      height={gridHeight}
                    />
                  </div>
                ))
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default AllRecords;
