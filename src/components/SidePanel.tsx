import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUserDoctor, faFileMedical, faFolder } from "@fortawesome/free-solid-svg-icons";
import CollapsibleSection from "./CollapsibleSection";
import { MultiSelectInput } from "./inputs/MultiSelectInput";
import { SingleSelect } from "./inputs/SingleSelect";
import TextInputField from "./inputs/TextInputField";
import { Provider } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { updateProvider, updateStateLicense, updateRecord } from '@/lib/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { getTemplateConfigByGrid, gridToTemplateMap } from '@/lib/templateConfigs';
import ProviderInfoDetails from './sidepanel-details/ProviderInfoDetails';
import StateLicenseDetails from './sidepanel-details/StateLicenseDetails';
import { getIconByName } from "@/lib/iconMapping";
import SidePanelTab from "./TabTitle";
import FileDropzone from './FileDropzone';
import { fetchDocumentsForRecord, insertDocument, updateDocument, deleteDocument } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';
import BirthInfoDetails from './sidepanel-details/BirthInfoDetails';
import { sharedTabsById } from './tabsRegistry';

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
  BirthInfoDetails,
  // Add more as needed
};

const SidePanel: React.FC<SidePanelProps> = (props) => {
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
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const resizeRef = useRef<HTMLDivElement>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any | null>(null);

  // Select template based on gridName
  const template = gridName ? getTemplateConfigByGrid(gridName) : null;

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
        const key = field.rowKey || field.label;
        const value = selectedRow[key] ?? (field.type === 'multi-select' ? [] : '');
        initialValues[key] = value;
      });
      
      setFormValues(initialValues);
      setHasUnsavedChanges(false); // Reset unsaved changes when new row is selected
      lastInitializedId.current = selectedRow.id;
    } else if (!selectedRow) {
      setFormValues({});
      lastInitializedId.current = null;
    }
  }, [selectedRow, inputConfig]);

  // Debug: log the selectedRow prop whenever it changes
  React.useEffect(() => {
    
  }, [selectedRow]);

  // Diagnostic: log when selectedRow reference changes
  React.useEffect(() => {
    
  }, [selectedRow]);

  // Diagnostic: log when inputConfig reference changes
  React.useEffect(() => {
    
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

  // Fetch documents for the selected record
  useEffect(() => {
    if (!selectedRow?.id) return;
    setDocumentsLoading(true);
    fetchDocumentsForRecord(selectedRow.id)
      .then(setDocuments)
      .finally(() => setDocumentsLoading(false));
  }, [selectedRow?.id]);

  if (!selectedRow) return null;

  // Group fields by group property
  const groupedFields = inputConfig.reduce((acc: any, field: InputField) => {
    if (!acc[field.group]) acc[field.group] = [];
    acc[field.group].push(field);
    return acc;
  }, {});

  // Handle input change (local only)
  const handleChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    
    // Check if this change is different from the original value
    if (selectedRow) {
      const originalValue = selectedRow[key] ?? (inputConfig.find(f => f.rowKey === key)?.type === 'multi-select' ? [] : '');
      const hasChanged = JSON.stringify(value) !== JSON.stringify(originalValue);
      
      if (hasChanged) {
        setHasUnsavedChanges(true);
      } else {
        // Check if any other fields have changes
        const anyChanges = Object.entries({ ...formValues, [key]: value }).some(([fieldKey, fieldValue]) => {
          const fieldOriginalValue = selectedRow[fieldKey] ?? (inputConfig.find(f => f.rowKey === fieldKey)?.type === 'multi-select' ? [] : '');
          return JSON.stringify(fieldValue) !== JSON.stringify(fieldOriginalValue);
        });
        setHasUnsavedChanges(anyChanges);
      }
    }
  };

  // Handle Discard Changes - reset form to original values
  const handleDiscardChanges = () => {
    if (!selectedRow) return;
    
    
    // Reset form values to original selectedRow values
    const originalValues: Record<string, any> = {};
    inputConfig.forEach(field => {
      const key = field.rowKey || field.label;
      const value = selectedRow[key] ?? (field.type === 'multi-select' ? [] : '');
      originalValues[key] = value;
    });
    
    setFormValues(originalValues);
    
    // Clear any success states and unsaved changes
    setSaveSuccess(false);
    setHasUnsavedChanges(false);
    
  };

  // Handle Save (update parent and backend)
  const handleSave = async () => {
    
    if (!selectedRow || !gridName) {
      console.error('Missing required data for save:', { selectedRow: !!selectedRow, gridName });
      return;
    }

    setIsSaving(true);

    // Store the previous data for rollback in case of error
    let previousData: any = null;
    let previousProviderData: any = null;

    try {
      // Only include valid DB columns in the update
      const validColumns = inputConfig.map(f => f.rowKey).filter(Boolean);
      
      // Filter and clean the updates
      const filteredUpdates = Object.fromEntries(
        Object.entries(formValues)
          .filter(([key]) => validColumns.includes(key))
          .map(([key, value]) => {
            // Handle empty date fields - convert empty strings to null for date fields
            const field = inputConfig.find(f => f.rowKey === key);
            const isDateField = field && (
              field.type === 'date' || 
              key.includes('date') || 
              key.includes('Date') ||
              key === 'last_updated' ||
              key === 'enumeration_date' ||
              key === 'issue_date' ||
              key === 'expiration_date'
            );
            
            if (isDateField) {
            }
            
            if (isDateField && (value === '' || value === null || value === undefined)) {
              return [key, null];
            }
            
            // Also handle invalid date strings
            if (isDateField && typeof value === 'string' && value.trim() === '') {
              return [key, null];
            }
            
            return [key, value];
          })
      );
      
      // Log fields that are being excluded
      const excludedFields = Object.entries(formValues).filter(([key]) => !validColumns.includes(key));
      if (excludedFields.length > 0) {
      }
      
      // Check if there are any updates to save
      if (Object.keys(filteredUpdates).length === 0) {
        return;
      }

      // Optimistic update: Update the cache immediately (optional, can be expanded for more grids)
      if (gridName === 'State_Licenses') {
        queryClient.setQueryData(['stateLicenses'], (oldData: any[]) => {
          if (!oldData) return oldData;
          previousData = oldData;
          return oldData.map(item => 
            item.id === selectedRow.id 
              ? { ...item, ...filteredUpdates }
              : item
          );
        });
        if (selectedRow.provider_id) {
          queryClient.setQueryData(['providerStateLicenses', selectedRow.provider_id], (oldData: any[]) => {
            if (!oldData) return oldData;
            return oldData.map(item => 
              item.id === selectedRow.id 
                ? { ...item, ...filteredUpdates }
                : item
            );
          });
        }
      } else if (gridName === 'Provider_Info') {
        queryClient.setQueryData(['providers'], (oldData: any[]) => {
          if (!oldData) return oldData;
          previousData = oldData;
          return oldData.map(item => 
            item.id === selectedRow.id 
              ? { ...item, ...filteredUpdates }
              : item
          );
        });
      }
      // --- DYNAMIC TABLE UPDATE LOGIC ---
      const tableName = gridToTableMap[gridName];
      if (!tableName) {
        throw new Error(`No table mapping found for gridName: ${gridName}`);
      }
      const result = await updateRecord(tableName, selectedRow.id, filteredUpdates);
      // Update parent state as well
      if (onUpdateSelectedProvider) {
        const updatedProvider = { ...selectedRow, ...filteredUpdates };
        onUpdateSelectedProvider(gridName, updatedProvider);
      }
      // Invalidate and refetch the appropriate query cache to ensure consistency
      const queryKeyMap: Record<string, string> = {
        Provider_Info: 'providers',
        State_Licenses: 'state_licenses',
        Birth_Info: 'birth_info',
        // Add more as needed
      };
      const queryKey = queryKeyMap[gridName];
      if (queryKey) {
        await queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
      
      // Show success feedback
      setSaveSuccess(true);
      setHasUnsavedChanges(false); // Clear unsaved changes state
      setTimeout(() => {
        setSaveSuccess(false);
        // Footer will be hidden by hasUnsavedChanges being false
      }, 1500); // Hide success message after 1.5 seconds
      
    } catch (err) {
      console.error('Failed to save:', err);
      
      // Rollback optimistic updates on error
      if (gridName === 'State_Licenses' && previousData) {
        queryClient.setQueryData(['stateLicenses'], previousData);
      } else if (gridName === 'Provider_Info' && previousData) {
        queryClient.setQueryData(['providers'], previousData);
      }
      
      // Show error feedback
      setSaveSuccess(false); // Hide success message on error
      console.error('Save failed:', err.message || 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFilesAccepted = async (files: File[]) => {
    if (!user || !user.id || !selectedRow?.id) {
      toast({
        title: "Upload Error",
        description: "User or record not found. Cannot upload files.",
        variant: "destructive",
      });
      return;
    }

    // Create optimistic documents immediately
    const optimisticDocuments = files.map((file, index) => ({
      id: `optimistic-${Date.now()}-${index}`,
      user_id: user.id,
      record_id: selectedRow.id,
      name: file.name,
      size: file.size,
      document_type: 'Other Misc',
      permission: 'Public',
      date: new Date().toISOString().slice(0, 10),
      exp_date: null,
      verif_date: null,
      exp_na: false,
      bucket: 'documents',
      path: `${user.id}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
      created_at: new Date().toISOString(),
      author: user?.user_metadata?.full_name || user?.email || "Unknown",
      isOptimistic: true, // Flag to identify optimistic documents
    }));

    // Add optimistic documents to the UI immediately
    setDocuments(prev => [...optimisticDocuments, ...prev]);

    // Process each file upload
    const uploadPromises = files.map(async (file, index) => {
      const optimisticDoc = optimisticDocuments[index];
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${user.id}/${safeName}`;

      try {
        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }

        // Insert metadata into documents table
        const docMeta = {
          user_id: user.id,
          record_id: selectedRow.id,
          name: file.name,
          size: file.size,
          document_type: 'Other Misc',
          permission: 'Public',
          date: new Date().toISOString().slice(0, 10),
          exp_date: null,
          verif_date: null,
          exp_na: false,
          bucket: 'documents',
          path: filePath,
        };

        const inserted = await insertDocument(docMeta);

        // Replace optimistic document with real one
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === optimisticDoc.id ? { ...inserted, isOptimistic: false } : doc
          )
        );

        return { success: true, file: file.name };
      } catch (error: any) {
        // Remove optimistic document on error
        setDocuments(prev => prev.filter(doc => doc.id !== optimisticDoc.id));
        
        // Show error toast
        toast({
          title: "Upload Failed",
          description: `Failed to upload "${file.name}": ${error.message}`,
          variant: "destructive",
        });

        return { success: false, file: file.name, error: error.message };
      }
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

          // Show summary toast if there were multiple files
      if (files.length > 1) {
        if (successCount > 0 && failureCount === 0) {
          toast({
            title: "Upload Complete",
            description: `Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''}`,
            variant: "success",
          });
        } else if (successCount > 0 && failureCount > 0) {
          toast({
            title: "Upload Partial",
            description: `Uploaded ${successCount} file${successCount > 1 ? 's' : ''}, ${failureCount} failed`,
            variant: "default",
          });
        }
      }
  };

  const handleEditDocument = (doc: any) => {
    setEditingDocument(doc);
  };

  const handleDeleteDocument = async (doc: any) => {
    try {
      await deleteDocument(doc.id, doc.bucket, doc.path);
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: `Failed to delete "${doc.name}": ${err.message}`,
        variant: "destructive",
      });
    }
  };

  // Select the DetailsComponent from the static map
let DetailsComponent;
if (template?.DetailsComponent) {
  if (typeof template.DetailsComponent === 'string') {
    DetailsComponent = detailsComponentMap[template.DetailsComponent];
  } else {
    DetailsComponent = template.DetailsComponent;
  }
}

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
  let tabIds: string[] = [];
  let tabs: any[] = [];
  // Type guard for array of tab config objects
  function isTabConfigArray(tabs: any[]): tabs is { id: string }[] {
    return Array.isArray(tabs) && typeof tabs[0] === 'object' && tabs[0] !== null && 'id' in tabs[0];
  }
  if (template && template.tabs) {
    if (isTabConfigArray(template.tabs)) {
      // Array of tab config objects
      tabs = template.tabs.map((tabObj) => {
        if (tabObj.id === 'details' || tabObj.id === 'team') {
          return {
            id: tabObj.id,
            label: tabObj.label || tabObj.id.charAt(0).toUpperCase() + tabObj.id.slice(1),
            icon: tabObj.icon || (tabObj.id === 'details' ? 'bars-staggered' : 'users'),
            enabled: tabObj.enabled !== undefined ? tabObj.enabled : true,
          };
        }
        return sharedTabsById[tabObj.id] || { id: tabObj.id, label: tabObj.label || tabObj.id, enabled: false };
      });
      tabIds = tabs.map((t: any) => String(t.id));
    } else {
      // Array of tab ids (strings)
      tabIds = template.tabs as string[];
      tabs = tabIds.map((id) => {
        if (id === 'details' || id === 'team') {
          return {
            id,
            label: id.charAt(0).toUpperCase() + id.slice(1),
            icon: id === 'details' ? 'bars-staggered' : 'users',
            enabled: true,
          };
        }
        return sharedTabsById[id] || { id, label: id, enabled: false };
      });
    }
  }

  // Mapping from gridName to table name
  const gridToTableMap: Record<string, string> = {
    Provider_Info: 'providers',
    State_Licenses: 'state_licenses',
    Birth_Info: 'birth_info',
    // Add more as needed
  };

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
                className="p-0 border-0 bg-transparent"
              >
                <SidePanelTab
                  rowKey={tabConfig.id}
                  fullLabel={tabConfig.label}
                  iconLabel={tabConfig.label}
                  icon={tabConfig.icon}
                  isActive={tab === tabConfig.id}
                />
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1 min-h-0 flex flex-col overflow-y-auto p-2" data-testid="side-panel-tabpanel-container">
            {/* Tab Title */}
            {(() => {
              const activeTab = tabs.find(t => t.id === tab);
              return activeTab ? (
                <h2 className="text-lg font-semibold text-[#545454] my-4" data-testid="side-panel-tab-title">
                  {activeTab.label}
                </h2>
              ) : null;
            })()}
            
            {tabs.some((t) => t.id === 'details') && tab === 'details' && (
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
            {tabs.some((t) => t.id === tab) && (
              <TabsContent value={tab} className="flex-1 min-h-0 flex flex-col p-0 m-0" role="tabpanel" aria-label={`${tab.charAt(0).toUpperCase() + tab.slice(1)} Tab`} data-testid={`side-panel-tabpanel-${tab}`}>
                {(() => {
                  switch (tab) {
                    case 'notes': {
                      const NotesComponent = sharedTabsById['notes']?.Component as React.FC<any>;
                      return selectedRow && NotesComponent &&
                        React.createElement(NotesComponent, {
                          className: "flex-1 min-h-0",
                          recordId: selectedRow.id,
                          recordType: gridName || 'Provider_Info',
                          user: user,
                        });
                    }
                    case 'documents': {
                      const DocumentsComponent = sharedTabsById['documents']?.Component as React.FC<any>;
                      return (
                        documents.length > 0 ? (
                          <>
                            <div className="flex-1 overflow-y-auto" role="attached-documents-grid">
                              {DocumentsComponent &&
                                React.createElement(DocumentsComponent, {
                                  documents: documents,
                                  onEdit: handleEditDocument,
                                  onDelete: handleDeleteDocument,
                                })}
                              {documentsLoading && <div className="text-gray-500 mt-2">Loading documents...</div>}
                            </div>
                            <div className="mt-4 flex-shrink-0">
                              <FileDropzone onFilesAccepted={handleFilesAccepted} />
                            </div>
                          </>
                        ) : (
                          <FileDropzone onFilesAccepted={handleFilesAccepted} />
                        )
                      );
                    }
                    default:
                      return null;
                  }
                })()}
              </TabsContent>
            )}
            {tabs.some((t) => t.id === 'team') && tab === 'team' && (
              <TabsContent value="team" role="tabpanel" aria-label="Team Tab" data-testid="side-panel-tabpanel-team">
                <div className="text-gray-500">Team tab content goes here.</div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
      {/* Footer Actions - Animated slide from bottom */}
      <div 
        className={`border-t border-gray-200 p-4 transition-all duration-300 ease-in-out transform ${
          (hasUnsavedChanges || isSaving || saveSuccess) 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-full opacity-0'
        }`}
        data-testid="side-panel-footer"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'white',
          zIndex: 10
        }}
      >
        <div className="flex gap-3">
          <button 
            className="flex-1 bg-gray-100 text-[#545454] py-2 px-4 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
            aria-label="Discard Changes"
            data-testid="side-panel-discard-changes-button"
            onClick={handleDiscardChanges}
          >
            Discard Changes
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
              isSaving 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : saveSuccess
                ? 'bg-[#79AC48] text-white cursor-default'
                : 'bg-[#008BC9] text-white hover:bg-[#007399]'
            }`}
            onClick={handleSave}
            disabled={isSaving || saveSuccess}
            aria-label={isSaving ? "Saving changes..." : saveSuccess ? "Changes saved successfully" : "Save changes"}
            aria-describedby={isSaving ? "saving-status" : undefined}
            data-testid="side-panel-save-button"
            role="button"
            type="button"
          >
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}
            {isSaving && <span id="saving-status" className="sr-only">Saving changes to database</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
