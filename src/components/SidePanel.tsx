import React, { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUserDoctor, faFileMedical, faFolder } from "@fortawesome/free-solid-svg-icons";
import CollapsibleSection from "./CollapsibleSection";
import { MultiSelectInput } from "./inputs/MultiSelectInput";
import SingleSelectInput from "./inputs/SingleSelectInput";
import TextInputField from "./inputs/TextInputField";
import { Provider } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { updateProvider } from '@/lib/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import Notes from "./Notes";

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
  user: any;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, selectedRow, inputConfig, onClose, title, user }) => {
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [tab, setTab] = useState("details");
  const [panelWidth, setPanelWidth] = useState(() => {
    // Load saved width from localStorage, fallback to default
    const savedWidth = localStorage.getItem('sidePanelWidth');
    return savedWidth ? parseInt(savedWidth, 10) : 484;
  });
  const [isResizing, setIsResizing] = useState(false);
  const [isHoveringResizeHandle, setIsHoveringResizeHandle] = useState(false);
  const queryClient = useQueryClient();
  const resizeRef = useRef<HTMLDivElement>(null);

  // Initialize form values from selectedRow when it changes
  React.useEffect(() => {
    if (selectedRow) {
      const initialValues: Record<string, any> = {};
      inputConfig.forEach(field => {
        if (field.rowKey) {
          initialValues[field.label] = selectedRow[field.rowKey] ?? (field.type === 'multi-select' ? [] : '');
        } else {
          // fallback: try to match by label as before, or use default
          const labelKey = field.label.replace(/\s|_/g, '').toLowerCase();
          const foundKey = Object.keys(selectedRow).find(
            k => k.replace(/\s|_/g, '').toLowerCase() === labelKey
          );
          initialValues[field.label] = foundKey ? selectedRow[foundKey] : (field.type === 'multi-select' ? [] : '');
        }
      });
      setFormValues(initialValues);
    } else {
      setFormValues({});
    }
  }, [selectedRow, inputConfig]);

  // Handle mouse down on resize handle
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  // Handle mouse move for resizing
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const viewportWidth = window.innerWidth;
    const newWidth = viewportWidth - e.clientX;
    const minWidth = 484; // Current minimum width
    const maxWidth = viewportWidth * 0.5; // 50% of viewport

    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setPanelWidth(constrainedWidth);
  }, [isResizing]);

  // Save width to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidePanelWidth', panelWidth.toString());
  }, [panelWidth]);

  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (!selectedRow) return null;

  // Group fields by group property
  const groupedFields = inputConfig.reduce((acc: any, field: InputField) => {
    if (!acc[field.group]) acc[field.group] = [];
    acc[field.group].push(field);
    return acc;
  }, {});

  // Handle input change
  const handleChange = async (label: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [label]: value }));

    // Find the rowKey for this label
    const field = inputConfig.find(f => f.label === label);
    if (field && field.rowKey && selectedRow && selectedRow.id) {
      try {
        await updateProvider(selectedRow.id, { [field.rowKey]: value });
        // Refetch providers from Supabase
        queryClient.invalidateQueries({ queryKey: ['providers'] });
      } catch (err) {
        console.error('Failed to update provider:', err);
      }
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Side Panel'}
      data-testid="side-panel"
      style={{
        width: `${panelWidth}px`,
        boxShadow: isOpen
          ? "-8px 0 24px -2px rgba(0, 0, 0, 0.12), -4px 0 8px -2px rgba(0, 0, 0, 0.08)"
          : "none",
      }}
    >
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className={`absolute left-0 top-0 w-1 h-full cursor-col-resize z-10 transition-colors duration-200 ${
          isHoveringResizeHandle || isResizing 
            ? 'bg-[#008BC9]' 
            : 'bg-transparent hover:bg-[#E3F2FD]'
        }`}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHoveringResizeHandle(true)}
        onMouseLeave={() => setIsHoveringResizeHandle(false)}
        role="separator"
        aria-label="Resize side panel"
        aria-orientation="vertical"
        data-testid="side-panel-resize-handle"
      />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#008BC9] text-white" data-testid="side-panel-header">
        <div className="flex-1">
          <h2 className="text-lg font-semibold">
            {title ? title : (
              selectedRow.provider_name ||
              ((selectedRow.first_name || '') + (selectedRow.last_name ? ' ' + selectedRow.last_name : '')) ||
              selectedRow.first_name ||
              selectedRow.last_name ||
              ''
            )}
            {selectedRow.title ? `, ${typeof selectedRow.title === 'object' ? (selectedRow.title.label || selectedRow.title.id || '') : selectedRow.title}` : ''}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="ml-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          aria-label="Close side panel"
        >
          <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
        </button>
      </div>
      {/* Tabs and Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        <Tabs value={tab} onValueChange={setTab} className="flex flex-1 min-h-0" data-testid="side-panel-tabs">
          <TabsList className="flex flex-col w-16 pt-4 pb-2 px-2 p-2 gap-1 border-r border-gray-200 items-center justify-start" data-testid="side-panel-tabs-list">
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
          <div className="flex-1 min-h-0 flex flex-col overflow-y-auto p-2" data-testid="side-panel-tabpanel-container">
            <TabsContent value="details" role="tabpanel" aria-label="Details Tab" data-testid="side-panel-tabpanel-details">
              {/* Render grouped fields as CollapsibleSections */}
              {Object.entries(groupedFields).map(([group, fields]: [string, any[]]) => (
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
                            options={field.options?.map((opt: string) => ({ id: opt, label: opt })) || []}
                            onChange={(val) => handleChange(field.label, Array.isArray(val) ? val.map(v => v.id) : [])}
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
                            options={field.options?.map((opt: string) => ({ id: opt, label: opt })) || []}
                            onChange={(val) => handleChange(field.label, val?.id ?? val)}
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
              ))}
            </TabsContent>
            <TabsContent value="notes" className="flex-1 min-h-0 flex flex-col p-0 m-0" role="tabpanel" aria-label="Notes Tab" data-testid="side-panel-tabpanel-notes">
              <Notes className="flex-1 min-h-0" />
            </TabsContent>
            <TabsContent value="documents" role="tabpanel" aria-label="Documents Tab" data-testid="side-panel-tabpanel-documents">
              <div className="text-gray-500">Documents tab content goes here.</div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4" data-testid="side-panel-footer">
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
