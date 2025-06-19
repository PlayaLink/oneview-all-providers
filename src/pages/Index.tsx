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

        {/* Main Navigation */}
        <div className="border-t border-gray-300 bg-white">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-[#545454] font-bold text-sm tracking-wide">
                All Providers
              </h1>
            </div>

            <div className="flex items-center justify-center flex-1">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#545454]"
                />
                <Input
                  placeholder="Search a Provider Name or NPI..."
                  className="pl-8 pr-10 py-1 text-xs border-gray-300 w-96"
                />
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#545454]"
                />
              </div>
            </div>

            <Button className="bg-[#545454] hover:bg-[#3f3f3f] text-white px-3.5 py-1.5 text-xs font-bold">
              Add Provider
              <FontAwesomeIcon icon={faUserPlus} className="w-3 h-3 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 border-t border-gray-300">
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
              right: sidebarCollapsed ? "-28px" : "-12px", // Position on left edge of Provider Info grid when collapsed
              top: "-12px", // Vertically centered on the top border stroke (half the button height)
            }}
          >
            {sidebarCollapsed ? (
              <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
            ) : (
              <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Main Grid Area */}
        <div className="flex-1 flex">
          <div
            className={cn(
              "flex-1",
              sidebarCollapsed && "ml-4 border-l border-gray-300",
            )}
          >
            {/* Provider Info Section Header */}
            <div className="flex items-center justify-between px-2 py-[9px] bg-[#CFD8DC] border-b border-gray-300">
              <div className="flex items-center gap-3">
                {/* Section Icon and Title */}
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faUserDoctor}
                    className="w-4 h-4 text-[#545454]"
                  />
                  <span className="text-[#545454] font-bold text-xs tracking-wider uppercase">
                    Provider Info
                  </span>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#F48100] rounded-full">
                    <span className="text-white font-bold text-xs">1</span>
                    <span className="text-white font-bold text-xs">
                      Expiring
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#DB0D00] rounded-full">
                    <span className="text-white font-bold text-xs">1</span>
                    <span className="text-white font-bold text-xs">
                      Expired
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#545454] rounded-full">
                    <span className="text-white font-bold text-xs">900+</span>
                    <span className="text-white font-bold text-xs">Total</span>
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center">
                <div className="w-9 h-5 bg-[#79AC48] rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
            </div>

            {/* Custom Provider Grid */}
            <div className="bg-white">
              {/* Grid Header with Filters */}
              <div className="grid grid-cols-12 bg-white border-b border-[#E2E2E2]">
                {/* Checkbox Column */}
                <div className="col-span-1 h-12 bg-[#E6E7EB] border border-[#E6E6E6] flex items-center justify-center">
                  <div className="flex items-center gap-2 p-1 bg-[#E6E7EB] border border-[#E6E6E6] rounded">
                    <FontAwesomeIcon
                      icon={faFilter}
                      className="w-4 h-4 text-[#4E5872]"
                    />
                  </div>
                </div>

                {/* Provider Name */}
                <div className="col-span-2 border-b border-[#E2E2E2]">
                  <div className="h-12 flex items-center px-4 bg-white">
                    <span className="text-[#545454] font-bold text-xs tracking-wide">
                      Provider Name
                    </span>
                  </div>
                  <div className="px-4 pb-4 bg-white">
                    <input
                      type="text"
                      className="w-full h-8 px-4 border border-[#E2E2E2] rounded text-xs"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="col-span-1 border-b border-[#E2E2E2]">
                  <div className="h-12 flex items-center px-4 bg-white">
                    <span className="text-[#545454] font-bold text-xs tracking-wide">
                      Title
                    </span>
                  </div>
                  <div className="px-4 pb-4 bg-white">
                    <input
                      type="text"
                      className="w-full h-8 px-4 border border-[#E2E2E2] rounded text-xs"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Specialty */}
                <div className="col-span-2 border-b border-[#E2E2E2]">
                  <div className="h-12 flex items-center px-4 bg-white">
                    <span className="text-[#545454] font-bold text-xs tracking-wide">
                      Specialty
                    </span>
                  </div>
                  <div className="px-4 pb-4 bg-white">
                    <input
                      type="text"
                      className="w-full h-8 px-4 border border-[#E2E2E2] rounded text-xs"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* NPI # */}
                <div className="col-span-1 border-b border-[#E2E2E2]">
                  <div className="h-12 flex items-center px-4 bg-white">
                    <span className="text-[#545454] font-bold text-xs tracking-wide">
                      NPI #
                    </span>
                  </div>
                  <div className="px-4 pb-4 bg-white">
                    <input
                      type="text"
                      className="w-full h-8 px-4 border border-[#E2E2E2] rounded text-xs"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Work Email */}
                <div className="col-span-2 border-b border-[#E2E2E2]">
                  <div className="h-12 flex items-center px-4 bg-white">
                    <span className="text-[#545454] font-bold text-xs tracking-wide">
                      Work Email
                    </span>
                  </div>
                  <div className="px-4 pb-4 bg-white">
                    <input
                      type="text"
                      className="w-full h-8 px-4 border border-[#E2E2E2] rounded text-xs"
                      placeholder=""
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-3 border-b border-[#E2E2E2] bg-white shadow-[-4px_0px_30px_0px_rgba(0,0,0,0.3)] w-[190px] ml-[52px]">
                  <div className="h-12 flex items-center justify-between px-4">
                    <div className="flex items-center gap-1">
                      <span className="text-[#545454] font-semibold text-xs tracking-wide">
                        Actions
                      </span>
                      <FontAwesomeIcon
                        icon={faCircleQuestion}
                        className="w-3 h-3 text-[#BABABA]"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="w-6 h-6 bg-[#79AC48] rounded flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="w-2.5 h-2.5 text-white"
                        />
                      </button>
                      <FontAwesomeIcon
                        icon={faEllipsisVertical}
                        className="w-5 h-5 text-[#545454]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Data Row */}
              <div
                className="grid grid-cols-12 h-[42px] border-b border-[#D2D5DC] bg-white hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedProvider(sampleProviders[0])}
              >
                {/* Checkbox */}
                <div className="col-span-1 flex items-center justify-center">
                  <div className="w-4 h-4 border border-[#BABABA] rounded-sm bg-white"></div>
                </div>

                {/* Provider Name */}
                <div className="col-span-2 flex items-center px-4">
                  <span className="text-[#545454] text-xs font-medium">
                    García, Sofia
                  </span>
                </div>

                {/* Title */}
                <div className="col-span-1 flex items-center px-4">
                  <span className="text-[#545454] text-xs">MD</span>
                </div>

                {/* Specialty */}
                <div className="col-span-2 flex items-center px-4">
                  <span className="text-[#545454] text-xs">Acupuncture</span>
                </div>

                {/* NPI # */}
                <div className="col-span-1 flex items-center px-4">
                  <span className="text-[#545454] text-xs">1477552867</span>
                </div>

                {/* Work Email */}
                <div className="col-span-2 flex items-center px-4">
                  <span className="text-[#545454] text-xs">
                    michelle.rivera@example.com
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-3 flex items-center justify-start gap-2 px-4 bg-white shadow-[-4px_0px_30px_0px_rgba(0,0,0,0.3)] w-[190px] ml-[52px]">
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
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="w-4 h-4 text-[#545454]"
                    />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <FontAwesomeIcon
                      icon={faFlag}
                      className="w-4 h-4 text-[#545454]"
                    />
                  </button>
                  <div className="w-6 h-3 bg-[#79AC48] rounded-full relative">
                    <div className="w-2.5 h-2.5 bg-white rounded-full absolute right-0.5 top-0.25"></div>
                  </div>
                </div>
              </div>

              {/* Additional sample rows */}
              {sampleProviders.slice(1, 4).map((provider, index) => (
                <div
                  key={provider.id}
                  className="grid grid-cols-12 h-[42px] border-b border-[#D2D5DC] bg-white hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedProvider(provider)}
                >
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-4 h-4 border border-[#BABABA] rounded-sm bg-white"></div>
                  </div>
                  <div className="col-span-2 flex items-center px-4">
                    <span className="text-[#545454] text-xs font-medium">
                      {provider.lastName}, {provider.firstName}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center px-4">
                    <span className="text-[#545454] text-xs">
                      {provider.title}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center px-4">
                    <span className="text-[#545454] text-xs">
                      {provider.primarySpecialty}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center px-4">
                    <span className="text-[#545454] text-xs">
                      {provider.npiNumber}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center px-4">
                    <span className="text-[#545454] text-xs">
                      {provider.workEmail}
                    </span>
                  </div>
                  <div className="col-span-3 flex items-center justify-start gap-2 px-4 bg-white shadow-[-4px_0px_30px_0px_rgba(0,0,0,0.3)] w-[190px] ml-[52px]">
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
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="w-4 h-4 text-[#545454]"
                      />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <FontAwesomeIcon
                        icon={faFlag}
                        className="w-4 h-4 text-[#545454]"
                      />
                    </button>
                    <div className="w-6 h-3 bg-[#79AC48] rounded-full relative">
                      <div className="w-2.5 h-2.5 bg-white rounded-full absolute right-0.5 top-0.25"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AG Grid Section */}
            <div className="bg-white mt-8">
              {/* AG Grid Header */}
              <div className="flex items-center justify-between px-2 py-[9px] bg-[#CFD8DC] border-b border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="w-4 h-4 text-[#545454]"
                    />
                    <span className="text-[#545454] font-bold text-xs tracking-wider uppercase">
                      Provider Data (AG Grid)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#F48100] rounded-full">
                      <span className="text-white font-bold text-xs">1</span>
                      <span className="text-white font-bold text-xs">
                        Expiring
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#DB0D00] rounded-full">
                      <span className="text-white font-bold text-xs">1</span>
                      <span className="text-white font-bold text-xs">
                        Expired
                      </span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-0.5 bg-[#545454] rounded-full">
                      <span className="text-white font-bold text-xs">900+</span>
                      <span className="text-white font-bold text-xs">
                        Total
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-9 h-5 bg-[#79AC48] rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </div>
                </div>
              </div>

              {/* AG Grid Container */}
              <div
                className="ag-theme-alpine ag-grid-custom"
                style={{
                  height: "400px",
                  width: "100%",
                  border: "none",
                  borderWidth: "0px",
                }}
              >
                <AgGridReact
                  rowData={sampleProviders}
                  columnDefs={[
                    {
                      headerName: "",
                      headerCheckboxSelection: true,
                      checkboxSelection: true,
                      width: 50,
                      pinned: "left",
                      lockPosition: true,
                      suppressMenu: true,
                      sortable: false,
                      filter: false,
                      resizable: false,
                      cellClass: "ag-cell-no-border",
                      headerClass: "ag-header-no-border",
                    },
                    {
                      headerName: "Provider Name",
                      valueGetter: (params) =>
                        `${params.data.lastName}, ${params.data.firstName}`,
                      width: 200,
                      cellStyle: {
                        color: "#545454",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "16px",
                      },
                    },
                    {
                      headerName: "Title",
                      field: "title",
                      width: 120,
                      cellStyle: {
                        color: "#545454",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "16px",
                      },
                    },
                    {
                      headerName: "Specialty",
                      field: "primarySpecialty",
                      width: 200,
                      cellStyle: {
                        color: "#545454",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "16px",
                      },
                    },
                    {
                      headerName: "NPI #",
                      field: "npiNumber",
                      width: 140,
                      cellStyle: {
                        color: "#545454",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "16px",
                      },
                    },
                    {
                      headerName: "Work Email",
                      field: "workEmail",
                      width: 250,
                      cellStyle: {
                        color: "#545454",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "16px",
                      },
                    },
                    {
                      headerName: "Personal Email",
                      field: "personalEmail",
                      width: 250,
                      cellStyle: {
                        color: "#545454",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "16px",
                      },
                    },
                    {
                      headerName: "Mobile Phone",
                      field: "mobilePhone",
                      width: 145,
                      cellStyle: {
                        color: "#545454",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "16px",
                      },
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
                      cellStyle: {
                        color: "#545454",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "16px",
                      },
                    },
                    {
                      headerName: "Last Updated",
                      field: "lastUpdated",
                      width: 120,
                      cellStyle: {
                        color: "#545454",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "16px",
                      },
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
                  onSelectionChanged={handleSelectionChanged}
                  rowSelection="multiple"
                  headerHeight={40}
                  rowHeight={42}
                  suppressRowClickSelection={true}
                  getRowStyle={(params) => ({
                    borderBottom: "0.5px solid #D2D5DC",
                    backgroundColor: "white",
                  })}
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    filter: true,
                    cellStyle: {
                      borderRight: "1px solid #E2E2E2",
                    },
                  }}
                  icons={{
                    filter: () => (
                      <FontAwesomeIcon
                        icon={faBarsStaggered}
                        className="w-3 h-3 text-[#545454]"
                        style={{ fontSize: "12px" }}
                      />
                    ),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Side Panel */}
          {selectedProvider && (
            <div className="w-[575px] border-l border-gray-300 bg-white flex flex-col">
              {/* Expand/Collapse Button */}
              <button
                onClick={closeSidePanel}
                className="absolute right-0 top-64 w-6 h-6 bg-[#545454] text-white rounded-full flex items-center justify-center hover:bg-[#3f3f3f] transition-colors z-10"
                style={{ transform: "translateX(12px)" }}
              >
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
              </button>

              {/* Side Panel Header */}
              <div className="flex items-center justify-between px-4 pt-[5px] pb-4 border-b border-gray-300">
                <div className="flex-1 px-2">
                  <h2 className="text-[#545454] font-bold text-xl">
                    Provider Info for {selectedProvider.firstName}{" "}
                    {selectedProvider.lastName}{" "}
                    {selectedProvider.title.split(" - ")[0]}
                  </h2>
                </div>
                <button className="text-[#545454] p-2">
                  <div className="w-5 h-5">���</div>
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex">
                <div className="w-12 border-r border-gray-300">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    orientation="vertical"
                  >
                    <TabsList className="flex-col h-auto bg-transparent p-0 space-y-0">
                      <TabsTrigger
                        value="details"
                        className={cn(
                          "w-full h-16 px-1 flex-col gap-2 border-b border-r border-gray-200 data-[state=active]:bg-gray-100 data-[state=active]:border-l-4 data-[state=active]:border-l-blue-500",
                          activeTab === "details" ? "bg-gray-100" : "bg-white",
                        )}
                      >
                        <FontAwesomeIcon
                          icon={faChartBar}
                          className={cn(
                            "w-5 h-5",
                            activeTab === "details"
                              ? "text-[#008BC9]"
                              : "text-[#545454]",
                          )}
                        />
                      </TabsTrigger>
                      <TabsTrigger
                        value="notes"
                        className={cn(
                          "w-full h-20 px-1 flex-col gap-2 border-b border-r border-gray-200 data-[state=active]:bg-gray-100 relative",
                          activeTab === "notes" ? "bg-gray-100" : "bg-white",
                        )}
                      >
                        <FontAwesomeIcon
                          icon={faMessage}
                          className={cn(
                            "w-5 h-5",
                            activeTab === "notes"
                              ? "text-[#008BC9]"
                              : "text-[#545454]",
                          )}
                        />
                        <div className="absolute bottom-1 right-1 w-5 h-4 bg-[#545454] text-white text-xs rounded-full flex items-center justify-center font-bold">
                          0
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="documents"
                        className={cn(
                          "w-full h-20 px-1 flex-col gap-2 border-b border-r border-gray-200 data-[state=active]:bg-gray-100 relative",
                          activeTab === "documents"
                            ? "bg-gray-100"
                            : "bg-white",
                        )}
                      >
                        <FontAwesomeIcon
                          icon={faFileText}
                          className={cn(
                            "w-5 h-5",
                            activeTab === "documents"
                              ? "text-[#008BC9]"
                              : "text-[#545454]",
                          )}
                        />
                        <div className="absolute bottom-1 right-1 w-5 h-4 bg-[#545454] text-white text-xs rounded-full flex items-center justify-center font-bold">
                          0
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="teams"
                        className={cn(
                          "w-full h-20 px-1 flex-col gap-2 border-b border-r border-gray-200 data-[state=active]:bg-gray-100 relative",
                          activeTab === "teams" ? "bg-gray-100" : "bg-white",
                        )}
                      >
                        <FontAwesomeIcon
                          icon={faUsers}
                          className={cn(
                            "w-5 h-5",
                            activeTab === "teams"
                              ? "text-[#008BC9]"
                              : "text-[#545454]",
                          )}
                        />
                        <div className="absolute bottom-1 right-1 w-5 h-4 bg-[#545454] text-white text-xs rounded-full flex items-center justify-center font-bold">
                          0
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Tab Content */}
                <div className="flex-1 p-4">
                  <Tabs value={activeTab} className="w-full">
                    <div className="border-b border-gray-200 mb-4">
                      <h3 className="text-[#545454] font-bold text-base py-3 tracking-wide">
                        {activeTab === "details" && "Details"}
                        {activeTab === "notes" && "Notes"}
                        {activeTab === "documents" && "Documents"}
                        {activeTab === "teams" && "Teams"}
                      </h3>
                    </div>

                    <TabsContent value="details" className="text-[#545454]">
                      <p className="text-sm">
                        Provider details will be implemented here.
                      </p>
                    </TabsContent>

                    <TabsContent value="notes" className="text-[#545454]">
                      <p className="text-sm">
                        Provider notes will be implemented here.
                      </p>
                    </TabsContent>

                    <TabsContent value="documents" className="text-[#545454]">
                      <p className="text-sm">
                        Provider documents will be implemented here.
                      </p>
                    </TabsContent>

                    <TabsContent value="teams" className="text-[#545454]">
                      <p className="text-sm">
                        Provider teams will be implemented here.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          )}
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
