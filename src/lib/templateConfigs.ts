import { InputField } from "@/components/SidePanel";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  tabs: TabConfig[];
  fieldGroups: FieldGroup[];
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  component?: string;
  enabled: boolean;
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
      {
        id: "details",
        label: "Details",
        icon: "user-doctor",
        enabled: true
      },
      {
        id: "notes",
        label: "Notes",
        icon: "file-medical",
        enabled: true
      },
      {
        id: "documents",
        label: "Documents",
        icon: "folder",
        enabled: true
      },
      {
        id: "history",
        label: "History",
        icon: "clock",
        enabled: true
      }
    ],
    fieldGroups: [
      {
        id: "provider_name",
        title: "Provider Name",
        fields: [
          {
            label: "Prefix",
            group: "Provider Name",
            type: "single-select",
            placeholder: "Select Prefix",
            options: ["Dr.", "Mr.", "Mrs.", "Ms.", "Mx.", "Prof.", "Rev.", "Sr.", "Fr.", "Hon.", "Other"],
            rowKey: "prefix"
          },
          {
            label: "First Name",
            group: "Provider Name",
            type: "text",
            placeholder: "Enter first name",
            rowKey: "first_name"
          },
          {
            label: "Middle Name",
            group: "Provider Name",
            type: "text",
            placeholder: "Enter middle name",
            rowKey: "middle_name"
          },
          {
            label: "Last Name",
            group: "Provider Name",
            type: "text",
            placeholder: "Enter last name",
            required: true,
            rowKey: "last_name"
          },
          {
            label: "Suffix",
            group: "Provider Name",
            type: "single-select",
            placeholder: "Select Suffix",
            options: ["Jr.", "Sr.", "II", "III", "IV", "V", "MD", "DO", "PhD", "Esq.", "Other"],
            rowKey: "suffix"
          }
        ]
      },
      {
        id: "provider_details",
        title: "Provider Details",
        fields: [
          {
            label: "Provider Title",
            group: "Provider Details",
            type: "single-select",
            placeholder: "Select Provider Title",
            required: true,
            options: [
              "ND - Doctor of Naturopathy",
              "OD - Optometrist",
              "OTD - Doctor of Occupational Therapy",
              "PharmD - Doctor of Pharmacy",
              "PsyD - Doctor of Psychology",
              "SLPD - Doctor of Speech-Language Pathology",
              "SP - Supervising Physician",
              "MD - Doctor of Medicine",
              "PA - Physician Assistant",
              "NP - Nurse Practitioner",
              "CNM - Certified Nurse Midwife",
              "DC - Doctor of Chiropractic",
              "DPT - Doctor of Physical Therapy",
              "DPM - Doctor of Podiatric Medicine",
              "DDS - Doctor of Dental Surgery",
              "RD - Registered Dietitian",
              "LCSW - Licensed Clinical Social Worker",
              "LCPC - Licensed Clinical Professional Counselor",
              "LPC - Licensed Professional Counselor",
              "DO - Osteopathic Doctor",
              "DNP - Doctor of Nursing Practice",
              "DMD - Doctor of Dental Medicine",
              "DVM - Doctor of Veterinary Medicine",
              "DrPH - Doctor of Public Health",
              "EdD - Doctor of Education",
              "DMSc - Doctor of Medical Science"
            ],
            rowKey: "title"
          },
          {
            label: "NPI Number",
            group: "Provider Details",
            type: "text",
            placeholder: "Enter NPI number",
            required: true,
            rowKey: "npi_number"
          },
          {
            label: "Primary Specialty",
            group: "Provider Details",
            type: "single-select",
            placeholder: "Select primary specialty",
            options: [
              "Abdominal Imaging",
              "Acupuncture",
              "Acute Care",
              "Addiction Medicine",
              "Adolescent Medicine",
              "Adult Medicine",
              "Allergy and Immunology",
              "Anesthesiology",
              "Bariatric Medicine",
              "Breast Surgery",
              "Burn Surgery",
              "Cardiology",
              "Cardiothoracic Surgery",
              "Pediatrics",
              "Critical Care Medicine",
              "Dermatology"
            ],
            rowKey: "primary_specialty"
          }
        ]
      },
      {
        id: "contact_info",
        title: "Contact Information",
        fields: [
          {
            label: "Work Email",
            group: "Contact Information",
            type: "text",
            placeholder: "Enter work email",
            rowKey: "work_email"
          },
          {
            label: "Personal Email",
            group: "Contact Information",
            type: "text",
            placeholder: "Enter personal email",
            rowKey: "personal_email"
          },
          {
            label: "Mobile Phone",
            group: "Contact Information",
            type: "text",
            placeholder: "Enter mobile phone",
            rowKey: "mobile_phone_number"
          }
        ]
      }
    ]
  },
  {
    id: "state_licenses",
    name: "State Licenses",
    description: "Template for displaying state license information",
    tabs: [
      {
        id: "details",
        label: "Details",
        icon: "shield-halved",
        enabled: true
      },
      {
        id: "notes",
        label: "Notes",
        icon: "file-medical",
        enabled: true
      },
      {
        id: "documents",
        label: "Documents",
        icon: "folder",
        enabled: true
      },
      {
        id: "history",
        label: "History",
        icon: "clock",
        enabled: true
      }
    ],
    fieldGroups: [
      {
        id: "license_details",
        title: "License Details",
        fields: [
          {
            label: "License Type",
            group: "License Details",
            type: "single-select",
            placeholder: "Select license type",
            required: true,
            options: [
              "MD - Medical Doctor",
              "DO - Doctor of Osteopathic Medicine",
              "NP - Nurse Practitioner",
              "PA - Physician Assistant",
              "RN - Registered Nurse",
              "LPN - Licensed Practical Nurse",
              "CRNA - Certified Registered Nurse Anesthetist",
              "DPM - Doctor of Podiatric Medicine",
              "DDS - Doctor of Dental Surgery",
              "DMD - Doctor of Dental Medicine"
            ],
            rowKey: "license_type"
          },
          {
            label: "License Number",
            group: "License Details",
            type: "text",
            placeholder: "Enter license number",
            required: true,
            rowKey: "license"
          },
          {
            label: "Additional Info",
            group: "License Details",
            type: "text",
            placeholder: "Enter additional information",
            rowKey: "license_additional_info"
          },
          {
            label: "State",
            group: "License Details",
            type: "single-select",
            placeholder: "Select state",
            required: true,
            options: [
              "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
              "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
              "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
              "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
              "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
            ],
            rowKey: "state"
          },
          {
            label: "Status",
            group: "License Details",
            type: "single-select",
            placeholder: "Select status",
            required: true,
            options: ["Active", "Expired", "Pending", "Suspended", "Revoked"],
            rowKey: "status"
          }
        ]
      },
      {
        id: "dates",
        title: "Important Dates",
        fields: [
          {
            label: "Issue Date",
            group: "Important Dates",
            type: "date",
            placeholder: "Select issue date",
            rowKey: "issue_date"
          },
          {
            label: "Expiration Date",
            group: "Important Dates",
            type: "date",
            placeholder: "Select expiration date",
            rowKey: "expiration_date"
          },
          {
            label: "Expires Within",
            group: "Important Dates",
            type: "text",
            placeholder: "Days until expiration",
            rowKey: "expires_within"
          }
        ]
      },
      {
        id: "metadata",
        title: "Metadata",
        fields: [
          {
            label: "Tags",
            group: "Metadata",
            type: "multi-select",
            placeholder: "Select tags",
            options: ["urgent", "expiring", "renewal", "compliance", "audit", "pending", "primary", "secondary"],
            rowKey: "tags"
          },
          {
            label: "Last Updated",
            group: "Metadata",
            type: "date",
            placeholder: "Last updated date",
            rowKey: "last_updated"
          }
        ]
      }
    ]
  }
];

// Mapping from grid table names to template IDs
export const gridToTemplateMap: Record<string, string> = {
  "Provider_Info": "provider_info",
  "State_Licenses": "state_licenses"
};

// Helper function to get template config by grid name
export function getTemplateConfigByGrid(gridName: string): TemplateConfig | null {
  const templateId = gridToTemplateMap[gridName];
  if (!templateId) return null;
  
  return templateConfigs.find(template => template.id === templateId) || null;
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