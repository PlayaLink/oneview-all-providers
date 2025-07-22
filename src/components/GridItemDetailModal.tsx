import React, { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
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
import { detailsComponentMap } from "./SidePanel";

export interface InputField {
  label: string;
  group: string;
  placeholder?: string;
  options?: string[];
  multi?: boolean;
  key?: string;
  [key: string]: any;
}

interface GridItemDetailModalProps {
  isOpen: boolean;
  selectedRow: (any & { gridName: string }) | null;
  inputConfig: InputField[];
  onClose: () => void;
  title?: string;
  user: any;
  onUpdateSelectedProvider?: (gridName: string, updatedProvider: any) => void;
}

function getInputType(field: InputField) {
  if (Array.isArray(field.options) && field.options.length > 0) {
    return field.multi ? "multi-select" : "single-select";
  }
  return "text";
}

// Helper to format grid name for display (spaces, sentence case)
function formatGridName(name: string) {
  if (!name) return '';
  const withSpaces = name.replace(/_/g, ' ');
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase();
}

// Mapping from gridName to table name - Updated to match all database tables
const gridToTableMap: Record<string, string> = {
  Provider_Info: 'providers',
  provider_info: 'providers',
  State_Licenses: 'state_licenses',
  state_licenses: 'state_licenses',
  Birth_Info: 'birth_info',
  birth_info: 'birth_info',
  Addresses: 'addresses',
  addresses: 'addresses',
  Facility_Affiliations: 'facility_affiliations',
  facility_affiliations: 'facility_affiliations',
  Facility_Properties: 'facility_properties',
  facility_properties: 'facility_properties',
  Facility_Property_Values: 'facility_property_values',
  facility_property_values: 'facility_property_values',
  Facility_Requirements: 'facility_requirements',
  facility_requirements: 'facility_requirements',
  Facility_Requirement_Values: 'facility_requirement_values',
  facility_requirement_values: 'facility_requirement_values',
  Facilities: 'facilities',
  facilities: 'facilities',
  Requirements: 'requirements',
  requirements: 'requirements',
  Requirement_Data: 'requirement_data',
  requirement_data: 'requirement_data',
  Requirement_Data_Fields: 'requirement_data_fields',
  requirement_data_fields: 'requirement_data_fields',
  Contacts: 'contacts',
  contacts: 'contacts',
  Notes: 'notes',
  notes: 'notes',
  Documents: 'documents',
  documents: 'documents',
  Grid_Definitions: 'grid_definitions',
  grid_definitions: 'grid_definitions',
  Grid_Columns: 'grid_columns',
  grid_columns: 'grid_columns',
  Grid_Field_Groups: 'grid_field_groups',
  grid_field_groups: 'grid_field_groups',
  Grid_Sections: 'grid_sections',
  grid_sections: 'grid_sections',
  Feature_Settings: 'feature_settings',
  feature_settings: 'feature_settings',
};

const GridItemDetailModal: React.FC<GridItemDetailModalProps> = (props) => {
  const { isOpen, selectedRow, inputConfig, onClose, title, user, onUpdateSelectedProvider } = props;
  const gridName = selectedRow?.gridName;
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [tab, setTab] = useState("details");
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
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
        const key = field.key || field.label;
        let value = selectedRow[key] ?? (field.type === 'multi-select' ? [] : '');
        // Deserialize multi-select fields: convert array of strings to array of {id, label}
        if (field.type === 'multi-select' && Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
          value = value.map(v => ({ id: v, label: v }));
        }
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
      const originalValue = selectedRow[key] ?? (inputConfig.find(f => f.key === key)?.type === 'multi-select' ? [] : '');
      const hasChanged = JSON.stringify(value) !== JSON.stringify(originalValue);
      if (hasChanged) {
        setHasUnsavedChanges(true);
      } else {
        // Check if any other fields have changes
        const anyChanges = Object.entries({ ...formValues, [key]: value }).some(([fieldKey, fieldValue]) => {
          const fieldOriginalValue = selectedRow[fieldKey] ?? (inputConfig.find(f => f.key === fieldKey)?.type === 'multi-select' ? [] : '');
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
      const key = field.key || field.label;
      const value = selectedRow[key] ?? (field.type === 'multi-select' ? [] : '');
      originalValues[key] = value;
    });
    setFormValues(originalValues);
    setSaveSuccess(false);
    setHasUnsavedChanges(false);
  };

  // Handle Save (update parent and backend)
  const handleSave = async () => {
    if (!selectedRow || !gridName) {
      toast({
        title: "Save Error",
        description: "Missing required data for save operation",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    let previousData: any = null;
    try {
      const validColumns = inputConfig.map(f => f.key).filter(Boolean);
      const filteredUpdates = Object.fromEntries(
        Object.entries(formValues)
          .filter(([key]) => validColumns.includes(key))
          .map(([key, value]) => {
            const field = inputConfig.find(f => f.key === key);
            if (field && field.type === 'multi-select' && Array.isArray(value)) {
              return [key, value.map((v: any) => (typeof v === 'object' && v !== null ? v.id || v.label : v))];
            }
            const isDateField = field && (
              field.type === 'date' || 
              key.includes('date') || 
              key.includes('Date') ||
              key === 'last_updated' ||
              key === 'enumeration_date' ||
              key === 'issue_date' ||
              key === 'expiration_date'
            );
            if (isDateField && (value === '' || value === null || value === undefined)) {
              return [key, null];
            }
            if (isDateField && typeof value === 'string' && value.trim() === '') {
              return [key, null];
            }
            return [key, value];
          })
      );
      if (Object.keys(filteredUpdates).length === 0) return;
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
      const tableName = gridToTableMap[gridName];
      if (!tableName) {
        throw new Error(`No table mapping found for gridName: ${gridName}`);
      }
      let result;
      try {
        result = await updateRecord(tableName, selectedRow.id, filteredUpdates);
        await queryClient.refetchQueries({ queryKey: ["grid_data"], exact: false });
      } catch (updateError) {
        throw updateError;
      }
      if (onUpdateSelectedProvider) {
        const updatedProvider = { ...selectedRow, ...filteredUpdates };
        onUpdateSelectedProvider(gridName, updatedProvider);
      }
      const queryKeyMap: Record<string, string> = {
        Provider_Info: 'providers',
        State_Licenses: 'state_licenses',
        Birth_Info: 'birth_info',
      };
      const queryKey = queryKeyMap[gridName];
      if (queryKey) {
        await queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
      setSaveSuccess(true);
      setHasUnsavedChanges(false);
      toast({
        title: "Save Successful",
        description: "Changes have been saved successfully",
        variant: "default",
      });
      setTimeout(() => {
        setSaveSuccess(false);
      }, 1500);
    } catch (err: any) {
      if (gridName === 'State_Licenses' && previousData) {
        queryClient.setQueryData(['stateLicenses'], previousData);
      } else if (gridName === 'Provider_Info' && previousData) {
        queryClient.setQueryData(['providers'], previousData);
      }
      setSaveSuccess(false);
      const errorMessage = err?.message || err?.error_description || 'Unknown error occurred';
      toast({
        title: "Save Failed",
        description: `Failed to save changes: ${errorMessage}`,
        variant: "destructive",
      });
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
      isOptimistic: true,
    }));
    setDocuments(prev => [...optimisticDocuments, ...prev]);
    const uploadPromises = files.map(async (file, index) => {
      const optimisticDoc = optimisticDocuments[index];
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${user.id}/${safeName}`;
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, { upsert: true });
        if (uploadError) {
          throw new Error(`Storage upload failed: ${uploadError.message}`);
        }
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
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === optimisticDoc.id ? { ...inserted, isOptimistic: false } : doc
          )
        );
        return { success: true, file: file.name };
      } catch (error: any) {
        setDocuments(prev => prev.filter(doc => doc.id !== optimisticDoc.id));
        toast({
          title: "Upload Failed",
          description: `Failed to upload \"${file.name}\": ${error.message}`,
          variant: "destructive",
        });
        return { success: false, file: file.name, error: error.message };
      }
    });
    const results = await Promise.all(uploadPromises);
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
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
        description: `Failed to delete \"${doc.name}\": ${err.message}`,
        variant: "destructive",
      });
    }
  };

  let DetailsComponent;
  if (template?.DetailsComponent) {
    if (typeof template.DetailsComponent === 'string') {
      DetailsComponent = detailsComponentMap[template.DetailsComponent];
    } else {
      DetailsComponent = template.DetailsComponent;
    }
  }

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

  let tabIds: string[] = [];
  let tabs: any[] = [];
  function isTabConfigArray(tabs: any[]): tabs is { id: string }[] {
    return Array.isArray(tabs) && typeof tabs[0] === 'object' && tabs[0] !== null && 'id' in tabs[0];
  }
  if (template && template.tabs) {
    if (isTabConfigArray(template.tabs)) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[90vh] flex flex-col" data-testid="grid-item-detail-modal">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-700 tracking-wider">
            {headerText}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 flex flex-col">
          <Tabs value={tab} onValueChange={setTab} className="flex flex-1 min-h-0" data-testid="grid-item-detail-tabs">
            <TabsList className="flex flex-col w-20 pt-4 pb-2 px-2 p-2 gap-2 border-r border-gray-200 items-center justify-start" data-testid="grid-item-detail-tabs-list">
              {tabs.map((tabConfig) => (
                <TabsTrigger
                  key={tabConfig.id}
                  value={tabConfig.id}
                  className="p-0 border-0 bg-transparent w-full"
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
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto p-2" data-testid="grid-item-detail-tabpanel-container">
              {(() => {
                const activeTab = tabs.find(t => t.id === tab);
                return activeTab ? (
                  <h2 className="text-lg font-semibold text-[#545454] my-4" data-testid="grid-item-detail-tab-title">
                    {activeTab.label}
                  </h2>
                ) : null;
              })()}
              {tabs.some((t) => t.id === 'details') && tab === 'details' && (
                <TabsContent value="details" role="tabpanel" aria-label="Details Tab" data-testid="grid-item-detail-tabpanel-details">
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
                <TabsContent value={tab} className="flex-1 min-h-0 flex flex-col p-0 m-0" role="tabpanel" aria-label={`${tab.charAt(0).toUpperCase() + tab.slice(1)} Tab`} data-testid={`grid-item-detail-tabpanel-${tab}`}>
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
                <TabsContent value="team" role="tabpanel" aria-label="Team Tab" data-testid="grid-item-detail-tabpanel-team">
                  <div className="text-gray-500">Team tab content goes here.</div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
        <div 
          className={`border-t border-gray-200 p-4 transition-all duration-300 ease-in-out transform ${
            (hasUnsavedChanges || isSaving || saveSuccess) 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-full opacity-0'
          }`}
          data-testid="grid-item-detail-footer"
          style={{
            position: 'relative',
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
              data-testid="grid-item-detail-discard-changes-button"
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
              data-testid="grid-item-detail-save-button"
              role="button"
              type="button"
            >
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}
              {isSaving && <span id="saving-status" className="sr-only">Saving changes to database</span>}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper to fetch provider by ID (copied from SidePanel)
async function fetchProviderById(providerId: string) {
  const { data, error } = await supabase.from('providers').select('*').eq('id', providerId).single();
  if (error) throw error;
  return data;
}

export default GridItemDetailModal; 