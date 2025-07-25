import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faUpRightAndDownLeftFromCenter,
  faBarsStaggered,
  faNoteSticky,
  faFolder,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import CollapsibleSection from "./CollapsibleSection";
import { MultiSelectInput } from "./inputs/MultiSelectInput";
import { SingleSelect } from "./inputs/SingleSelect";
import TextInputField from "./inputs/TextInputField";
import { Provider } from "@/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  updateProvider,
  updateStateLicense,
  updateRecord,
} from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  getTemplateConfigByGrid,
  gridToTemplateMap,
} from "@/lib/templateConfigs";
import ProviderInfoDetails from "./sidepanel-details/ProviderInfoDetails";
import ProviderInfoDetailsWide from "./sidepanel-details/ProviderInfoDetailsWide";
import StateLicenseDetails from "./sidepanel-details/StateLicenseDetails";
import { getIconByName } from "@/lib/iconMapping";
import SidePanelTab from "./SidePanelTab";
import FileDropzone from "./FileDropzone";
import {
  fetchDocumentsForRecord,
  insertDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";
import BirthInfoDetails from "./sidepanel-details/BirthInfoDetails";
import { sharedTabsById } from "./tabsRegistry";
import NavItem from "./NavItem";
import SidePanelTabLegacy from "./SidePanelTabLegacy";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";

// Types for input fields
export interface InputField {
  label: string;
  group: string;
  placeholder?: string;
  options?: string[];
  multi?: boolean;
  key?: string;
  [key: string]: any;
}

type ContextType = "sidepanel" | "modal";

interface GridItemDetailsProps {
  selectedRow: (any & { gridName: string }) | null;
  inputConfig: InputField[];
  onClose: () => void;
  title?: string;
  user: any;
  onUpdateSelectedProvider?: (gridName: string, updatedProvider: any) => void;
  /** Called when the expand icon is clicked in the header (only for sidepanel context) */
  onExpandDetailModal?: () => void;
  /** The context in which this component is being used */
  context: ContextType;
  /** Panel width for sidepanel context */
  panelWidth?: number;
  /** Whether the panel is open (for sidepanel context) */
  isOpen?: boolean;
  /** Whether the modal is open (for modal context) */
  isModalOpen?: boolean;
}

function getInputType(field: InputField) {
  if (Array.isArray(field.options) && field.options.length > 0) {
    return field.multi ? "multi-select" : "single-select";
  }
  return "text";
}

// Helper to fetch provider by ID
async function fetchProviderById(providerId: string) {
  const { data, error } = await supabase
    .from("providers")
    .select("*")
    .eq("id", providerId)
    .single();
  if (error) throw error;
  return data;
}

// Helper to format grid name for display (spaces, sentence case)
function formatGridName(name: string) {
  if (!name) return "";
  const withSpaces = name.replace(/_/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase();
}

export const detailsComponentMap: Record<string, React.ComponentType<any>> = {
  ProviderInfoDetails,
  ProviderInfoDetailsWide,
  StateLicenseDetails,
  BirthInfoDetails,
  // Add more as needed
};

// Mapping from gridName to table name - Updated to match all database tables
const gridToTableMap: Record<string, string> = {
  // Core provider tables
  Provider_Info: "providers",
  provider_info: "providers", // Handle lowercase version
  State_Licenses: "state_licenses",
  state_licenses: "state_licenses", // Handle lowercase version
  Birth_Info: "birth_info",
  birth_info: "birth_info", // Handle lowercase version
  Addresses: "addresses",
  addresses: "addresses", // Handle lowercase version

  // Facility system tables
  Facility_Affiliations: "facility_affiliations",
  facility_affiliations: "facility_affiliations", // Handle lowercase version
  Facility_Properties: "facility_properties",
  facility_properties: "facility_properties", // Handle lowercase version
  Facility_Property_Values: "facility_property_values",
  facility_property_values: "facility_property_values", // Handle lowercase version
  Facility_Requirements: "facility_requirements",
  facility_requirements: "facility_requirements", // Handle lowercase version
  Facility_Requirement_Values: "facility_requirement_values",
  facility_requirement_values: "facility_requirement_values", // Handle lowercase version
  Facilities: "facilities",
  facilities: "facilities", // Handle lowercase version

  // Requirements system tables
  Requirements: "requirements",
  requirements: "requirements", // Handle lowercase version
  Requirement_Data: "requirement_data",
  requirement_data: "requirement_data", // Handle lowercase version
  Requirement_Data_Fields: "requirement_data_fields",
  requirement_data_fields: "requirement_data_fields", // Handle lowercase version

  // Contact system tables
  Contacts: "contacts",
  contacts: "contacts", // Handle lowercase version

  // Document and notes tables
  Notes: "notes",
  notes: "notes", // Handle lowercase version
  Documents: "documents",
  documents: "documents", // Handle lowercase version

  // Grid system tables
  Grid_Definitions: "grid_definitions",
  grid_definitions: "grid_definitions", // Handle lowercase version
  Grid_Columns: "grid_columns",
  grid_columns: "grid_columns", // Handle lowercase version
  Grid_Field_Groups: "grid_field_groups",
  grid_field_groups: "grid_field_groups", // Handle lowercase version
  Grid_Sections: "grid_sections",
  grid_sections: "grid_sections", // Handle lowercase version

  // Feature settings
  Feature_Settings: "feature_settings",
  feature_settings: "feature_settings", // Handle lowercase version

  // Add more as needed
};

const GridItemDetails: React.FC<GridItemDetailsProps> = (props) => {
  const {
    selectedRow,
    inputConfig,
    onClose,
    title,
    user,
    onUpdateSelectedProvider,
    onExpandDetailModal,
    context,
    panelWidth = 484,
    isOpen = true,
    isModalOpen = true,
  } = props;

  // Use gridName from selectedRow
  const gridName = selectedRow?.gridName;
  const [formValues, setFormValues] = React.useState<Record<string, any>>({});
  const [tab, setTab] = useState("details");
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

  // Select template based on gridName and context
  const template = gridName ? getTemplateConfigByGrid(gridName, context) : null;

  // Fetch provider if selectedRow has provider_id and it's not a provider row itself
  const providerId =
    selectedRow && selectedRow.provider_id
      ? selectedRow.provider_id
      : selectedRow && selectedRow.id && gridName === "Provider_Info"
        ? selectedRow.id
        : null;
  const {
    data: provider,
    isLoading: providerLoading,
    error: providerError,
  } = useQuery({
    queryKey: ["provider", providerId],
    queryFn: () => fetchProviderById(providerId),
    enabled: !!providerId && gridName !== "Provider_Info",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // For Provider_Info grid, the selectedRow is the provider
  const effectiveProvider =
    gridName === "Provider_Info" ? selectedRow : provider;

  // Only reset form values if the selectedRow.id actually changes
  const lastInitializedId = React.useRef<any>(null);
  React.useEffect(() => {
    console.log("GridItemDetails useEffect - form initialization:", {
      selectedRowId: selectedRow?.id,
      lastInitializedId: lastInitializedId.current,
      context,
      inputConfigLength: inputConfig?.length,
      selectedRowKeys: selectedRow ? Object.keys(selectedRow) : [],
    });

    if (selectedRow && selectedRow.id !== lastInitializedId.current) {
      const initialValues: Record<string, any> = {};
      inputConfig.forEach((field) => {
        const key = field.key || field.label;
        let value =
          selectedRow[key] ?? (field.type === "multi-select" ? [] : "");

        // Deserialize multi-select fields: convert array of strings to array of {id, label}
        if (
          field.type === "multi-select" &&
          Array.isArray(value) &&
          value.length > 0 &&
          typeof value[0] === "string"
        ) {
          value = value.map((v) => ({ id: v, label: v }));
        }

        // For single-select fields, ensure we have the raw value (string)
        if (
          field.type === "single-select" &&
          value &&
          typeof value === "object" &&
          value.id
        ) {
          value = value.id;
        }

        initialValues[key] = value;
        console.log("Field initialization:", {
          key,
          fieldType: field.type,
          value,
          originalValue: selectedRow[key],
        });
      });

      console.log("Setting initial form values:", initialValues);
      setFormValues(initialValues);
      setHasUnsavedChanges(false); // Reset unsaved changes when new row is selected
      lastInitializedId.current = selectedRow.id;
    } else if (!selectedRow) {
      setFormValues({});
      lastInitializedId.current = null;
    }
  }, [selectedRow, inputConfig, context]);

  // Handle mouse down on resize handle (only for sidepanel context)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (context !== "sidepanel") return;
      e.preventDefault();
      setIsResizing(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [context],
  );

  // Handle mouse move for resizing (only for sidepanel context)
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || context !== "sidepanel") return;

      const viewportWidth = window.innerWidth;
      const newWidth = viewportWidth - e.clientX;
      const minWidth = 484; // Current minimum width
      const maxWidth = viewportWidth * 0.5; // 50% of viewport

      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      // Note: In the refactored version, panel width is managed by the parent component
    },
    [isResizing, context],
  );

  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  // Add/remove event listeners (only for sidepanel context)
  useEffect(() => {
    if (isResizing && context === "sidepanel") {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp, context]);

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
    console.log("handleChange called:", {
      key,
      value,
      context,
      selectedRowId: selectedRow?.id,
    });

    setFormValues((prev) => {
      const newValues = { ...prev, [key]: value };
      console.log("Form values updated:", {
        key,
        oldValue: prev[key],
        newValue: value,
        allValues: newValues,
      });
      return newValues;
    });

    // Check if this change is different from the original value
    if (selectedRow) {
      const originalValue =
        selectedRow[key] ??
        (inputConfig.find((f) => f.key === key)?.type === "multi-select"
          ? []
          : "");
      const hasChanged =
        JSON.stringify(value) !== JSON.stringify(originalValue);

      console.log("Change detection:", {
        key,
        value,
        originalValue,
        hasChanged,
      });

      if (hasChanged) {
        setHasUnsavedChanges(true);
      } else {
        // Check if any other fields have changes
        const anyChanges = Object.entries({ ...formValues, [key]: value }).some(
          ([fieldKey, fieldValue]) => {
            const fieldOriginalValue =
              selectedRow[fieldKey] ??
              (inputConfig.find((f) => f.key === fieldKey)?.type ===
              "multi-select"
                ? []
                : "");
            return (
              JSON.stringify(fieldValue) !== JSON.stringify(fieldOriginalValue)
            );
          },
        );
        setHasUnsavedChanges(anyChanges);
      }
    }
  };

  // Handle Discard Changes - reset form to original values
  const handleDiscardChanges = () => {
    if (!selectedRow) return;

    // Reset form values to original selectedRow values
    const originalValues: Record<string, any> = {};
    inputConfig.forEach((field) => {
      const key = field.key || field.label;
      const value =
        selectedRow[key] ?? (field.type === "multi-select" ? [] : "");
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
      console.error("Missing required data for save:", {
        selectedRow: !!selectedRow,
        gridName,
      });
      toast({
        title: "Save Error",
        description: "Missing required data for save operation",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    // Store the previous data for rollback in case of error
    let previousData: any = null;
    let previousProviderData: any = null;

    try {
      // Only include valid DB columns in the update
      const validColumns = inputConfig.map((f) => f.key).filter(Boolean);

      // Filter and clean the updates
      const filteredUpdates = Object.fromEntries(
        Object.entries(formValues)
          .filter(([key]) => validColumns.includes(key))
          .map(([key, value]) => {
            const field = inputConfig.find((f) => f.key === key);
            // Serialize multi-select fields: convert array of {id, label} to array of strings
            if (
              field &&
              field.type === "multi-select" &&
              Array.isArray(value)
            ) {
              return [
                key,
                value.map((v: any) =>
                  typeof v === "object" && v !== null ? v.id || v.label : v,
                ),
              ];
            }
            // Handle empty date fields - convert empty strings to null for date fields
            const isDateField =
              field &&
              (field.type === "date" ||
                key.includes("date") ||
                key.includes("Date") ||
                key === "last_updated" ||
                key === "enumeration_date" ||
                key === "issue_date" ||
                key === "expiration_date");

            if (isDateField) {
            }

            if (
              isDateField &&
              (value === "" || value === null || value === undefined)
            ) {
              return [key, null];
            }

            // Also handle invalid date strings
            if (
              isDateField &&
              typeof value === "string" &&
              value.trim() === ""
            ) {
              return [key, null];
            }

            return [key, value];
          }),
      );

      // Log fields that are being excluded
      const excludedFields = Object.entries(formValues).filter(
        ([key]) => !validColumns.includes(key),
      );
      if (excludedFields.length > 0) {
        console.log("Excluded fields from update:", excludedFields);
      }

      // Check if there are any updates to save
      if (Object.keys(filteredUpdates).length === 0) {
        console.log("No updates to save. filteredUpdates:", filteredUpdates);
        return;
      }

      // Optimistic update: Update the cache immediately (optional, can be expanded for more grids)
      if (gridName === "State_Licenses") {
        queryClient.setQueryData(["stateLicenses"], (oldData: any[]) => {
          if (!oldData) return oldData;
          previousData = oldData;
          return oldData.map((item) =>
            item.id === selectedRow.id ? { ...item, ...filteredUpdates } : item,
          );
        });
        if (selectedRow.provider_id) {
          queryClient.setQueryData(
            ["providerStateLicenses", selectedRow.provider_id],
            (oldData: any[]) => {
              if (!oldData) return oldData;
              return oldData.map((item) =>
                item.id === selectedRow.id
                  ? { ...item, ...filteredUpdates }
                  : item,
              );
            },
          );
        }
      } else if (gridName === "Provider_Info") {
        queryClient.setQueryData(["providers"], (oldData: any[]) => {
          if (!oldData) return oldData;
          previousData = oldData;
          return oldData.map((item) =>
            item.id === selectedRow.id ? { ...item, ...filteredUpdates } : item,
          );
        });
      }
      // --- DYNAMIC TABLE UPDATE LOGIC ---
      console.log("Save operation grid name:", {
        gridName,
        availableMappings: Object.keys(gridToTableMap),
      });
      const tableName = gridToTableMap[gridName];
      if (!tableName) {
        console.error("Available grid mappings:", Object.keys(gridToTableMap));
        console.error("Grid name not found in mappings:", gridName);
        throw new Error(`No table mapping found for gridName: ${gridName}`);
      }

      console.log("Updating record:", {
        tableName,
        recordId: selectedRow.id,
        updates: filteredUpdates,
      });
      // Remove optimistic update: do not call setQueryData for legacy keys
      // Only refetch the grid_data queries after save
      let result;
      try {
        result = await updateRecord(tableName, selectedRow.id, filteredUpdates);
        console.log("Supabase updateRecord result:", result);
        // Refetch all grid data queries so GridDataFetcher and side panel get fresh data
        await queryClient.refetchQueries({
          queryKey: ["grid_data"],
          exact: false,
        });
      } catch (updateError) {
        console.error("Supabase updateRecord error:", updateError);
        throw updateError;
      }
      // Update parent state as well
      if (onUpdateSelectedProvider) {
        const updatedProvider = { ...selectedRow, ...filteredUpdates };
        onUpdateSelectedProvider(gridName, updatedProvider);
      }
      // Invalidate and refetch the appropriate query cache to ensure consistency
      const queryKeyMap: Record<string, string> = {
        Provider_Info: "providers",
        State_Licenses: "state_licenses",
        Birth_Info: "birth_info",
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
    } catch (err: any) {
      console.error("Failed to save:", err);

      // Rollback optimistic updates on error
      if (gridName === "State_Licenses" && previousData) {
        queryClient.setQueryData(["stateLicenses"], previousData);
      } else if (gridName === "Provider_Info" && previousData) {
        queryClient.setQueryData(["providers"], previousData);
      }

      // Show error feedback
      setSaveSuccess(false); // Hide success message on error

      // Show user-friendly error message
      const errorMessage =
        err?.message || err?.error_description || "Unknown error occurred";
      toast({
        title: "Save Failed",
        description: `Failed to save changes: ${errorMessage}`,
        variant: "destructive",
      });

      console.error("Save failed:", errorMessage);
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
      document_type: "Other Misc",
      permission: "Public",
      date: new Date().toISOString().slice(0, 10),
      exp_date: null,
      verif_date: null,
      exp_na: false,
      bucket: "documents",
      path: `${user.id}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`,
      created_at: new Date().toISOString(),
      author: user?.user_metadata?.full_name || user?.email || "Unknown",
      isOptimistic: true, // Flag to identify optimistic documents
    }));

    // Add optimistic documents to the UI immediately
    setDocuments((prev) => [...optimisticDocuments, ...prev]);

    // Process each file upload
    const uploadPromises = files.map(async (file, index) => {
      const optimisticDoc = optimisticDocuments[index];
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `${user.id}/${safeName}`;

      try {
        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("documents")
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
          document_type: "Other Misc",
          permission: "Public",
          date: new Date().toISOString().slice(0, 10),
          exp_date: null,
          verif_date: null,
          exp_na: false,
          bucket: "documents",
          path: filePath,
        };

        const inserted = await insertDocument(docMeta);

        // Replace optimistic document with real one
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === optimisticDoc.id
              ? { ...inserted, isOptimistic: false }
              : doc,
          ),
        );

        return { success: true, file: file.name };
      } catch (error: any) {
        // Remove optimistic document on error
        setDocuments((prev) =>
          prev.filter((doc) => doc.id !== optimisticDoc.id),
        );

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
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    // Show summary toast if there were multiple files
    if (files.length > 1) {
      if (successCount > 0 && failureCount === 0) {
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${successCount} file${successCount > 1 ? "s" : ""}`,
          variant: "success",
        });
      } else if (successCount > 0 && failureCount > 0) {
        toast({
          title: "Upload Partial",
          description: `Uploaded ${successCount} file${successCount > 1 ? "s" : ""}, ${failureCount} failed`,
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
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
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
  if (template?.getDetailsComponent) {
    // Use context-aware component selection
    DetailsComponent = template.getDetailsComponent(context);
  } else if (template?.DetailsComponent) {
    if (typeof template.DetailsComponent === "string") {
      DetailsComponent = detailsComponentMap[template.DetailsComponent];
    } else {
      DetailsComponent = template.DetailsComponent;
    }
  }

  // Header formatting
  let headerText = "";
  if (template && template.header) {
    const displayGridName = formatGridName(gridName || "");
    if (providerLoading && gridName !== "Provider_Info") {
      headerText = "Loading provider...";
    } else if (providerError && gridName !== "Provider_Info") {
      headerText = "Error loading provider";
    } else {
      headerText = template.header({
        gridName: displayGridName,
        row: selectedRow,
        provider: effectiveProvider,
      });
    }
  } else {
    headerText = title || "";
  }

  // Tabs from template
  let tabIds: string[] = [];
  let tabs: any[] = [];
  // Type guard for array of tab config objects
  function isTabConfigArray(tabs: any[]): tabs is { id: string }[] {
    return (
      Array.isArray(tabs) &&
      typeof tabs[0] === "object" &&
      tabs[0] !== null &&
      "id" in tabs[0]
    );
  }
  if (template && template.tabs) {
    if (isTabConfigArray(template.tabs)) {
      // Array of tab config objects
      tabs = template.tabs.map((tabObj) => {
        if (tabObj.id === "details" || tabObj.id === "team") {
          return {
            id: tabObj.id,
            label:
              tabObj.label ||
              tabObj.id.charAt(0).toUpperCase() + tabObj.id.slice(1),
            icon:
              tabObj.icon ||
              (tabObj.id === "details" ? "bars-staggered" : "users"),
            enabled: tabObj.enabled !== undefined ? tabObj.enabled : true,
          };
        }
        return (
          sharedTabsById[tabObj.id] || {
            id: tabObj.id,
            label: tabObj.label || tabObj.id,
            enabled: false,
          }
        );
      });
      tabIds = tabs.map((t: any) => String(t.id));
    } else {
      // Array of tab ids (strings)
      tabIds = template.tabs as string[];
      tabs = tabIds.map((id) => {
        if (id === "details" || id === "team") {
          return {
            id,
            label: id.charAt(0).toUpperCase() + id.slice(1),
            icon: id === "details" ? "bars-staggered" : "users",
            enabled: true,
          };
        }
        return sharedTabsById[id] || { id, label: id, enabled: false };
      });
    }
  }

  // Determine header styling based on context
  const headerClassName =
    context === "sidepanel"
      ? "flex items-center justify-between p-4 border-b border-gray-200 bg-[#008BC9] text-white"
      : "flex flex-row items-center justify-between pb-4 flex-shrink-0 border-b border-gray-200";

  const headerTitleClassName =
    context === "sidepanel"
      ? "text-lg font-semibold"
      : "flex items-center gap-2 text-lg font-bold text-gray-700 tracking-wider";

  const containerClassName =
    context === "sidepanel"
      ? `fixed top-0 right-0 h-full bg-white transform transition-transform duration-300 ease-in-out z-[1000] flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`
      : "flex-1 min-h-0 flex flex-col";

  const containerStyle =
    context === "sidepanel"
      ? {
          width: `${panelWidth}px`,
          boxShadow: isOpen
            ? "-8px 0 24px -2px rgba(0, 0, 0, 0.12), -4px 0 8px -2px rgba(0, 0, 0, 0.08)"
            : "none",
        }
      : {};

  const footerClassName =
    context === "sidepanel"
      ? `border-t border-gray-200 p-4 transition-all duration-300 ease-in-out transform ${
          hasUnsavedChanges || isSaving || saveSuccess
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`
      : `border-t border-gray-200 p-4 transition-all duration-300 ease-in-out transform ${
          hasUnsavedChanges || isSaving || saveSuccess
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`;

  const footerStyle =
    context === "sidepanel"
      ? {
          position: "absolute" as const,
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          zIndex: 10,
        }
      : {
          position: "relative" as const,
          bottom: 0,
          left: 0,
          right: 0,
          background: "white",
          zIndex: 10,
        };

  return (
    <div
      className={containerClassName}
      role="dialog"
      aria-modal="true"
      aria-label={headerText}
      data-testid={`grid-item-details-${context}`}
      style={containerStyle}
    >
      {/* Resize Handle - only for sidepanel context */}
      {context === "sidepanel" && (
        <div
          ref={resizeRef}
          className={`absolute left-0 top-0 w-1 h-full cursor-col-resize z-10 transition-colors duration-200 ${
            isHoveringResizeHandle || isResizing
              ? "bg-[#008BC9]"
              : "bg-transparent hover:bg-[#E3F2FD]"
          }`}
          onMouseDown={handleMouseDown}
          onMouseEnter={() => setIsHoveringResizeHandle(true)}
          onMouseLeave={() => setIsHoveringResizeHandle(false)}
          role="separator"
          aria-label="Resize side panel"
          aria-orientation="vertical"
          data-testid="side-panel-resize-handle"
        />
      )}

      {/* Header */}
      <div
        className={headerClassName}
        data-testid={`grid-item-details-header-${context}`}
      >
        <div className="flex-1">
          <h2 className={headerTitleClassName}>{headerText}</h2>
        </div>
        {/* Expand icon button - only for sidepanel context */}
        {context === "sidepanel" && onExpandDetailModal && (
          <button
            onClick={onExpandDetailModal}
            className="ml-2 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Expand details modal"
            data-testid="expand-detail-modal-button"
          >
            <FontAwesomeIcon
              icon={faUpRightAndDownLeftFromCenter}
              className="w-5 h-5"
            />
          </button>
        )}
        {/* Close icon button - only for sidepanel context */}
        {context === "sidepanel" && (
          <button
            onClick={onClose}
            className={`ml-4 p-2 rounded-full transition-colors hover:bg-white hover:bg-opacity-20`}
            aria-label={`Close sidepanel`}
            data-testid={`close-sidepanel-button`}
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tabs and Content */}
      <div className="flex-1 min-h-0 flex flex-col">
        {context === "sidepanel" ? (
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="flex flex-1 min-h-0"
            data-testid={`grid-item-details-tabs-${context}`}
          >
            <TabsList
              className="flex flex-col w-20 pt-0 pb-0 px-0 p-0 gap-0 border-r border-gray-200 items-center justify-start"
              data-testid={`grid-item-details-tabs-list-${context}`}
            >
              {tabs.map((tabConfig) => {
                // Feature flag logic for new_sidepanel
                const { value: isNewSidepanel } =
                  useFeatureFlag("new_sidepanel");
                const TabComponent = isNewSidepanel
                  ? SidePanelTab
                  : SidePanelTabLegacy;
                return (
                  <TabsTrigger
                    key={tabConfig.id}
                    value={tabConfig.id}
                    className="p-0 border-0 bg-transparent w-full data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <TabComponent
                      rowKey={tabConfig.id}
                      fullLabel={tabConfig.label}
                      iconLabel={tabConfig.label}
                      icon={tabConfig.icon}
                      isActive={tab === tabConfig.id}
                    />
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <div
              className="flex-1 min-h-0 flex flex-col overflow-y-auto p-2"
              data-testid={`grid-item-details-tabpanel-container-${context}`}
            >
              {/* Tab Title */}
              {(() => {
                const activeTab = tabs.find((t) => t.id === tab);
                return activeTab ? (
                  <h2
                    className="text-lg font-semibold text-[#545454] my-4"
                    data-testid={`grid-item-details-tab-title-${context}`}
                  >
                    {activeTab.label}
                  </h2>
                ) : null;
              })()}

              {tabs.some((t) => t.id === "details") && tab === "details" && (
                <TabsContent
                  value="details"
                  role="tabpanel"
                  aria-label="Details Tab"
                  data-testid={`grid-item-details-tabpanel-details-${context}`}
                >
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
                <TabsContent
                  value={tab}
                  className="flex-1 min-h-0 flex flex-col p-0 m-0"
                  role="tabpanel"
                  aria-label={`${tab.charAt(0).toUpperCase() + tab.slice(1)} Tab`}
                  data-testid={`grid-item-details-tabpanel-${tab}-${context}`}
                >
                  {(() => {
                    switch (tab) {
                      case "notes": {
                        const NotesComponent = sharedTabsById["notes"]
                          ?.Component as React.FC<any>;
                        return (
                          selectedRow &&
                          NotesComponent &&
                          React.createElement(NotesComponent, {
                            className: "flex-1 min-h-0",
                            recordId: selectedRow.id,
                            recordType: gridName || "Provider_Info",
                            user: user,
                          })
                        );
                      }
                      case "documents": {
                        const DocumentsComponent = sharedTabsById["documents"]
                          ?.Component as React.FC<any>;
                        return documents.length > 0 ? (
                          <>
                            <div
                              className="flex-1 overflow-y-auto"
                              role="attached-documents-grid"
                            >
                              {DocumentsComponent &&
                                React.createElement(DocumentsComponent, {
                                  documents: documents,
                                  onEdit: handleEditDocument,
                                  onDelete: handleDeleteDocument,
                                })}
                              {documentsLoading && (
                                <div className="text-gray-500 mt-2">
                                  Loading documents...
                                </div>
                              )}
                            </div>
                            <div className="mt-4 flex-shrink-0">
                              <FileDropzone
                                onFilesAccepted={handleFilesAccepted}
                              />
                            </div>
                          </>
                        ) : (
                          <FileDropzone onFilesAccepted={handleFilesAccepted} />
                        );
                      }
                      default:
                        return null;
                    }
                  })()}
                </TabsContent>
              )}
              {tabs.some((t) => t.id === "team") && tab === "team" && (
                <TabsContent
                  value="team"
                  role="tabpanel"
                  aria-label="Team Tab"
                  data-testid={`grid-item-details-tabpanel-team-${context}`}
                >
                  <div className="text-gray-500">
                    Team tab content goes here.
                  </div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        ) : (
          // Modal context - use NavItem-based navigation like FacilityDetailsModal
          <div
            className="flex-1 flex flex-col min-h-0"
            data-testid={`grid-item-details-tabs-${context}`}
          >
            <div className="flex flex-1 min-h-0">
              {/* Left sidebar navigation */}
              <div
                className="w-48 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col"
                data-testid="grid-item-details-sidebar"
              >
                <div className="pt-5 pr-5 flex-shrink-0">
                  <nav
                    className="space-y-4"
                    role="navigation"
                    aria-label="Grid item details sections"
                  >
                    {tabs.map((tabConfig) => (
                      <NavItem
                        key={tabConfig.id}
                        variant="sidenav"
                        active={tab === tabConfig.id}
                        onClick={() => setTab(tabConfig.id)}
                        icon={
                          <FontAwesomeIcon
                            icon={
                              tabConfig.icon === "bars-staggered"
                                ? faBarsStaggered
                                : tabConfig.icon === "note-sticky"
                                  ? faNoteSticky
                                  : tabConfig.icon === "folder"
                                    ? faFolder
                                    : tabConfig.icon === "users"
                                      ? faUsers
                                      : getIconByName(tabConfig.icon)
                            }
                            className="w-5 h-5"
                          />
                        }
                        className="w-full text-left font-medium"
                        data-testid={`grid-item-${tabConfig.id}-tab`}
                      >
                        {tabConfig.label}
                      </NavItem>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main content area */}
              <div
                className="flex-1 flex flex-col min-h-0"
                data-testid="grid-item-details-main-content"
              >
                {/* Tab header */}
                <div className="flex-shrink-0 p-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-700 tracking-wide">
                    {tabs.find((t) => t.id === tab)?.label || "Details"}
                  </h2>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto px-5  min-h-0">
                  {tabs.some((t) => t.id === "details") &&
                    tab === "details" && (
                      <div data-testid="grid-item-details-content">
                        {DetailsComponent && (
                          <Suspense fallback={<div>Loading details...</div>}>
                            <DetailsComponent
                              formValues={formValues}
                              handleChange={handleChange}
                            />
                          </Suspense>
                        )}
                      </div>
                    )}

                  {tabs.some((t) => t.id === tab) && tab !== "details" && (
                    <div data-testid={`grid-item-${tab}-content`}>
                      {(() => {
                        switch (tab) {
                          case "notes": {
                            const NotesComponent = sharedTabsById["notes"]
                              ?.Component as React.FC<any>;
                            return (
                              selectedRow &&
                              NotesComponent &&
                              React.createElement(NotesComponent, {
                                className: "flex-1 min-h-0",
                                recordId: selectedRow.id,
                                recordType: gridName || "Provider_Info",
                                user: user,
                              })
                            );
                          }
                          case "documents": {
                            const DocumentsComponent = sharedTabsById[
                              "documents"
                            ]?.Component as React.FC<any>;
                            return documents.length > 0 ? (
                              <>
                                <div
                                  className="flex-1 overflow-y-auto"
                                  role="attached-documents-grid"
                                >
                                  {DocumentsComponent &&
                                    React.createElement(DocumentsComponent, {
                                      documents: documents,
                                      onEdit: handleEditDocument,
                                      onDelete: handleDeleteDocument,
                                    })}
                                  {documentsLoading && (
                                    <div className="text-gray-500 mt-2">
                                      Loading documents...
                                    </div>
                                  )}
                                </div>
                                <div className="mt-4 flex-shrink-0">
                                  <FileDropzone
                                    onFilesAccepted={handleFilesAccepted}
                                  />
                                </div>
                              </>
                            ) : (
                              <FileDropzone
                                onFilesAccepted={handleFilesAccepted}
                              />
                            );
                          }
                          case "team": {
                            return (
                              <div className="text-gray-500">
                                Team tab content goes here.
                              </div>
                            );
                          }
                          default:
                            return null;
                        }
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions - Animated slide from bottom */}
      <div
        className={footerClassName}
        data-testid={`grid-item-details-footer-${context}`}
        style={footerStyle}
      >
        <div className="flex gap-3">
          <button
            className="flex-1 bg-gray-100 text-[#545454] py-2 px-4 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
            aria-label="Discard Changes"
            data-testid={`grid-item-details-discard-changes-button-${context}`}
            onClick={handleDiscardChanges}
          >
            Discard Changes
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
              isSaving
                ? "bg-gray-400 text-white cursor-not-allowed"
                : saveSuccess
                  ? "bg-[#79AC48] text-white cursor-default"
                  : "bg-[#008BC9] text-white hover:bg-[#007399]"
            }`}
            onClick={handleSave}
            disabled={isSaving || saveSuccess}
            aria-label={
              isSaving
                ? "Saving changes..."
                : saveSuccess
                  ? "Changes saved successfully"
                  : "Save changes"
            }
            aria-describedby={isSaving ? "saving-status" : undefined}
            data-testid={`grid-item-details-save-button-${context}`}
            role="button"
            type="button"
          >
            {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save"}
            {isSaving && (
              <span id="saving-status" className="sr-only">
                Saving changes to database
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GridItemDetails;
