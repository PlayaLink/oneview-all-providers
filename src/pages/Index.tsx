import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import {
  ChevronDown,
  Search,
  UserPlus,
  User,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  MessageSquare,
  FileText,
  Users,
  X,
  Download,
  ExternalLink,
  Edit,
  Flag,
  MoreVertical,
  Plus,
  Filter,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

const ActionsCellRenderer = ({
  data,
  onRowClick,
}: {
  data: HealthcareProvider;
  onRowClick: (provider: HealthcareProvider) => void;
}) => {
  return (
    <div className="flex items-center justify-end gap-2 h-full">
      <button className="p-1 hover:bg-gray-100 rounded">
        <Download className="w-5 h-5 text-[#BABABA]" />
      </button>
      <button
        className="p-1 hover:bg-gray-100 rounded"
        onClick={() => onRowClick(data)}
      >
        <ExternalLink className="w-5 h-5 text-[#545454]" />
      </button>
      <button className="p-1 hover:bg-gray-100 rounded">
        <Edit className="w-5 h-5 text-[#545454]" />
      </button>
      <button className="p-1 hover:bg-gray-100 rounded">
        <Flag className="w-5 h-5 text-[#545454]" />
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
        flex: 1,
        minWidth: 180,
        cellClass: "font-medium",
      },
      {
        headerName: "Title",
        field: "title",
        flex: 1,
        minWidth: 120,
      },
      {
        headerName: "Primary Specialty",
        field: "primarySpecialty",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "NPI #",
        field: "npiNumber",
        width: 120,
      },
      {
        headerName: "Work Email",
        field: "workEmail",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "Personal Email",
        field: "personalEmail",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "Mobile Phone #",
        field: "mobilePhone",
        width: 140,
      },
      {
        headerName: "Tags",
        field: "tags",
        cellRenderer: TagsCellRenderer,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Last Updated",
        field: "lastUpdated",
        width: 120,
        valueFormatter: (params) => {
          const date = new Date(params.value);
          return date.toLocaleDateString();
        },
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
              <ChevronDown className="w-4 h-4" />
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
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="border-t border-gray-300 bg-white">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-[#545454] font-bold text-sm tracking-wide">
                  All Providers
                </h1>

                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#545454]" />
                  <Input
                    placeholder="Search a Provider Name or NPI..."
                    className="pl-8 pr-10 py-1 text-xs border-gray-300 w-96"
                  />
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#545454]" />
                </div>
              </div>

              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded border">
                <User className="w-4 h-4 text-[#545454]" />
                <span className="font-bold text-xs text-[#545454]">
                  Provider filters
                </span>
                <ChevronDown className="w-3 h-3 text-[#545454]" />
              </div>
            </div>

            <Button className="bg-[#545454] hover:bg-[#3f3f3f] text-white px-3.5 py-1.5 text-xs font-bold">
              Add Provider
              <UserPlus className="w-3 h-3 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 border-t border-gray-300">
        {/* Left Sidebar */}
        <div
          className={cn(
            "border-r border-gray-300 bg-white transition-all duration-300",
            sidebarCollapsed ? "w-12" : "w-48",
          )}
        >
          <div className="p-2">
            {!sidebarCollapsed && (
              <>
                <div className="flex items-center justify-between p-2 mb-2">
                  <span className="font-bold text-sm text-[#545454] tracking-wide">
                    All Sections
                  </span>
                  <button className="text-[#545454] hover:bg-gray-100 p-1 rounded">
                    ⋯
                  </button>
                </div>

                {/* Provider Info Section */}
                <div className="mb-1">
                  <div className="flex items-center justify-between p-2 text-xs uppercase text-[#545454] font-medium tracking-wide">
                    <span>Provider Info</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                  <div className="ml-3 space-y-0.5">
                    <div className="flex items-center gap-2 p-2 bg-[#008BC9] text-white rounded text-xs font-semibold">
                      <User className="w-4 h-4" />
                      <span>Provider Info</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 text-[#008BC9] text-xs font-semibold hover:bg-gray-50 rounded cursor-pointer">
                      <div className="w-4 h-4">⚖</div>
                      <span>Birth Info</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 text-[#008BC9] text-xs font-semibold hover:bg-gray-50 rounded cursor-pointer">
                      <div className="w-4 h-4">🏠</div>
                      <span>Addresses</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 text-[#008BC9] text-xs font-semibold hover:bg-gray-50 rounded cursor-pointer">
                      <div className="w-4 h-4">📖</div>
                      <span>Additional Names</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 text-[#008BC9] text-xs font-semibold hover:bg-gray-50 rounded cursor-pointer">
                      <div className="w-4 h-4">🔺</div>
                      <span>CAQH</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 text-[#008BC9] text-xs font-semibold hover:bg-gray-50 rounded cursor-pointer">
                      <div className="w-4 h-4">📋</div>
                      <span>Health Info</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute left-44 top-64 w-6 h-6 bg-[#545454] text-white rounded-full flex items-center justify-center hover:bg-[#3f3f3f] transition-colors"
            style={{
              transform: sidebarCollapsed
                ? "translateX(-176px)"
                : "translateX(0)",
            }}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Main Grid Area */}
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            {/* Provider Info Section Header */}
            <div className="flex items-center justify-between p-2 bg-[#CFD8DC] border-b border-gray-300">
              <div className="flex items-center gap-3">
                {/* Section Icon and Title */}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#545454]" />
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

            {/* AG Grid with Custom Styling */}
            <div className="flex-1">
              <div className="ag-theme-alpine h-full provider-grid">
                <AgGridReact
                  rowData={sampleProviders}
                  columnDefs={columnDefs}
                  rowSelection="single"
                  onSelectionChanged={handleSelectionChanged}
                  headerHeight={48}
                  rowHeight={42}
                  suppressRowClickSelection={false}
                  domLayout="normal"
                  className="text-sm"
                  floatingFilter={true}
                  animateRows={true}
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
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Side Panel Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-300">
                <div className="flex-1 px-2">
                  <h2 className="text-[#545454] font-bold text-xl">
                    Provider Info for {selectedProvider.firstName}{" "}
                    {selectedProvider.lastName}{" "}
                    {selectedProvider.title.split(" - ")[0]}
                  </h2>
                </div>
                <button className="text-[#545454] p-2">
                  <div className="w-5 h-5">⛶</div>
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
                        <BarChart3
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
                        <MessageSquare
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
                        <FileText
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
                        <Users
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
