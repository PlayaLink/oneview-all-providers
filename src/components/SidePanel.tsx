import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Provider } from "@/types";
import CollapsibleSection from "./CollapsibleSection";
import MultiSelect from "./MultiSelect";

// TypeSpecialtyClassificationSection component
const TypeSpecialtyClassificationSection: React.FC = () => {
  const [specialtyList, setSpecialtyList] = useState<string[]>([
    "General Surgery",
  ]);
  const [classifications, setClassifications] = useState<string[]>([
    "Hospital-based",
    "Specialist",
    "Locum Tenens",
  ]);
  const [taxonomyCodes, setTaxonomyCodes] = useState<string[]>([
    "Plastic Surgery - Surgery of the Hand (2082S0105X",
  ]);
  const [clinicalServices, setClinicalServices] = useState<string[]>([
    "Outpatient Clinical Services",
  ]);
  const [fluentLanguages, setFluentLanguages] = useState<string[]>([
    "English",
    "Spanish",
    "French",
  ]);
  const [cmsSpecialtyCodes, setCmsSpecialtyCodes] = useState<string[]>([]);

  const handleRemoveItem =
    (setState: React.Dispatch<React.SetStateAction<string[]>>) =>
    (item: string) => {
      setState((prev) => prev.filter((i) => i !== item));
    };

  const handleAddClick = (field: string) => () => {
    console.log(`Add clicked for ${field}`);
    // Here you would typically open a modal or dropdown to add new items
  };

  return (
    <CollapsibleSection title="Type, Speciality & Classification">
      <div className="flex flex-col gap-2 w-full">
        <MultiSelect
          label="Speciality List"
          selectedItems={specialtyList}
          onRemoveItem={handleRemoveItem(setSpecialtyList)}
          onAddClick={handleAddClick("specialtyList")}
        />

        <MultiSelect
          label="Classifications"
          selectedItems={classifications}
          onRemoveItem={handleRemoveItem(setClassifications)}
          onAddClick={handleAddClick("classifications")}
        />

        <MultiSelect
          label="Taxonomy Codes"
          selectedItems={taxonomyCodes}
          onRemoveItem={handleRemoveItem(setTaxonomyCodes)}
          onAddClick={handleAddClick("taxonomyCodes")}
        />

        <MultiSelect
          label="Clinical Services"
          selectedItems={clinicalServices}
          onRemoveItem={handleRemoveItem(setClinicalServices)}
          onAddClick={handleAddClick("clinicalServices")}
        />

        <MultiSelect
          label="Fluent Languages"
          selectedItems={fluentLanguages}
          onRemoveItem={handleRemoveItem(setFluentLanguages)}
          onAddClick={handleAddClick("fluentLanguages")}
        />

        <MultiSelect
          label="CMS Medicare Specialty Codes"
          selectedItems={cmsSpecialtyCodes}
          onRemoveItem={handleRemoveItem(setCmsSpecialtyCodes)}
          onAddClick={handleAddClick("cmsSpecialtyCodes")}
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
