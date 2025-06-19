import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faSearch,
  faUserPlus,
  faUserDoctor,
  faChevronLeft,
  faChevronRight,
  faChartBar,
  faMessage,
  faFileText,
  faUsers,
  faXmark,
  faCircleDown,
  faUpRightFromSquare,
  faFlag,
  faEllipsisVertical,
  faPlus,
  faFilter,
  faCircleQuestion,
  faBarsStaggered,
} from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SideNav from "@/components/SideNav";
import DataGrid from "@/components/DataGrid";

// Import AG Grid styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface HealthcareProvider {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  primarySpecialty: string;
  npiNumber: string;
  workEmail: string;
  personalEmail: string;
  mobilePhone: string;
  tags: string[];
  lastUpdated: string;
}

const sampleProviders: HealthcareProvider[] = [
  {
    id: "1",
    firstName: "Sofia",
    lastName: "García",
    title: "MD",
    primarySpecialty: "Acupuncture",
    npiNumber: "1477552867",
    workEmail: "michelle.rivera@example.com",
    personalEmail: "alma.lawson@example.com",
    mobilePhone: "(225) 555-0118",
    tags: ["Team A", "1099", "Green", "Expired"],
    lastUpdated: "2017-12-04",
  },
  {
    id: "2",
    firstName: "Tom",
    lastName: "Petty",
    title: "MD",
    primarySpecialty: "General Surgery",
    npiNumber: "1841384468",
    workEmail: "tom.petty@healthspace.com",
    personalEmail: "tom.petty@gmail.com",
    mobilePhone: "(555) 123-4567",
    tags: ["Team A", "Team C", "Texas"],
    lastUpdated: "2024-01-15",
  },
  {
    id: "3",
    firstName: "Sarah",
    lastName: "Johnson",
    title: "MD",
    primarySpecialty: "Cardiology",
    npiNumber: "1234567890",
    workEmail: "sarah.johnson@healthspace.com",
    personalEmail: "sarah.j@gmail.com",
    mobilePhone: "(555) 234-5678",
    tags: ["Team B", "California"],
    lastUpdated: "2024-01-14",
  },
  {
    id: "4",
    firstName: "Michael",
    lastName: "Rodriguez",
    title: "NP",
    primarySpecialty: "Family Medicine",
    npiNumber: "0987654321",
    workEmail: "michael.rodriguez@healthspace.com",
    personalEmail: "mike.r@gmail.com",
    mobilePhone: "(555) 345-6789",
    tags: ["Team A", "Florida"],
    lastUpdated: "2024-01-13",
  },
  {
    id: "5",
    firstName: "Emily",
    lastName: "Chen",
    title: "MD",
    primarySpecialty: "Pediatrics",
    npiNumber: "1122334455",
    workEmail: "emily.chen@healthspace.com",
    personalEmail: "emily.chen@gmail.com",
    mobilePhone: "(555) 456-7890",
    tags: ["Team C", "New York"],
    lastUpdated: "2024-01-12",
  },
  {
    id: "6",
    firstName: "David",
    lastName: "Williams",
    title: "PA",
    primarySpecialty: "Emergency Medicine",
    npiNumber: "2233445566",
    workEmail: "david.williams@healthspace.com",
    personalEmail: "david.w@gmail.com",
    mobilePhone: "(555) 567-8901",
    tags: ["Team B", "Illinois"],
    lastUpdated: "2024-01-11",
  },
];

const TagsCellRenderer = ({ value }: { value: string[] }) => {
  if (!value || value.length === 0) return null;

  return (
    <div className="flex gap-1 flex-wrap">
      {value.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="text-xs bg-blue-50 text-blue-800 border-blue-200"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};

const ActionsCellRenderer = () => {
  return (
    <div className="flex items-center justify-end gap-2 h-full">
      <button className="p-1 hover:bg-gray-100 rounded">
        <FontAwesomeIcon
          icon={faCircleDown}
          className="w-4 h-4 text-[#BABABA]"
        />
      </button>
      <button className="p-1 hover:bg-gray-100 rounded">
        <FontAwesomeIcon
          icon={faUpRightFromSquare}
          className="w-4 h-4 text-[#545454]"
        />
      </button>
      <button className="p-1 hover:bg-gray-100 rounded">
        <FontAwesomeIcon icon={faEdit} className="w-4 h-4 text-[#545454]" />
      </button>
      <button className="p-1 hover:bg-gray-100 rounded">
        <FontAwesomeIcon icon={faFlag} className="w-4 h-4 text-[#545454]" />
      </button>
      <div className="flex items-center">
        <div className="w-6 h-3 bg-[#79AC48] rounded-full relative">
          <div className="w-2.5 h-2.5 bg-white rounded-full absolute right-0.5 top-0.25"></div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [selectedProvider, setSelectedProvider] =
    useState<HealthcareProvider | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "Provider Name",
        field: "providerName",
        valueGetter: (params) =>
          `${params.data.lastName}, ${params.data.firstName}`,
        width: 200,
      },
      {
        headerName: "Title",
        field: "title",
        width: 120,
      },
      {
        headerName: "Specialty",
        field: "primarySpecialty",
        width: 200,
      },
      {
        headerName: "NPI #",
        field: "npiNumber",
        width: 140,
      },
      {
        headerName: "Work Email",
        field: "workEmail",
        width: 250,
      },
      {
        headerName: "Mobile Phone",
        field: "mobilePhone",
        width: 145,
      },
    ],
    [],
  );

  const handleSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length > 0) {
      setSelectedProvider(selectedRows[0]);
    }
  };

  const closeSidePanel = () => {
    setSelectedProvider(null);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <div className="bg-[#008BC9] text-white">
        {/* Condensed Navigation */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-5">
            {/* Logo and Company */}
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-white rounded"></div>
              <span className="text-white font-bold text-sm tracking-wide">
                Modio
              </span>
            </div>

            {/* Company Info */}
            <div className="flex items-center gap-2 px-2 py-1 rounded">
              <div className="text-white">
                <div className="font-bold text-xs tracking-wide">
                  CompHealth
                </div>
                <div className="text-xs opacity-90">(Salt Lake City, Utah)</div>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-6">
              <span className="font-bold text-xs tracking-wide">Team</span>
              <span className="font-bold text-xs tracking-wide">Forms</span>
              <span className="font-bold text-xs tracking-wide">Tracking</span>
              <span className="font-bold text-xs tracking-wide">Logins</span>
              <span className="font-bold text-xs tracking-wide">Tasks</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <span className="text-xs">New Features</span>
            <span className="text-xs">Modio U</span>
            <span className="text-xs">Support</span>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white rounded-full"></div>
              <span className="font-bold text-xs">John Smith</span>
              <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* All Providers Section */}
        <div className="bg-white text-[#545454] px-4 py-3 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faUsers}
                className="w-4 h-4 text-[#545454]"
              />
              <span className="font-bold text-xs tracking-wider uppercase">
                All Providers
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                className="bg-[#79AC48] hover:bg-[#6B9A3F] text-white"
              >
                <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4 mr-2" />
                Add Provider
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 border-t border-gray-300 overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={cn(
            "relative border-r border-gray-300 bg-white transition-all duration-300",
            sidebarCollapsed ? "w-0" : "w-48",
          )}
        >
          <SideNav collapsed={sidebarCollapsed} />

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
            "flex-1 flex flex-col",
            sidebarCollapsed && "ml-4 border-l border-gray-300",
          )}
        >
          {/* Provider Info Grid - Fills Available Space */}
          <div className="flex-1 min-h-0">
            <DataGrid
              title="Provider Info"
              icon={faUserDoctor}
              data={sampleProviders}
              columns={[
                {
                  headerName: "Provider Name",
                  valueGetter: (params) =>
                    `${params.data.lastName}, ${params.data.firstName}`,
                  width: 200,
                },
                {
                  headerName: "Title",
                  field: "title",
                  width: 120,
                },
                {
                  headerName: "Specialty",
                  field: "primarySpecialty",
                  width: 200,
                },
                {
                  headerName: "NPI #",
                  field: "npiNumber",
                  width: 140,
                },
                {
                  headerName: "Work Email",
                  field: "workEmail",
                  width: 250,
                },
                {
                  headerName: "Personal Email",
                  field: "personalEmail",
                  width: 250,
                },
                {
                  headerName: "Mobile Phone",
                  field: "mobilePhone",
                  width: 145,
                },
                {
                  headerName: "Tags",
                  field: "tags",
                  width: 200,
                  valueFormatter: (params) => {
                    return params.value && Array.isArray(params.value)
                      ? params.value.join(", ")
                      : "";
                  },
                },
                {
                  headerName: "Last Updated",
                  field: "lastUpdated",
                  width: 120,
                },
                {
                  headerName: "Actions",
                  cellRenderer: ActionsCellRenderer,
                  width: 190,
                  sortable: false,
                  filter: false,
                  pinned: "right",
                  cellStyle: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    paddingLeft: "16px",
                  },
                },
              ]}
              onRowClicked={setSelectedProvider}
              height="100%"
            />
          </div>
        </div>
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

export default Index;
