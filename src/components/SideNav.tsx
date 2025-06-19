import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faUserDoctor,
  faWeight,
  faHouse,
  faAddressBook,
  faPlay,
  faFileMedical,
  faShieldAlt,
  faClipboard,
  faPills,
  faClipboardList,
  faCheckCircle,
  faCertificate,
  faHeartbeat,
  faUniversity,
  faBook,
  faBuilding,
  faHospital,
  faBriefcase,
  faUserGroup,
  faMedal,
  faGavel,
  faFolder,
  faFileArrowUp,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface SideNavProps {
  collapsed: boolean;
  selectedItem: string | null;
  selectedSection: string | null;
  onItemSelect: (item: string) => void;
  onSectionSelect: (section: string) => void;
}

const SideNav: React.FC<SideNavProps> = ({
  collapsed,
  selectedItem,
  selectedSection,
  onItemSelect,
  onSectionSelect,
}) => {
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    providerInfo: true,
    licensure: true,
    actionsExclusions: true,
    certifications: true,
    educationTraining: true,
    workExperience: true,
    malpracticeInsurance: true,
    documents: true,
  });

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleItemClick = (item: string) => {
    onItemSelect(item);
  };

  const handleSectionClick = (section: string) => {
    onSectionSelect(section);
  };

  const isItemActive = (item: string) => selectedItem === item;
  const isSectionActive = (section: string) => selectedSection === section;

  return (
    <div className="p-2 flex flex-col gap-2">
      {!collapsed && (
        <>
          {/* All Sections Header */}
          <div
            className={cn(
              "flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-50",
              isItemActive("all-sections") && "bg-[#008BC9] text-white",
            )}
            onClick={() => handleItemClick("all-sections")}
          >
            <span
              className={cn(
                "font-bold text-sm tracking-wide",
                isItemActive("all-sections") ? "text-white" : "text-[#545454]",
              )}
            >
              All Sections
            </span>
            <FontAwesomeIcon
              icon={faEllipsis}
              className={cn(
                "w-4 h-4",
                isItemActive("all-sections") ? "text-white" : "text-[#545454]",
              )}
            />
          </div>

          {/* Provider Info Section */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <div
                className={cn(
                  "flex-1 flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer",
                  isSectionActive("providerInfo") && "bg-[#008BC9] text-white",
                )}
                onClick={() => handleSectionClick("providerInfo")}
              >
                <span
                  className={cn(
                    "text-xs uppercase font-medium tracking-wide",
                    isSectionActive("providerInfo")
                      ? "text-white"
                      : "text-[#545454]",
                  )}
                >
                  Provider Info
                </span>
              </div>
              <button
                className="p-2 hover:bg-gray-50 rounded cursor-pointer ml-1"
                onClick={() => toggleSection("providerInfo")}
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={cn(
                    "w-4 h-4 text-[#545454] transition-transform duration-200",
                    !expandedSections.providerInfo && "rotate-180",
                  )}
                />
              </button>
            </div>
            {expandedSections.providerInfo && (
              <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isItemActive("provider-info")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleItemClick("provider-info")}
                >
                  <FontAwesomeIcon icon={faUserDoctor} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Provider Info</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isItemActive("birth-info")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleItemClick("birth-info")}
                >
                  <FontAwesomeIcon icon={faWeight} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Birth Info</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isItemActive("addresses")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleItemClick("addresses")}
                >
                  <FontAwesomeIcon icon={faHouse} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Addresses</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isItemActive("additional-names")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleItemClick("additional-names")}
                >
                  <FontAwesomeIcon icon={faAddressBook} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Additional Names
                  </span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isItemActive("caqh")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleItemClick("caqh")}
                >
                  <FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
                  <span className="text-xs font-semibold">CAQH</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isItemActive("health-info")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleItemClick("health-info")}
                >
                  <FontAwesomeIcon icon={faFileMedical} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Health Info</span>
                </div>
              </div>
            )}
          </div>

          {/* Licensure Section */}
          <div className="flex flex-col">
            <div className="flex items-center">
              <div
                className={cn(
                  "flex-1 flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer",
                  isSectionActive("licensure") && "bg-[#008BC9] text-white",
                )}
                onClick={() => handleSectionClick("licensure")}
              >
                <span
                  className={cn(
                    "text-xs uppercase font-medium tracking-wide",
                    isSectionActive("licensure")
                      ? "text-white"
                      : "text-[#545454]",
                  )}
                >
                  Licensure
                </span>
              </div>
              <button
                className="p-2 hover:bg-gray-50 rounded cursor-pointer ml-1"
                onClick={() => toggleSection("licensure")}
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={cn(
                    "w-4 h-4 text-[#545454] transition-transform duration-200",
                    !expandedSections.licensure && "rotate-180",
                  )}
                />
              </button>
            </div>
            {expandedSections.licensure && (
              <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isItemActive("state-licenses")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleItemClick("state-licenses")}
                >
                  <FontAwesomeIcon icon={faShieldAlt} className="w-4 h-4" />
                  <span className="text-xs font-semibold">State Licenses</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isItemActive("dea-licenses")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleItemClick("dea-licenses")}
                >
                  <FontAwesomeIcon icon={faClipboard} className="w-4 h-4" />
                  <span className="text-xs font-semibold">DEA Licenses</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isItemActive("controlled-substance-licenses")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() =>
                    handleItemClick("controlled-substance-licenses")
                  }
                >
                  <FontAwesomeIcon icon={faPills} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    State Controlled Substance Licenses
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions & Exclusions Section */}
          <div className="flex flex-col">
            <div
              className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("actionsExclusions")}
            >
              <span className="text-xs uppercase text-[#545454] font-medium tracking-wide">
                Actions & Exclusions
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={cn(
                  "w-4 h-4 text-[#545454] transition-transform duration-200",
                  !expandedSections.actionsExclusions && "rotate-180",
                )}
              />
            </div>
            {expandedSections.actionsExclusions && (
              <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/event-log")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/event-log")}
                >
                  <FontAwesomeIcon icon={faClipboardList} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Event log</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/oig")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/oig")}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                  <span className="text-xs font-semibold">OIG</span>
                </div>
              </div>
            )}
          </div>

          {/* Certifications Section */}
          <div className="flex flex-col">
            <div
              className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("certifications")}
            >
              <span className="text-xs uppercase text-[#545454] font-medium tracking-wide">
                Certifications
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={cn(
                  "w-4 h-4 text-[#545454] transition-transform duration-200",
                  !expandedSections.certifications && "rotate-180",
                )}
              />
            </div>
            {expandedSections.certifications && (
              <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/board-certifications")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/board-certifications")}
                >
                  <FontAwesomeIcon icon={faCertificate} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Board Certifications
                  </span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/other-certifications")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/other-certifications")}
                >
                  <FontAwesomeIcon icon={faHeartbeat} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Other Certifications
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Education & Training Section */}
          <div className="flex flex-col">
            <div
              className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("educationTraining")}
            >
              <span className="text-xs uppercase text-[#545454] font-medium tracking-wide">
                Education & Training
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={cn(
                  "w-4 h-4 text-[#545454] transition-transform duration-200",
                  !expandedSections.educationTraining && "rotate-180",
                )}
              />
            </div>
            {expandedSections.educationTraining && (
              <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/education-training")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/education-training")}
                >
                  <FontAwesomeIcon icon={faUniversity} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Education & Training
                  </span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/exams")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/exams")}
                >
                  <FontAwesomeIcon icon={faBook} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Exams</span>
                </div>
              </div>
            )}
          </div>

          {/* Work Experience Section */}
          <div className="flex flex-col">
            <div
              className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("workExperience")}
            >
              <span className="text-xs uppercase text-[#545454] font-medium tracking-wide">
                Work Experience
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={cn(
                  "w-4 h-4 text-[#545454] transition-transform duration-200",
                  !expandedSections.workExperience && "rotate-180",
                )}
              />
            </div>
            {expandedSections.workExperience && (
              <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/practice-employer")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/practice-employer")}
                >
                  <FontAwesomeIcon icon={faBuilding} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Practice/Employer
                  </span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/facility-affiliations")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/facility-affiliations")}
                >
                  <FontAwesomeIcon icon={faHospital} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Facility Affiliations
                  </span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/work-history")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/work-history")}
                >
                  <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Work History</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/peer-references")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/peer-references")}
                >
                  <FontAwesomeIcon icon={faUserGroup} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Peer References</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/military-experience")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/military-experience")}
                >
                  <FontAwesomeIcon icon={faMedal} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Military Experience
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Malpractice Insurance Section */}
          <div className="flex flex-col">
            <div
              className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("malpracticeInsurance")}
            >
              <span className="text-xs uppercase text-[#545454] font-medium tracking-wide">
                Malpractice Insurance
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={cn(
                  "w-4 h-4 text-[#545454] transition-transform duration-200",
                  !expandedSections.malpracticeInsurance && "rotate-180",
                )}
              />
            </div>
            {expandedSections.malpracticeInsurance && (
              <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/malpractice-insurance")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/malpractice-insurance")}
                >
                  <FontAwesomeIcon icon={faGavel} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Malpractice Insurance
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="flex flex-col">
            <div
              className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("documents")}
            >
              <span className="text-xs uppercase text-[#545454] font-medium tracking-wide">
                Documents
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={cn(
                  "w-4 h-4 text-[#545454] transition-transform duration-200",
                  !expandedSections.documents && "rotate-180",
                )}
              />
            </div>
            {expandedSections.documents && (
              <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/documents")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/documents")}
                >
                  <FontAwesomeIcon icon={faFolder} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Documents</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded cursor-pointer",
                    isActive("/sent-forms")
                      ? "bg-[#008BC9] text-white"
                      : "text-[#008BC9] hover:bg-gray-50",
                  )}
                  onClick={() => handleNavClick("/sent-forms")}
                >
                  <FontAwesomeIcon icon={faFileArrowUp} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Sent Forms</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SideNav;
