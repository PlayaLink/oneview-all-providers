import React, { useState } from "react";
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
import PageHeader from "@/components/PageHeader";
import MainContent from "@/components/MainContent";

const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(
    "provider-info",
  );
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const handleItemSelect = (item: string) => {
    setSelectedItem(item);
    setSelectedSection(null);
  };

  const handleSectionSelect = (section: string) => {
    setSelectedSection(section);
    setSelectedItem(null);
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

        {/* Page Header */}
        <PageHeader
          title="All Providers"
          icon={faUsers}
          buttonText="Add Provider"
          buttonIcon={faUserPlus}
          onButtonClick={() => {
            console.log("Add Provider clicked");
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 border-t border-gray-300">
        {/* Wrapper to allow arrow overflow */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <div
            className={cn(
              "relative border-r border-gray-300 bg-white transition-all duration-300",
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
              "flex-1 flex flex-col",
              sidebarCollapsed && "ml-4 border-l border-gray-300",
            )}
          >
            <MainContent
              selectedItem={selectedItem}
              selectedSection={selectedSection}
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

export default MainLayout;
