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
  faRoad,
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
}

const SideNav: React.FC<SideNavProps> = ({ collapsed }) => {
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

  return (
    <div className="p-2 flex flex-col gap-2">
      {!collapsed && (
        <>
          {/* All Sections Header */}
          <div className="flex items-center justify-between p-2 rounded">
            <span className="font-bold text-sm text-[#545454] tracking-wide">
              All Sections
            </span>
            <FontAwesomeIcon
              icon={faEllipsis}
              className="w-4 h-4 text-[#545454]"
            />
          </div>

          {/* Provider Info Section */}
          <div className="flex flex-col">
            <div
              className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("providerInfo")}
            >
              <span className="text-xs uppercase text-[#545454] font-medium tracking-wide">
                Provider Info
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={cn(
                  "w-4 h-4 text-[#545454] transition-transform duration-200",
                  !expandedSections.providerInfo && "rotate-180",
                )}
              />
            </div>
            {expandedSections.providerInfo && (
              <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div className="flex items-center gap-2 p-2 bg-[#008BC9] text-white rounded">
                  <FontAwesomeIcon icon={faUserDoctor} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Provider Info</span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faWeight} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Birth Info</span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faHouse} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Addresses</span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faAddressBook} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Additional Names
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faPlay} className="w-4 h-4" />
                  <span className="text-xs font-semibold">CAQH</span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faFileMedical} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Health Info</span>
                </div>
              </div>
            )}
          </div>

          {/* Licensure Section */}
          <div className="flex flex-col">
            <div
              className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => toggleSection("licensure")}
            >
              <span className="text-xs uppercase text-[#545454] font-medium tracking-wide">
                Licensure
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={cn(
                  "w-4 h-4 text-[#545454] transition-transform duration-200",
                  !expandedSections.licensure && "rotate-180",
                )}
              />
            </div>
            {expandedSections.licensure && (
              <div className="pl-3 flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faRoad} className="w-4 h-4" />
                  <span className="text-xs font-semibold">State Licenses</span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faClipboard} className="w-4 h-4" />
                  <span className="text-xs font-semibold">DEA Licenses</span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
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
              <div className="flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faClipboardList} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Event log</span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
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
              <div className="flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faCertificate} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Board Certifications
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
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
              <div className="flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faUniversity} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Education & Training
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
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
              <div className="flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faBuilding} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Practice/Employer
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faHospital} className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    Facility Affiliations
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faBriefcase} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Work History</span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faUserGroup} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Peer References</span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
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
              <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer overflow-hidden transition-all duration-200">
                <FontAwesomeIcon icon={faGavel} className="w-4 h-4" />
                <span className="text-xs font-semibold">
                  Malpractice Insurance
                </span>
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
              <div className="flex flex-col gap-0.5 overflow-hidden transition-all duration-200">
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
                  <FontAwesomeIcon icon={faFolder} className="w-4 h-4" />
                  <span className="text-xs font-semibold">Documents</span>
                </div>
                <div className="flex items-center gap-2 p-2 text-[#008BC9] hover:bg-gray-50 rounded cursor-pointer">
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
