import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faUsers,
  faUserPlus,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SideNav from "@/components/SideNav";
import HorizontalNav from "@/components/HorizontalNav";
import PageHeader from "@/components/PageHeader";
import MainContent from "@/components/MainContent";
import SettingsDropdown from "@/components/SettingsDropdown";
import { getGroups, getGridsByGroup } from "@/lib/gridDefinitions";
import { useParams, useNavigate } from "react-router-dom";
import { generateSampleData } from "@/lib/dataGenerator";
import { gridDefinitions } from "@/lib/gridDefinitions";
import NavItem from "@/components/NavItem";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

const fetchProviders = async () => {
  const { data, error } = await supabase.from('provider_info').select('*');
  if (error) throw error;
  return data;
};

const MainLayout: React.FC = () => {
  const { npi } = useParams<{ npi?: string }>();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(
    null,
  );
  const [selectedSection, setSelectedSection] = useState<string | null>(
    "Provider Info",
  );
  const [gridSectionMode, setGridSectionMode] = useState<
    "left-nav" | "horizontal"
  >("horizontal");

  // Initialize with no sections selected (no filtering by default)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );

  // --- Per-grid row selection state ---
  const [selectedRowsByGrid, setSelectedRowsByGrid] = useState<{ [gridName: string]: string | null }>({});
  const [selectedProviderByGrid, setSelectedProviderByGrid] = useState<{ [gridName: string]: any | null }>({});
  
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

  const handleGridSectionModeChange = (mode: "left-nav" | "horizontal") => {
    setGridSectionMode(mode);
    // When switching to horizontal mode, ensure we select a section instead of an item
    if (mode === "horizontal" && selectedItem && !selectedSection) {
      // Map current item to its section for better UX
      const itemToSectionMap: Record<string, string> = {
        "provider-info": "Provider Info",
        "birth-info": "Provider Info",
        addresses: "Provider Info",
        "additional-names": "Provider Info",
        caqh: "CAQH",
        "health-info": "Provider Info",
        "state-licenses": "Licensure",
        "dea-licenses": "Licensure",
        "controlled-substance-licenses": "Licensure",
        "event-log": "Actions and Exclusions",
        oig: "Actions and Exclusions",
        "board-certifications": "Certifications",
        "other-certifications": "Certifications",
        "education-training": "Education and Training",
        exams: "Education and Training",
        "practice-employer": "Work Experience",
        "facility-affiliations": "Work Experience",
        "work-history": "Work Experience",
        "peer-references": "Work Experience",
        "military-experience": "Work Experience",
        "malpractice-insurance": "Malpractice Insurance",
        documents: "Documents",
        "sent-forms": "Documents",
      };

      const section = itemToSectionMap[selectedItem] || "Provider Info";
      setSelectedSection(section);
      setSelectedItem(null);
    }
  };

  // Handler for provider search selection (to be used in PageHeader)
  const handleProviderSelect = (providerNpi: string) => {
    navigate(`/${providerNpi}`);
  };

  // Handler to update selected row for a grid
  const handleGridRowSelect = (gridName: string, rowId: string | null, provider: any | null) => {
    setSelectedRowsByGrid(prev => ({ ...prev, [gridName]: rowId }));
    setSelectedProviderByGrid(prev => ({ ...prev, [gridName]: provider }));
    
    // Set the active panel grid and open the side panel
    if (rowId && provider) {
      setActivePanelGridName(gridName);
      setSidePanelOpen(true);
    } else {
      setActivePanelGridName(null);
      setSidePanelOpen(false);
    }
  };

  // Handler to clear selected row for a grid
  const handleClearGridRowSelect = (gridName: string) => {
    setSelectedRowsByGrid(prev => ({ ...prev, [gridName]: null }));
    setSelectedProviderByGrid(prev => ({ ...prev, [gridName]: null }));
  };

  // Handler to close the side panel
  const handleCloseSidePanel = () => {
    setSidePanelOpen(false);
    setActivePanelGridName(null);
  };

  React.useEffect(() => {
    console.log('Fetched providerInfoData:', providerInfoData);
    if (error) {
      console.error('Supabase fetch error:', error);
    }
  }, [providerInfoData, error]);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Navigation - Two Row Design */}
      {/* First Row - Black Background */}
      <div className="bg-black text-white">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-9">
            {/* Modio Logo */}
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/045bcc3b8f1e2829d44e88fc2c2155dfab17ea83?width=229"
              alt="Modio"
              className="flex items-start gap-[7.436px]"
            />

            {/* CompHealth Dropdown */}
            <div className="flex items-center gap-2 px-2 rounded-lg">
              <div className="flex items-center w-7 h-7 rounded-full overflow-hidden">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58"
                  alt=""
                  className="w-7 h-7 object-cover rounded-full"
                />
              </div>
              <div
                className="text-white font-bold text-base leading-7"
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                CompHealth
              </div>
              <div
                className="text-white text-[10.5px] leading-normal tracking-[0.429px]"
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                (Salt Lake City, Utah)
              </div>
              <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Right Side Links */}
            <div className="flex items-center gap-4">
              <span
                className="text-white text-center text-xs leading-normal tracking-[0.429px]"
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                New Features
              </span>
              <span
                className="text-white text-center text-xs leading-normal tracking-[0.429px]"
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Modio U
              </span>
              <span
                className="text-white text-center text-xs leading-normal tracking-[0.429px]"
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                Support
              </span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 aspect-square">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 0C18.6166 0 24 5.38342 24 12C24 15.5127 22.4828 18.6772 20.0697 20.873L20.0815 20.8831L19.6822 21.2164C19.6603 21.235 19.6372 21.2519 19.6141 21.2689C19.5953 21.2826 19.5765 21.2964 19.5583 21.3111C19.3754 21.4599 19.1873 21.6022 18.9958 21.7401C18.9799 21.7515 18.9642 21.7629 18.9484 21.7744C18.8845 21.8206 18.8209 21.8666 18.7562 21.9107C18.5319 22.0643 18.3011 22.2087 18.0663 22.3471C18.0026 22.3846 17.9389 22.4212 17.8748 22.4575C17.6169 22.6028 17.3537 22.7393 17.0845 22.8659C17.0651 22.8751 17.0456 22.8838 17.0261 22.8925C17.0122 22.8987 16.9984 22.9049 16.9846 22.9113C16.0848 23.3241 15.1257 23.6282 14.1233 23.808C14.0998 23.8126 14.0758 23.8168 14.0522 23.821L14.0417 23.8228C13.7289 23.8765 13.4121 23.9188 13.0913 23.9481C13.071 23.9498 13.0507 23.9512 13.0304 23.9527C13.0102 23.9541 12.9899 23.9555 12.9696 23.9572C12.6493 23.983 12.3268 24 12 24C11.6701 24 11.3446 23.983 11.0225 23.9564C11.0029 23.9546 10.9834 23.9532 10.964 23.9518C10.944 23.9504 10.9242 23.949 10.9043 23.9472C10.5809 23.918 10.2615 23.8743 9.9456 23.8198L9.86531 23.8054C8.84771 23.6217 7.87462 23.3105 6.96305 22.8868C6.9528 22.882 6.94243 22.8775 6.93207 22.8729C6.92171 22.8683 6.91134 22.8637 6.90109 22.8589C6.62138 22.7271 6.34822 22.5836 6.08073 22.4313C6.02705 22.4007 5.97338 22.3702 5.92015 22.3388C5.67578 22.1943 5.43666 22.042 5.20364 21.8815C5.13164 21.8317 5.06095 21.7807 4.99025 21.7296C4.77207 21.5721 4.55782 21.4093 4.35098 21.2378C4.33885 21.2278 4.32621 21.2185 4.31355 21.2093C4.29981 21.1992 4.28605 21.1892 4.27287 21.178L3.88364 20.8499L3.89498 20.8399C1.50284 18.6449 0 15.4948 0 12C0 5.38342 5.38342 0 12 0ZM12 0.872727C5.86429 0.872727 0.872727 5.86429 0.872727 12C0.872727 15.2823 2.30225 18.2365 4.57091 20.2752C4.68 20.1971 4.78909 20.1273 4.89906 20.0675L8.34938 18.1855C8.66226 18.0144 8.85644 17.6871 8.85644 17.3311V16.0682C8.58764 15.713 7.86022 14.6649 7.50676 13.2803C7.1376 12.9779 6.92204 12.5297 6.92204 12.0493V10.5024C6.92204 10.1241 7.06124 9.75709 7.30909 9.46865V7.43215C7.2864 7.20611 7.20611 5.92756 8.13076 4.87331C8.93498 3.95564 10.2367 3.49091 12 3.49091C13.7633 3.49091 15.065 3.95564 15.8692 4.87374C16.7939 5.928 16.7136 7.20567 16.6909 7.43258V9.46909C16.9392 9.75753 17.078 10.1245 17.078 10.5028V12.0497C17.078 12.6716 16.721 13.2223 16.1681 13.4849C15.8884 14.2935 15.5049 15.0449 15.0266 15.7204C14.9332 15.8518 14.8429 15.9713 14.7574 16.0769V17.3673C14.7574 17.7377 14.9633 18.0711 15.295 18.2369L18.9897 20.0841C19.1219 20.1504 19.2511 20.2298 19.3793 20.3184C21.6764 18.2788 23.1273 15.3063 23.1273 12C23.1273 5.86429 18.1357 0.872727 12 0.872727Z"
                    fill="white"
                  />
                </svg>
              </div>
              <span
                className="text-white text-center text-xs font-bold leading-normal tracking-[0.429px]"
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                John Smith
              </span>
              <div className="flex justify-center items-center w-[10px]">
                <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Blue Background */}
      <div className="bg-[#3BA8D1] text-white">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-5 flex-1 self-stretch">
            <div className="flex items-center gap-2 self-stretch">
              {/* Team Link */}
              <NavItem variant="main">Team</NavItem>
              {/* Provider Records Link - Active */}
              <NavItem variant="main" active>OneView V2</NavItem>
              {/* Forms Link */}
              <NavItem variant="main">Forms</NavItem>
              {/* Tracking Link */}
              <NavItem variant="main">Tracking</NavItem>
              {/* Logins Link */}
              <NavItem variant="main">Logins</NavItem>
              {/* Tasks Link */}
              <NavItem variant="main">Tasks</NavItem>
            </div>
          </div>

          {/* Settings Dropdown - positioned on far right */}
          <SettingsDropdown
            gridSectionMode={gridSectionMode}
            onGridSectionModeChange={handleGridSectionModeChange}
          />
        </div>

        {/* Page Header */}
        <PageHeader
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
          visibleSections={npi ? visibleSections : undefined}
          onSectionVisibilityChange={npi ? handleSectionVisibilityChange : undefined}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 border-t border-gray-300">
        {npi ? (
          // Single-provider view: no nav, all grids, filter by NPI
          <div className="flex-1 flex flex-col min-h-0">
            <MainContent
              singleProviderNpi={npi}
              visibleSections={visibleSections}
              // ...pass other props as needed...
              selectedRowsByGrid={selectedRowsByGrid}
              selectedProviderByGrid={selectedProviderByGrid}
              onGridRowSelect={handleGridRowSelect}
              onClearGridRowSelect={handleClearGridRowSelect}
              sidePanelOpen={sidePanelOpen}
              setSidePanelOpen={setSidePanelOpen}
              activePanelGridName={activePanelGridName}
              onCloseSidePanel={handleCloseSidePanel}
              providerInfoData={providerInfoData}
            />
          </div>
        ) : gridSectionMode === "left-nav" ? (
          /* Left Navigation Layout */
          <div className="flex flex-1">
            {/* Left Sidebar */}
            <div
              className={cn(
                "relative border-r border-gray-300 bg-white transition-all duration-300 flex flex-col",
                sidebarCollapsed ? "w-0" : "w-48",
              )}
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
              >
                {sidebarCollapsed ? (
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                ) : (
                  <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Main Grid Area - Flexible */}
            <div
              className={cn(
                "flex-1 flex flex-col min-h-0",
                sidebarCollapsed && "ml-4 border-l border-gray-300",
              )}
            >
              <MainContent
                selectedItem={selectedItem}
                selectedSection={selectedSection}
                visibleSections={visibleSections}
                selectedRowsByGrid={selectedRowsByGrid}
                selectedProviderByGrid={selectedProviderByGrid}
                onGridRowSelect={handleGridRowSelect}
                onClearGridRowSelect={handleClearGridRowSelect}
                sidePanelOpen={sidePanelOpen}
                setSidePanelOpen={setSidePanelOpen}
                activePanelGridName={activePanelGridName}
                onCloseSidePanel={handleCloseSidePanel}
                providerInfoData={providerInfoData}
              />
            </div>
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
            <div className="flex-1 min-h-0">
              <MainContent
                selectedItem={selectedItem}
                selectedSection={selectedSection}
                visibleSections={visibleSections}
                selectedRowsByGrid={selectedRowsByGrid}
                selectedProviderByGrid={selectedProviderByGrid}
                onGridRowSelect={handleGridRowSelect}
                onClearGridRowSelect={handleClearGridRowSelect}
                sidePanelOpen={sidePanelOpen}
                setSidePanelOpen={setSidePanelOpen}
                activePanelGridName={activePanelGridName}
                onCloseSidePanel={handleCloseSidePanel}
                providerInfoData={providerInfoData}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-[#545454] text-white px-20 py-4 flex items-center justify-between">
        <div className="text-[#91DCFB] text-xs font-semibold">
          Privacy Policy
        </div>
        <div className="text-xs font-semibold">
          <span className="text-white">© 2023 </span>
          <span className="text-[#91DCFB]">Modio Health</span>
          <span className="text-white"> All Rights Reserved</span>
        </div>
        <div className="text-[#91DCFB] text-xs font-semibold">
          Terms and Conditions
        </div>

        {/* Chat Bubble */}
        <div className="bg-[#12ABE4] px-5 py-3 rounded-full flex items-center gap-3 relative -top-2 -right-5">
          <span className="text-white font-bold text-xs">Chat</span>
          <div className="w-4 h-4 bg-white rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
