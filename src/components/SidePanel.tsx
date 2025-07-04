import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faUserDoctor,
  faFileMedical,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import CollapsibleSection from "./CollapsibleSection";
import { MultiSelectInput } from "./inputs/MultiSelectInput";
import SingleSelectInput from "./inputs/SingleSelectInput";
import TextInputField from "./inputs/TextInputField";
import Notes from "./Notes";
import { Provider } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Types for input fields
export interface InputField {
  label: string;
  group: string;
  placeholder?: string;
  options?: string[];
  multi?: boolean;
  rowKey?: string;
  [key: string]: any;
}

function getInputType(field: InputField) {
  if (Array.isArray(field.options) && field.options.length > 0) {
    return field.multi ? "multi-select" : "single-select";
  }
  return "text";
}

interface SidePanelProps {
  isOpen: boolean;
  selectedRow: any | null;
  inputConfig: InputField[];
  onClose: () => void;
  title?: string;
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  selectedRow,
  inputConfig,
  onClose,
  title,
}) => {
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [tab, setTab] = useState("details");

  // Initialize form values from selectedRow when it changes
  React.useEffect(() => {
    if (selectedRow) {
      const initialValues: Record<string, any> = {};
      inputConfig.forEach((field) => {
        if (field.rowKey) {
          initialValues[field.label] =
            selectedRow[field.rowKey] ??
            (field.type === "multi-select" ? [] : "");
        } else {
          // fallback: try to match by label as before, or use default
          const labelKey = field.label.replace(/\s|_/g, "").toLowerCase();
          const foundKey = Object.keys(selectedRow).find(
            (k) => k.replace(/\s|_/g, "").toLowerCase() === labelKey,
          );
          initialValues[field.label] = foundKey
            ? selectedRow[foundKey]
            : field.type === "multi-select"
              ? []
              : "";
        }
      });
      setFormValues(initialValues);
    } else {
      setFormValues({});
    }
  }, [selectedRow, inputConfig]);

  if (!selectedRow) return null;

  // Group fields by group property
  const groupedFields = inputConfig.reduce((acc: any, field: InputField) => {
    if (!acc[field.group]) acc[field.group] = [];
    acc[field.group].push(field);
    return acc;
  }, {});

  // Handle input change
  const handleChange = (label: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [label]: value }));
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[484px] bg-white transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
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
            {title
              ? title
              : selectedRow.provider_name ||
                (selectedRow.first_name || "") +
                  (selectedRow.last_name ? " " + selectedRow.last_name : "") ||
                selectedRow.first_name ||
                selectedRow.last_name ||
                ""}
            {selectedRow.title ? `, ${selectedRow.title}` : ""}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="ml-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        >
          <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
        </button>
      </div>
      {/* Tabs */}
      <Tabs
        value={tab}
        onValueChange={setTab}
        orientation="vertical"
        className="flex h-full"
      >
        <TabsList className="flex flex-col w-16 bg-gray-50 rounded-l-lg pt-4 pb-2 px-2 p-1 gap-1 border-r border-gray-200 items-center justify-start">
          <TabsTrigger
            value="details"
            className={`flex flex-col items-center py-6 px-0 w-full transition-colors
              data-[state=active]:bg-[#008BC9] data-[state=active]:text-white
              data-[state=active]:hover:bg-[#0077B3]
              text-[#545454] hover:bg-gray-100`}
          >
            <FontAwesomeIcon icon={faUserDoctor} className="w-6 h-6 mb-1" />
            <span className="text-xs">Details</span>
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className={`flex flex-col items-center py-6 px-0 w-full transition-colors
              data-[state=active]:bg-[#008BC9] data-[state=active]:text-white
              data-[state=active]:hover:bg-[#0077B3]
              text-[#545454] hover:bg-gray-100`}
          >
            <FontAwesomeIcon icon={faFileMedical} className="w-6 h-6 mb-1" />
            <span className="text-xs">Notes</span>
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className={`flex flex-col items-center py-6 px-0 w-full transition-colors
              data-[state=active]:bg-[#008BC9] data-[state=active]:text-white
              data-[state=active]:hover:bg-[#0077B3]
              text-[#545454] hover:bg-gray-100`}
          >
            <FontAwesomeIcon icon={faFolder} className="w-6 h-6 mb-1" />
            <span className="text-xs">Docs</span>
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 p-4 overflow-y-auto">
          <TabsContent value="details">
            {/* Render grouped fields as CollapsibleSections */}
            {Object.entries(groupedFields).map(
              ([group, fields]: [string, any[]]) => (
                <CollapsibleSection key={group} title={group}>
                  <div className="flex flex-col gap-4 self-stretch">
                    {fields.map((field: InputField) => {
                      const inputType = getInputType(field);
                      if (inputType === "multi-select") {
                        return (
                          <MultiSelectInput
                            key={field.label}
                            label={field.label}
                            labelPosition="left"
                            value={formValues[field.label] || []}
                            options={
                              field.options?.map((opt: string) => ({
                                id: opt,
                                label: opt,
                              })) || []
                            }
                            onChange={(val) => handleChange(field.label, val)}
                            placeholder={field.placeholder}
                            className="flex-1 min-w-0"
                          />
                        );
                      } else if (inputType === "single-select") {
                        return (
                          <SingleSelectInput
                            key={field.label}
                            label={field.label}
                            labelPosition="left"
                            value={formValues[field.label] || null}
                            options={
                              field.options?.map((opt: string) => ({
                                id: opt,
                                label: opt,
                              })) || []
                            }
                            onChange={(val) => handleChange(field.label, val)}
                            placeholder={field.placeholder}
                            className="flex-1 min-w-0"
                          />
                        );
                      } else {
                        return (
                          <TextInputField
                            key={field.label}
                            label={field.label}
                            labelPosition="left"
                            value={formValues[field.label] || ""}
                            onChange={(val) => handleChange(field.label, val)}
                            placeholder={field.placeholder}
                            className="flex-1 min-w-0"
                          />
                        );
                      }
                    })}
                  </div>
                </CollapsibleSection>
              ),
            )}
          </TabsContent>
          <TabsContent value="notes">
            <div className="text-gray-500">Notes tab content goes here.</div>
          </TabsContent>
          <TabsContent value="documents">
            <div className="text-gray-500">
              Documents tab content goes here.
            </div>
          </TabsContent>
        </div>
      </Tabs>
      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <button className="flex-1 bg-[#008BC9] text-white py-2 px-4 rounded text-sm font-medium hover:bg-[#007399] transition-colors">
            Edit
          </button>
          <button className="flex-1 bg-gray-100 text-[#545454] py-2 px-4 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
