import { InputField } from "@/components/SidePanel";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  tabs: TabConfig[];
  fieldGroups: FieldGroup[];
  header?: (args: { gridName: string; row: any; provider?: any }) => string;
  DetailsComponent?: string;
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  component?: string;
  enabled: boolean;
  fullLabel?: string;
  iconLabel?: string;
}

export interface FieldGroup {
  id: string;
  title: string;
  fields: InputField[];
}

// Template configurations for different grid types
export const templateConfigs: TemplateConfig[] = [
  {
    id: "provider_info",
    name: "Provider Information",
    description: "Template for displaying provider information details",
    tabs: [
      { id: "details", label: "Details", icon: "bars-staggered", enabled: true },
      { id: "notes", label: "Notes", icon: "file-medical", enabled: true },
      { id: "documents", label: "Documents", icon: "folder", enabled: true },
      { id: "history", label: "History", icon: "clock", enabled: true }
    ],
    fieldGroups: [
      {
        id: "provider_info_flat",
        title: "Provider Info",
        fields: [
          { label: "Prefix", fieldType: "single-select", dataType: "text", options: ["Dr.", "Mr.", "Mrs.", "Ms.", "Mx.", "Prof.", "Rev.", "Sr.", "Fr.", "Hon.", "Other"], rowKey: "prefix", group: "Provider Info" },
          { label: "First Name", fieldType: "text", dataType: "text", rowKey: "first_name", group: "Provider Info" },
          { label: "Middle Name", fieldType: "text", dataType: "text", rowKey: "middle_name", group: "Provider Info" },
          { label: "Last Name", fieldType: "text", dataType: "text", rowKey: "last_name", group: "Provider Info" },
          { label: "Suffix", fieldType: "single-select", dataType: "text", options: ["Jr.", "Sr.", "II", "III", "IV", "V", "MD", "DO", "PhD", "Esq.", "Other"], rowKey: "suffix", group: "Provider Info" },
          { label: "Pronouns", fieldType: "single-select", dataType: "text", options: ["He/him/his", "She/her/hers", "They/them/theirs", "Other (please specify)"], rowKey: "pronouns", group: "Provider Info" },
          { label: "Provider Title", fieldType: "single-select", dataType: "text", options: ["ND - Doctor of Naturopathy", "OD - Optometrist", "OTD - Doctor of Occupational Therapy", "PharmD - Doctor of Pharmacy", "PsyD - Doctor of Psychology", "SLPD - Doctor of Speech-Language Pathology", "SP - Supervising Physician", "MD - Medical Doctor", "PA - Physician Assistant", "NP - Nurse Practitioner", "CNM - Certified Nurse Midwife", "DC - Doctor of Chiropractic", "DPT - Doctor of Physical Therapy", "DPM - Doctor of Podiatric Medicine", "DDS - Doctor of Dental Surgery", "RD - Registered Dietitian", "LCSW - Licensed Clinical Social Worker", "LCPC - Licensed Clinical Professional Counselor", "LPC - Licensed Professional Counselor", "DO - Osteopathic Doctor", "DNP - Doctor of Nursing Practice", "DMD - Doctor of Dental Medicine", "DVM - Doctor of Veterinary Medicine", "DrPH - Doctor of Public Health", "EdD - Doctor of Education", "DMSc - Doctor of Medical Science"], rowKey: "title", group: "Provider Info" },
          { label: "Primary Specialty", fieldType: "single-select", dataType: "text", options: ["Abdominal Imaging", "Acupuncture", "Acute Care Imaging", "Acute Care Nurse Practitioner", "Acute Registered Nurse", "Addiction (Substance Use Disorder)", "Adolescent Medicine", "Adult Medicine", "Allergy and Immunology", "Anesthesiology", "Bariatric Medicine", "Breast Surgery", "Burn Surgery", "Cardiology", "Cardiothoracic Surgery", "Pediatrics", "Acute Care", "Aerospace Medicine", "Critical Care Medicine", "Dermatology"], rowKey: "primary_specialty", group: "Provider Info" },
          { label: "NPI Number", fieldType: "text", dataType: "text", rowKey: "npi_number", group: "Provider Info" },
          { label: "Work Email", fieldType: "text", dataType: "text", rowKey: "work_email", group: "Provider Info" },
          { label: "Personal Email", fieldType: "text", dataType: "text", rowKey: "personal_email", group: "Provider Info" },
          { label: "Mobile Phone", fieldType: "text", dataType: "text", rowKey: "mobile_phone_number", group: "Provider Info" },
          { label: "Tags", fieldType: "multi-select", dataType: "text[]", rowKey: "tags", group: "Provider Info" },
          { label: "Last Updated", fieldType: "text", dataType: "timestamptz", rowKey: "last_updated", group: "Provider Info" }
        ]
      }
    ]
  },
  {
    id: "state_licenses",
    name: "State Licenses",
    description: "Template for displaying state license details",
    tabs: [
      { id: "details", label: "Details", icon: "bars-staggered", enabled: true },
      { id: "notes", label: "Notes", icon: "file-medical", enabled: true },
      { id: "documents", label: "Documents", icon: "folder", enabled: true }
    ],
    fieldGroups: [
      {
        id: "state_licenses_flat",
        title: "State Licenses",
        fields: [
          { label: "License Type", fieldType: "single-select", dataType: "text", options: ["Medical Doctor", "Osteopathic Physician", "Nurse Practitioner", "Physician Assistant", "Other"], rowKey: "license_type", group: "State Licenses" },
          { label: "License Additional Info", fieldType: "text", dataType: "text", rowKey: "license_additional_info", group: "State Licenses" },
          { label: "State", fieldType: "single-select", dataType: "text", options: ["CA", "NY", "TX", "FL", "CO", "Other"], rowKey: "state", group: "State Licenses" },
          { label: "Status", fieldType: "single-select", dataType: "text", options: ["Active", "Pending Renewal", "Expired", "Suspended", "Other"], rowKey: "status", group: "State Licenses" },
          { label: "Issue Date", fieldType: "text", dataType: "date", rowKey: "issue_date", group: "State Licenses" },
          { label: "Expiration Date", fieldType: "text", dataType: "date", rowKey: "expiration_date", group: "State Licenses" },
          { label: "Expires Within", fieldType: "text", dataType: "text", rowKey: "expires_within", group: "State Licenses" },
          { label: "Tags", fieldType: "multi-select", dataType: "text[]", rowKey: "tags", group: "State Licenses" },
          { label: "Last Updated", fieldType: "text", dataType: "timestamptz", rowKey: "last_updated", group: "State Licenses" }
        ]
          }
        ]
      },
      {
    id: "birth_info",
    name: "Birth Info",
    description: "Template for displaying provider birth information",
    tabs: [
      { id: "details", label: "Details", icon: "bars-staggered", enabled: true },
      { id: "notes", label: "Notes", icon: "file-medical", enabled: true },
      { id: "documents", label: "Documents", icon: "folder", enabled: true }
    ],
    fieldGroups: [
      {
        id: "birth_info_flat",
        title: "Birth Info",
        fields: [
          { label: "Date of Birth", fieldType: "text", dataType: "date", rowKey: "date_of_birth", group: "Birth Info" },
          { label: "Country of Citizenship", fieldType: "text", dataType: "text", rowKey: "country_of_citizenship", group: "Birth Info" },
          { label: "Citizenship/Work Auth", fieldType: "text", dataType: "text", rowKey: "citizenship_work_auth", group: "Birth Info" },
          { label: "US Work Auth", fieldType: "text", dataType: "text", rowKey: "us_work_auth", group: "Birth Info" },
          { label: "Birth City", fieldType: "text", dataType: "text", rowKey: "birth_city", group: "Birth Info" },
          { label: "Birth State/Province", fieldType: "text", dataType: "text", rowKey: "birth_state_province", group: "Birth Info" },
          { label: "Birth County", fieldType: "text", dataType: "text", rowKey: "birth_county", group: "Birth Info" },
          { label: "Birth Country", fieldType: "text", dataType: "text", rowKey: "birth_country", group: "Birth Info" },
          { label: "Gender", fieldType: "single-select", dataType: "text", options: ["Male", "Female", "Non-binary", "Other"], rowKey: "gender", group: "Birth Info" },
          { label: "Identifies as transgender?", fieldType: "single-select", dataType: "boolean", options: ["Yes", "No"], rowKey: "identifies_transgender", group: "Birth Info" },
          { label: "Hair Color", fieldType: "single-select", dataType: "text", options: ["Black", "Brown", "Blonde", "Red", "Gray", "Other"], rowKey: "hair_color", group: "Birth Info" },
          { label: "Eye Color", fieldType: "single-select", dataType: "text", options: ["Brown", "Blue", "Green", "Hazel", "Gray", "Other"], rowKey: "eye_color", group: "Birth Info" },
          { label: "Height (ft)", fieldType: "text", dataType: "integer", rowKey: "height_ft", group: "Birth Info" },
          { label: "Height (in)", fieldType: "text", dataType: "integer", rowKey: "height_in", group: "Birth Info" },
          { label: "Weight (lbs)", fieldType: "text", dataType: "integer", rowKey: "weight_lbs", group: "Birth Info" },
          { label: "Ethnicity", fieldType: "single-select", dataType: "text", options: ["Hispanic", "Non-Hispanic", "Asian", "Black", "White", "Native American", "Other"], rowKey: "ethnicity", group: "Birth Info" },
          { label: "Tags", fieldType: "multi-select", dataType: "text[]", rowKey: "tags", group: "Birth Info" }
        ]
      }
    ]
  }
];

export const componentMap = {
  text: "TextInput",
  "single-select": "SingleSelect",
  "multi-select": "MultiSelect"
};

export const providerInfoTemplate = {
  header: ({ gridName, row, provider }) => {
    const name = provider ? `${provider.first_name || ''} ${provider.last_name || ''}`.trim() : (row.provider_name || '');
    const title = provider ? provider.title || '' : (row.title || '');
    return `${gridName} for ${name} ${title}`.trim();
  },
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true, fullLabel: 'Details', iconLabel: 'Details' },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true, fullLabel: 'Notes', iconLabel: 'Notes' },
    { id: 'documents', label: 'Documents', icon: 'folder', enabled: true, fullLabel: 'Documents', iconLabel: 'Docs' },
    { id: 'team', label: 'Team', icon: 'users', enabled: true, fullLabel: 'Team', iconLabel: 'Team' },
  ],
  DetailsComponent: 'ProviderInfoDetails',
};

export const stateLicenseTemplate = {
  header: ({ gridName, row, provider }) => {
    const name = provider ? `${provider.first_name || ''} ${provider.last_name || ''}`.trim() : (row.provider_name || '');
    const title = provider ? provider.title || '' : (row.title || '');
    return `${gridName} ${row.license || ''} for ${name} ${title}`.trim();
  },
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true, fullLabel: 'Details', iconLabel: 'Details' },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true, fullLabel: 'Notes', iconLabel: 'Notes' },
    { id: 'documents', label: 'Documents', icon: 'folder', enabled: true, fullLabel: 'Documents', iconLabel: 'Docs' },
  ],
  DetailsComponent: 'StateLicenseDetails',
};

// Mapping from grid table names to template IDs
export const gridToTemplateMap: Record<string, string> = {
  "Provider_Info": "provider_info",
  "State_Licenses": "state_licenses",
  "Birth_Info": "birth_info"
};

// Helper function to get template config by grid name
export function getTemplateConfigByGrid(gridName: string): TemplateConfig | null {
  console.log('getTemplateConfigByGrid called with:', gridName);
  
  const templateId = gridToTemplateMap[gridName];
  console.log('Template ID from map:', templateId);
  
  if (!templateId) {
    console.log('No template ID found for grid:', gridName);
    return null;
  }
  
  const template = templateConfigs.find(t => t.id === templateId);
  console.log('Found template:', template);
  
  if (!template) {
    console.log('No template found for ID:', templateId);
    return null;
  }
  
  // Merge with the template-specific header and tabs
  if (gridName === "Provider_Info") {
    const mergedTemplate = {
      ...template,
      header: providerInfoTemplate.header,
      tabs: providerInfoTemplate.tabs,
      DetailsComponent: providerInfoTemplate.DetailsComponent
    };
    console.log('Merged Provider_Info template:', mergedTemplate);
    return mergedTemplate;
  }
  
  if (gridName === "State_Licenses") {
    const mergedTemplate = {
      ...template,
      header: stateLicenseTemplate.header,
      tabs: stateLicenseTemplate.tabs,
      DetailsComponent: stateLicenseTemplate.DetailsComponent
    };
    console.log('Merged State_Licenses template:', mergedTemplate);
    return mergedTemplate;
  }

  if (gridName === "Birth_Info") {
    const mergedTemplate = {
      ...template,
      header: providerInfoTemplate.header, // You may want to customize this for Birth Info
      tabs: template.tabs, // Use the tabs defined in the Birth Info template
      DetailsComponent: 'BirthInfoDetails', // Use the new BirthInfoDetails component
    };
    console.log('Merged Birth_Info template:', mergedTemplate);
    return mergedTemplate;
  }
  
  console.log('Returning base template:', template);
  return template;
}

// Helper function to get template config by template ID
export function getTemplateConfigById(templateId: string): TemplateConfig | null {
  return templateConfigs.find(template => template.id === templateId) || null;
}

// Helper function to get all field groups for a template
export function getFieldGroupsForTemplate(templateId: string): FieldGroup[] {
  const template = getTemplateConfigById(templateId);
  return template?.fieldGroups || [];
}

// Helper function to get all tabs for a template
export function getTabsForTemplate(templateId: string): TabConfig[] {
  const template = getTemplateConfigById(templateId);
  return template?.tabs.filter(tab => tab.enabled) || [];
} 

// Safety check: Ensure all fieldType values are in componentMap
function validateFieldTypes(templateConfigs: any[], componentMap: Record<string, string>) {
  for (const config of templateConfigs) {
    if (!config.fieldGroups) continue;
    for (const group of config.fieldGroups) {
      for (const field of group.fields) {
        if (!componentMap[field.fieldType]) {
          throw new Error(`Invalid fieldType '${field.fieldType}' in template '${config.id}'. Allowed types: ${Object.keys(componentMap).join(", ")}`);
        }
      }
    }
  }
}

validateFieldTypes(templateConfigs, componentMap); 