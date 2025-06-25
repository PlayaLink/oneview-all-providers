import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Provider } from "@/types";
import CollapsibleSection from "./CollapsibleSection";
import { MultiSelect, MultiSelectItem } from "./MultiSelect";

// TypeSpecialtyClassificationSection component
const TypeSpecialtyClassificationSection: React.FC = () => {
  const [specialtyList, setSpecialtyList] = useState<MultiSelectItem[]>([
    { id: 1, label: "General Surgery" },
  ]);
  const [classifications, setClassifications] = useState<MultiSelectItem[]>([
    { id: 1, label: "Hospital-based" },
    { id: 2, label: "Specialist" },
    { id: 3, label: "Locum Tenens" },
  ]);
  const [taxonomyCodes, setTaxonomyCodes] = useState<MultiSelectItem[]>([
    { id: 1, label: "Plastic Surgery - Surgery of the Hand (2082S0105X" },
  ]);
  const [clinicalServices, setClinicalServices] = useState<MultiSelectItem[]>([
    { id: 1, label: "Outpatient Clinical Services" },
  ]);
  const [fluentLanguages, setFluentLanguages] = useState<MultiSelectItem[]>([
    { id: 1, label: "English" },
    { id: 2, label: "Spanish" },
    { id: 3, label: "French" },
  ]);
  const [cmsSpecialtyCodes, setCmsSpecialtyCodes] = useState<MultiSelectItem[]>(
    [],
  );

  // Sample options for each field
  const specialtyOptions: MultiSelectItem[] = [
    { id: 1, label: "General Surgery" },
    { id: 2, label: "Cardiology" },
    { id: 3, label: "Neurology" },
    { id: 4, label: "Orthopedics" },
    { id: 5, label: "Pediatrics" },
  ];

  const classificationOptions: MultiSelectItem[] = [
    { id: 1, label: "Hospital-based" },
    { id: 2, label: "Specialist" },
    { id: 3, label: "Locum Tenens" },
    { id: 4, label: "Primary Care" },
    { id: 5, label: "Emergency Medicine" },
  ];

  const taxonomyOptions: MultiSelectItem[] = [
    { id: 1, label: "Plastic Surgery - Surgery of the Hand (2082S0105X" },
    { id: 2, label: "Internal Medicine (207R00000X)" },
    { id: 3, label: "Family Medicine (207Q00000X)" },
  ];

  const clinicalOptions: MultiSelectItem[] = [
    { id: 1, label: "Outpatient Clinical Services" },
    { id: 2, label: "Inpatient Services" },
    { id: 3, label: "Emergency Services" },
    { id: 4, label: "Diagnostic Services" },
  ];

  const languageOptions: MultiSelectItem[] = [
    { id: 1, label: "English" },
    { id: 2, label: "Spanish" },
    { id: 3, label: "French" },
    { id: 4, label: "German" },
    { id: 5, label: "Mandarin" },
    { id: 6, label: "Arabic" },
  ];

  const cmsOptions: MultiSelectItem[] = [
    { id: 1, label: "01 - General Practice" },
    { id: 2, label: "02 - General Surgery" },
    { id: 3, label: "06 - Cardiology" },
    { id: 4, label: "11 - Internal Medicine" },
  ];

  return (
    <CollapsibleSection title="Type, Speciality & Classification">
      <div className="flex flex-col gap-2 w-full">
        <MultiSelect
          label="Speciality List"
          value={specialtyList}
          options={specialtyOptions}
          onChange={setSpecialtyList}
          addButtonText="Add"
        />

        <MultiSelect
          label="Classifications"
          value={classifications}
          options={classificationOptions}
          onChange={setClassifications}
          addButtonText="Add"
        />

        <MultiSelect
          label="Taxonomy Codes"
          value={taxonomyCodes}
          options={taxonomyOptions}
          onChange={setTaxonomyCodes}
          addButtonText="Add"
        />

        <MultiSelect
          label="Clinical Services"
          value={clinicalServices}
          options={clinicalOptions}
          onChange={setClinicalServices}
          addButtonText="Add"
        />

        <MultiSelect
          label="Fluent Languages"
          value={fluentLanguages}
          options={languageOptions}
          onChange={setFluentLanguages}
          addButtonText="Add"
        />

        <MultiSelect
          label="CMS Medicare Specialty Codes"
          value={cmsSpecialtyCodes}
          options={cmsOptions}
          onChange={setCmsSpecialtyCodes}
          addButtonText="Add"
        />
      </div>
    </CollapsibleSection>
  );
};

interface SidePanelProps {
  isOpen: boolean;
  provider: Provider | null;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, provider, onClose }) => {
  if (!provider) return null;

  return (
    <>
      {/* Side Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-96 bg-white transform transition-transform duration-300 ease-in-out z-50 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        style={{
          boxShadow: isOpen
            ? "-8px 0 24px -2px rgba(0, 0, 0, 0.12), -4px 0 8px -2px rgba(0, 0, 0, 0.08)"
            : "none",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#008BC9] text-white">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {provider.lastName}, {provider.firstName}
            </h2>
            <p className="text-sm opacity-90">
              {provider.title} - {provider.primarySpecialty}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <TypeSpecialtyClassificationSection />
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <button className="flex-1 bg-[#008BC9] text-white py-2 px-4 rounded text-sm font-medium hover:bg-[#007399] transition-colors">
              Edit Provider
            </button>
            <button className="flex-1 bg-gray-100 text-[#545454] py-2 px-4 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
              View Full Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidePanel;
