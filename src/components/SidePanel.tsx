import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUserDoctor, faFileMedical, faFolder } from "@fortawesome/free-solid-svg-icons";
import CollapsibleSection from "./CollapsibleSection";
import { MultiSelectInput } from "./inputs/MultiSelectInput";
import { SingleSelect } from "./SingleSelect";
import TextInputField from "./inputs/TextInputField";
import { Provider } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { updateProvider, updateStateLicense } from '@/lib/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import Notes from "./Notes";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { getTemplateConfigByGrid } from '@/lib/templateConfigs';
import ProviderInfoDetails from './sidepanel-details/ProviderInfoDetails';
import StateLicenseDetails from './sidepanel-details/StateLicenseDetails';
import { getIconByName } from "@/lib/iconMapping";

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

// Add prop type for template
interface SidePanelProps {
  isOpen: boolean;
  selectedRow: any | null;
  inputConfig: InputField[];
  onClose: () => void;
  title?: string;
  user: any;
  gridName?: string | null; // NEW: grid name for template selection
  onUpdateSelectedProvider?: (gridName: string, updatedProvider: any) => void;
}

// Helper to fetch provider by ID
async function fetchProviderById(providerId: string) {
  const { data, error } = await supabase.from('providers').select('*').eq('id', providerId).single();
  if (error) throw error;
  return data;
}

// Helper to format grid name for display (spaces, sentence case)
function formatGridName(name: string) {
  if (!name) return '';
  const withSpaces = name.replace(/_/g, ' ');
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase();
}

const detailsComponentMap: Record<string, React.ComponentType<any>> = {
  ProviderInfoDetails,
  StateLicenseDetails,
  // Add more as needed
};

const SidePanel: React.FC<SidePanelProps> = (props) => {
  // Debug: log all props whenever they change
  React.useEffect(() => {
    console.log('SidePanel props:', props);
  }, [props]);

  // Destructure props as before
  const { isOpen, selectedRow, inputConfig, onClose, title, user, gridName, onUpdateSelectedProvider } = props;
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

  // Select template based on gridName
  const template = gridName ? getTemplateConfigByGrid(gridName) : null;
  console.log('SidePanel template:', template);

  // Fetch provider if selectedRow has provider_id and it's not a provider row itself
  const providerId = selectedRow && selectedRow.provider_id ? selectedRow.provider_id : (selectedRow && selectedRow.id && gridName === 'Provider_Info' ? selectedRow.id : null);
  const {
    data: provider,
    isLoading: providerLoading,
    error: providerError,
  } = useQuery({
    queryKey: ['provider', providerId],
    queryFn: () => fetchProviderById(providerId),
    enabled: !!providerId && gridName !== 'Provider_Info',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // For Provider_Info grid, the selectedRow is the provider
  const effectiveProvider = gridName === 'Provider_Info' ? selectedRow : provider;

  // Only reset form values if the selectedRow.id actually changes
  const lastInitializedId = React.useRef<any>(null);
  React.useEffect(() => {
    if (selectedRow && selectedRow.id !== lastInitializedId.current) {
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
      lastInitializedId.current = selectedRow.id;
    } else if (!selectedRow) {
      setFormValues({});
      lastInitializedId.current = null;
    }
  }, [selectedRow]);

  // Debug: log the selectedRow prop whenever it changes
  React.useEffect(() => {
    console.log('SidePanel selectedRow:', selectedRow);
  }, [selectedRow]);

  // Diagnostic: log when selectedRow reference changes
  React.useEffect(() => {
    console.log('selectedRow reference changed:', selectedRow);
  }, [selectedRow]);

  // Diagnostic: log when inputConfig reference changes
  React.useEffect(() => {
    console.log('inputConfig reference changed:', inputConfig);
  }, [inputConfig]);

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

  // Handle input change (local only)
  const handleChange = (label: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [label]: value }));
  };

  // Handle Save (update parent and backend)
  const handleSave = async () => {
    if (!selectedRow || !gridName) return;

    // Update the backend
    let updateFunction;
    if (gridName === 'State_Licenses') {
      updateFunction = updateStateLicense;
    } else {
      updateFunction = updateProvider;
    }
    try {
      await updateFunction(selectedRow.id, formValues);
      // Optionally, update parent state as well
      if (onUpdateSelectedProvider) {
        const updatedProvider = { ...selectedRow, ...formValues };
        onUpdateSelectedProvider(gridName, updatedProvider);
      }
      // Optionally, show a success message or close the panel
    } catch (err) {
      // Optionally, show an error message
      console.error('Failed to save:', err);
    }
  };

  // Select the DetailsComponent from the static map
  const DetailsComponent = template?.DetailsComponent ? detailsComponentMap[template.DetailsComponent] : undefined;

  // Header formatting
  let headerText = '';
  if (template && template.header) {
    const displayGridName = formatGridName(gridName || '');
    if (providerLoading && gridName !== 'Provider_Info') {
      headerText = 'Loading provider...';
    } else if (providerError && gridName !== 'Provider_Info') {
      headerText = 'Error loading provider';
    } else {
      headerText = template.header({ gridName: displayGridName, row: selectedRow, provider: effectiveProvider });
    }
  } else {
    headerText = title || '';
  }

  // Tabs from template
  const tabs = template && template.tabs ? template.tabs : [];

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      role="dialog"
      aria-modal="true"
      aria-label={headerText}
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
          <h2 className="text-lg font-semibold">{headerText}</h2>
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
            {tabs.map((tabConfig) => (
              <TabsTrigger
                key={tabConfig.id}
                value={tabConfig.id}
                className={`flex flex-col items-center py-6 px-0 w-full transition-colors
                data-[state=active]:bg-[#008BC9] data-[state=active]:text-white
                data-[state=active]:hover:bg-[#0077B3]
                text-[#545454] hover:bg-gray-100`}
              >
                <FontAwesomeIcon icon={getIconByName(tabConfig.icon)} className="w-6 h-6 mb-1" />
                <span className="text-xs">{tabConfig.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1 min-h-0 flex flex-col overflow-y-auto p-2" data-testid="side-panel-tabpanel-container">
            {tabs.some((t) => t.id === 'details') && (
              <TabsContent value="details" role="tabpanel" aria-label="Details Tab" data-testid="side-panel-tabpanel-details">
                {DetailsComponent && (
                  <Suspense fallback={<div>Loading details...</div>}>
                    <DetailsComponent
                      formValues={formValues}
                      handleChange={handleChange}
                    />
                  </Suspense>
                )}
              </TabsContent>
            )}
            {tabs.some((t) => t.id === 'notes') && (
              <TabsContent value="notes" className="flex-1 min-h-0 flex flex-col p-0 m-0" role="tabpanel" aria-label="Notes Tab" data-testid="side-panel-tabpanel-notes">
                {selectedRow && (
                  <Notes
                    className="flex-1 min-h-0"
                    recordId={selectedRow.id}
                    recordType={gridName || 'Provider_Info'}
                    user={user}
                  />
                )}
              </TabsContent>
            )}
            {tabs.some((t) => t.id === 'documents') && (
              <TabsContent value="documents" role="tabpanel" aria-label="Documents Tab" data-testid="side-panel-tabpanel-documents">
                <div className="text-gray-500">Documents tab content goes here.</div>
              </TabsContent>
            )}
            {tabs.some((t) => t.id === 'team') && (
              <TabsContent value="team" role="tabpanel" aria-label="Team Tab" data-testid="side-panel-tabpanel-team">
                <div className="text-gray-500">Team tab content goes here.</div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4" data-testid="side-panel-footer">
        <div className="flex gap-3">
          <button
            className="flex-1 bg-[#008BC9] text-white py-2 px-4 rounded text-sm font-medium hover:bg-[#007399] transition-colors"
            onClick={handleSave}
          >
            Save
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
