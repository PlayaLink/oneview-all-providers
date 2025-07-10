import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faUsers,
  faUserPlus,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SideNav from "@/components/SideNav";
import HorizontalNav from "@/components/HorizontalNav";
import AllProvidersHeader from "@/components/AllProvidersHeader";
import MainContent from "@/components/MainContent";
import MainContentArea from "@/components/MainContentArea";

import { getGroups, getGridsByGroup } from "@/lib/gridDefinitions";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { generateSampleData } from "@/lib/dataGenerator";
import { gridDefinitions } from "@/lib/gridDefinitions";
import NavItem from "@/components/NavItem";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useFeatureSettings } from '@/hooks/useFeatureSettings';
import { useUser } from '@/contexts/UserContext';

const fetchProviders = async () => {
  const { data, error } = await supabase.from('providers').select('*');
  if (error) throw error;
  return data;
};

interface AllRecordsProps {
  // user is now provided by AppLayout, so we don't need it as a prop
}

const AllRecords: React.FC<AllRecordsProps> = () => {
  const { user } = useUser();
  const { npi } = useParams<{ npi?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  // Use feature settings for grid section mode
  const { settings, updateSetting, isLoading: settingsLoading } = useFeatureSettings();
  const gridSectionMode = settingsLoading ? 'left-nav' : settings.grid_section_navigation;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(
    null,
  );
  const [selectedSection, setSelectedSection] = useState<string | null>(
    "Provider Info",
  );

  // Initialize with no sections selected (no filtering by default)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );

  // --- Single row selection state ---
  const [selectedRow, setSelectedRow] = useState<(any & { gridName: string }) | null>(null);
  
  // --- Side panel state ---
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [activePanelGridName, setActivePanelGridName] = useState<string | null>(null);

  // Fetch provider data from Supabase
  const { data: providerInfoData, isLoading, error } = useQuery<any[], Error>({
    queryKey: ['providers'],
    queryFn: fetchProviders,
  });

  // Build the search list from live data
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

  // Find selected provider info for single-provider view
  const selectedProviderInfo = npi
    ? providerSearchList.find(p => String(p.npi) === String(npi))
    : undefined;

  // Ensure a section is always selected, defaulting to "Provider Info"
  useEffect(() => {
    if (!selectedSection && !selectedItem) {
      setSelectedSection("Provider Info");
    }
  }, [selectedSection, selectedItem]);

  // Ensure a section is selected when in horizontal mode
  useEffect(() => {
    if (gridSectionMode === "horizontal" && !selectedSection) {
      setSelectedSection("Provider Info");
    }
  }, [gridSectionMode, selectedSection]);

  // Initialize visibleSections with all grids when on single-provider route
  useEffect(() => {
    if (npi) {
      // On single-provider route, initialize with empty set to enable "no filtering when nothing checked" behavior
      // This allows the SectionsDropdown to control filtering properly
      if (visibleSections.size === 0) {
        setVisibleSections(new Set());
      }
    }
  }, [npi]); // Only depend on npi, not visibleSections.size

  // Auto-select the only visible group when filtering
  useEffect(() => {
    // Only run in horizontal mode
    if (gridSectionMode !== "horizontal") return;
    // If there are visible sections, find their groups
    if (visibleSections.size > 0) {
      const allGroups = getGroups();
      // Find groups that have at least one visible grid
      const visibleGroups = allGroups.filter(group => {
        const grids = getGridsByGroup(group);
        return grids.some(grid => visibleSections.has(grid.tableName));
      });
      if (visibleGroups.length === 1 && selectedSection !== visibleGroups[0]) {
        setSelectedSection(visibleGroups[0]);
      }
    }
  }, [visibleSections, gridSectionMode, selectedSection]);

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



  // Handler for provider search selection (to be used in PageHeader)
  const handleProviderSelect = (providerNpi: string) => {
    if (providerNpi) {
      navigate(`/${providerNpi}`);
    } else {
      navigate('/');
    }
  };

  // Handler to update selected row (table-agnostic)
  const handleRowSelect = (row: any | null, gridName?: string) => {
    if (row && gridName) {
      setSelectedRow({ ...row, gridName });
    } else {
      setSelectedRow(null);
    }
  };

  // Handler to close the side panel
  const handleCloseSidePanel = () => {
    setSelectedRow(null);
  };

  // Handler to update selected provider data when optimistic updates are made
  const handleUpdateSelectedProvider = (gridName: string, updatedProvider: any) => {
    // This handler is no longer needed as selectedRow is the single source of truth
    // setSelectedProviderByGrid(prev => ({ ...prev, [gridName]: updatedProvider }));
  };

  React.useEffect(() => {
    if (error) {
      console.error('Supabase fetch error:', error);
    }
  }, [providerInfoData, error]);









  return (
    <>
      {/* All Providers Header */}
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
      {/* Main Content */}
          {npi ? (
            // Single-provider view: no nav, all grids, filter by NPI
            <div className="flex-1 flex flex-col min-h-0 w-full px-4 pt-4 pb-8">
              <MainContent
                singleProviderNpi={npi}
                visibleSections={visibleSections}
                // ...pass other props as needed...
                selectedRow={selectedRow}
                onRowSelect={handleRowSelect}
                onCloseSidePanel={handleCloseSidePanel}
                providerInfoData={providerInfoData}
                user={user}
              />
            </div>
          ) : gridSectionMode === "left-nav" ? (
            /* Left Navigation Layout */
            <div className="flex flex-1">
              {/* Left Sidebar */}
              <aside
                className={cn(
                  "relative border-r border-gray-300 bg-white transition-all duration-300 flex flex-col",
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
                />

                {/* Collapse Toggle */}
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

              {/* Main Grid Area - Flexible */}
              <section
                className={cn(
                  "flex-1 flex flex-col min-h-0",
                  sidebarCollapsed && "ml-4 border-l border-gray-300",
                )}
                role="region"
                aria-label="Content area"
                data-testid="content-area"
              >
                <MainContent
                  selectedItem={selectedItem}
                  selectedSection={selectedSection}
                  visibleSections={visibleSections}
                  selectedRow={selectedRow}
                  onRowSelect={handleRowSelect}
                  onCloseSidePanel={handleCloseSidePanel}
                  providerInfoData={providerInfoData}
                  user={user}
                />
              </section>
            </div>
          ) : (
            /* Horizontal Navigation Layout */
            <div className="flex-1 flex flex-col min-h-0">
              <HorizontalNav
                selectedSection={selectedSection}
                onSectionSelect={handleSectionSelect}
                visibleSections={visibleSections}
                onSectionVisibilityChange={handleSectionVisibilityChange}
              />
              <section className="flex-1 min-h-0" role="region" aria-label="Content area" data-testid="content-area">
                <MainContent
                  selectedItem={selectedItem}
                  selectedSection={selectedSection}
                  visibleSections={visibleSections}
                  selectedRow={selectedRow}
                  onRowSelect={handleRowSelect}
                  onCloseSidePanel={handleCloseSidePanel}
                  providerInfoData={providerInfoData}
                  user={user}
                />
              </section>
            </div>
          )}
    </>
  );
};

export default AllRecords;
