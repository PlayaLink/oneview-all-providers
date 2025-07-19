import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { FacilityInformation } from "./FacilityInformation";
import { FacilityRequirements } from "./FacilityRequirements";
import { FacilityProperties } from "./FacilityProperties";
import NavItem from "./NavItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faShieldHalved,
  faListCheck,
  faUsers,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface FacilityProperty {
  id?: string;
  key?: string;
  label?: string;
  type?: string;
  group?: string;
  value?: any;
  is_required?: boolean;
  validation_rules?: any;
}

interface FacilityRequirement {
  id?: string;
  key?: string;
  label?: string;
  group?: string;
  type?: string;
  note?: string | null;
  visible?: boolean;
  required?: boolean;
}

interface FacilityProvider {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  npi_number?: string | null;
  title?: string | null;
  primary_specialty?: string | null;
  role?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean;
}

interface FacilityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: {
    id: string;
    label: string;
    icon?: string;
    created_at: string;
    updated_at: string;
    properties?: FacilityProperty[];
    requirements?: FacilityRequirement[];
    providers?: FacilityProvider[];
  };
  requirementValues?: any[];
}

export const FacilityDetailsModal: React.FC<FacilityDetailsModalProps> = ({
  isOpen,
  onClose,
  facility,
  requirementValues = [],
}) => {
  const [activeTab, setActiveTab] = useState("information");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-6xl max-h-[90vh] overflow-hidden"
        data-testid="facility-details-modal"
      >
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle className="flex items-center gap-2 text-sm font-bold text-gray-700 tracking-wider uppercase">
            {facility.icon && (
              <span className="text-2xl" role="img" aria-label="Facility icon">
                {facility.icon}
              </span>
            )}
            {facility.label}
          </DialogTitle>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
            data-testid="close-modal-button"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </DialogHeader>

        <div
          className="flex-1 overflow-hidden border-t border-gray-200"
          data-testid="facility-details-tabs"
        >
          <div className="flex h-full">
            {/* Left sidebar navigation */}
            <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-white">
              <div className="p-6 pt-4">
                <nav
                  className="space-y-4"
                  role="navigation"
                  aria-label="Facility details sections"
                >
                  <NavItem
                    variant="sidenav"
                    active={activeTab === "information"}
                    onClick={() => setActiveTab("information")}
                    icon={
                      <FontAwesomeIcon
                        icon={faCircleInfo}
                        className="w-5 h-5"
                      />
                    }
                    className="w-full text-left font-medium"
                    data-testid="facility-information-tab"
                  >
                    Facility Information
                  </NavItem>

                  <NavItem
                    variant="sidenav"
                    active={activeTab === "credentialing"}
                    onClick={() => setActiveTab("credentialing")}
                    icon={
                      <FontAwesomeIcon
                        icon={faShieldHalved}
                        className="w-5 h-5"
                      />
                    }
                    className="w-full text-left font-medium"
                    data-testid="facility-credentialing-tab"
                  >
                    Credentialing Processes
                  </NavItem>

                  <NavItem
                    variant="sidenav"
                    active={activeTab === "requirements"}
                    onClick={() => setActiveTab("requirements")}
                    icon={
                      <FontAwesomeIcon icon={faListCheck} className="w-5 h-5" />
                    }
                    className="w-full text-left font-medium"
                    data-testid="facility-requirements-tab"
                  >
                    Eligibility Criteria
                  </NavItem>

                  <NavItem
                    variant="sidenav"
                    active={activeTab === "contacts"}
                    onClick={() => setActiveTab("contacts")}
                    icon={
                      <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
                    }
                    className="w-full text-left font-medium"
                    data-testid="facility-contacts-tab"
                  >
                    Contacts
                  </NavItem>
                </nav>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Tab header */}
              <div className="p-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-700 tracking-wide">
                  {activeTab === "information" && "Facility Information"}
                  {activeTab === "credentialing" && "Credentialing Processes"}
                  {activeTab === "requirements" && "Eligibility Criteria"}
                  {activeTab === "contacts" && "Contacts"}
                </h2>
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-auto p-6 pt-4">
                {activeTab === "information" && (
                  <div data-testid="facility-information-content">
                    <FacilityInformation
                      facility={facility}
                      requirementValues={requirementValues}
                    />
                  </div>
                )}

                {activeTab === "credentialing" && (
                  <div data-testid="facility-credentialing-content">
                    <FacilityProperties facility={facility} />
                  </div>
                )}

                {activeTab === "requirements" && (
                  <div data-testid="facility-requirements-content">
                    <FacilityRequirements
                      facility={facility}
                      requirementValues={requirementValues}
                    />
                  </div>
                )}

                {activeTab === "contacts" && (
                  <div data-testid="facility-contacts-content">
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      <div className="text-center">
                        <div
                          className="text-4xl mb-4"
                          role="img"
                          aria-label="Coming soon icon"
                        >
                          🚧
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          Contacts Tab
                        </h3>
                        <p className="text-sm">
                          This tab will show facility contacts and their
                          information.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
