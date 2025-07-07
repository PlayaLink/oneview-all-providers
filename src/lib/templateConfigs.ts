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
      // 1. Provider Name
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
          },
          {
            label: "Pronouns",
            group: "Provider Name",
            type: "single-select",
            placeholder: "Select Pronoun Types",
            options: ["He/him/his", "She/her/hers", "They/them/theirs", "Other (please specify)"],
            rowKey: "pronouns"
          }
        ]
      },
      // 2. Type, Specialty & Classifications
      {
        id: "type_specialty_classifications",
        title: "Type, Specialty & Classifications",
        fields: [
          {
            label: "Provider Title",
            group: "Type, Specialty & Classifications",
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
              "MD - Medical Doctor",
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
            label: "Specialty List",
            group: "Type, Specialty & Classifications",
            type: "multi-select",
            placeholder: "Select Specialties",
            required: true,
            options: [
              "Abdominal Imaging",
              "Acupuncture",
              "Acute Care Imaging",
              "Acute Care Nurse Practitioner",
              "Acute Registered Nurse",
              "Addiction (Substance Use Disorder)",
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
              "Acute Care",
              "Aerospace Medicine",
              "Critical Care Medicine",
              "Dermatology"
            ],
            rowKey: "primary_specialty"
          },
          {
            label: "Classifications",
            group: "Type, Specialty & Classifications",
            type: "multi-select",
            placeholder: "Select Provider Classification(s)...",
            options: [
              "Specialist",
              "Locum Tenens",
              "Primary Care",
              "Hospital-based",
              "Hospitalist",
              "PRN",
              "New Hire",
              "Acquisition",
              "Rehire",
              "Float Pool",
              "Internal Transfer",
              "Cross Credentialed",
              "Fellowship",
              "Subspecialist",
              "Rotating",
              "Clinic Only"
            ],
            rowKey: "classifications"
          },
          {
            label: "Taxonomy Codes",
            group: "Type, Specialty & Classifications",
            type: "multi-select",
            placeholder: "Select Taxonomy Code(s)...",
            options: [
              "Counselor - Addiction (101YA0400X)",
              "Counselor (101Y00000X)",
              "Counselor - Mental Health (101YM0800X)",
              "Counselor - Pastoral (101YP1600X)",
              "Counselor - Professional (101YP2500X)",
              "Counselor - School (101YS0200X)",
              "Psychoanalyst (102L00000X)",
              "Psychologist (103T00000X)",
              "Psychologist - Clinical (103TC0700X)",
              "Social Worker - Clinical (1041C0700X)",
              "Marriage & Family Therapist (106H00000X)",
              "Behavior Analyst (103K00000X)",
              "Case Manager/Care Coordinator (171M00000X)",
              "Psychiatrist & Neurologist (2084P0800X)",
              "Developmental Therapist (222Q00000X)"
            ],
            rowKey: "taxonomy_codes"
          },
          {
            label: "Clinical Services",
            group: "Type, Specialty & Classifications",
            type: "multi-select",
            placeholder: "Select Clinical Service(s)...",
            options: [
              "Outpatient Psychiatric Treatment: Children",
              "Outpatient Psychiatric Treatment: Geriatric",
              "Outpatient Psychiatric Treatment: Adult",
              "Outpatient Psychiatric Treatment Adolescent",
              "Outpatient Substance Use Disorder Treatment: Geriatric",
              "Outpatient Substance Use Disorder Treatment: Adult",
              "Outpatient Substance Use Disorder Treatment: Youth",
              "Partial Hospitalization Program (PHP)",
              "Intensive Outpatient Program (IOP)",
              "Medication Management",
              "Group Therapy",
              "Family Therapy",
              "Individual Counseling",
              "Psychoeducation Services",
              "Case Management"
            ],
            rowKey: "clinical_services"
          },
          {
            label: "Marital Status",
            group: "Type, Specialty & Classifications",
            type: "single-select",
            placeholder: "Select Marital Status",
            options: ["Single", "Married", "Divorced", "Widowed", "Separated", "Other"],
            rowKey: "marital_status"
          },
          {
            label: "Telemed Exp.",
            group: "Type, Specialty & Classifications",
            type: "single-select",
            placeholder: "Select Telemed Exp.",
            options: ["None", "Some", "Extensive"],
            rowKey: "telemed_exp"
          },
          {
            label: "Fluent languages",
            group: "Type, Specialty & Classifications",
            type: "multi-select",
            placeholder: "Select Fluent Language(s)...",
            options: ["English", "Spanish", "French", "German", "Chinese", "Other"],
            rowKey: "fluent_languages"
          },
          {
            label: "CMS Medicare Specialty Codes",
            group: "Type, Specialty & Classifications",
            type: "multi-select",
            placeholder: "Select Medicare Specialty Code(s)...",
            options: ["CMS Code: CMS Desc - Taxonomy Desc (Taxonomy Code)", "Other"],
            rowKey: "cms_medicare_specialty_codes"
          }
        ]
      },
      // 3. Contact Info
      {
        id: "contact_info",
        title: "Contact Info",
        fields: [
          {
            label: "Work Email",
            group: "Contact Info",
            type: "text",
            placeholder: "Enter work email",
            rowKey: "work_email"
          },
          {
            label: "Personal Email",
            group: "Contact Info",
            type: "text",
            placeholder: "Enter personal email",
            rowKey: "personal_email"
          },
          {
            label: "Pager #",
            group: "Contact Info",
            type: "text",
            placeholder: "(___) ___-____",
            rowKey: "pager_number"
          },
          {
            label: "Fax #",
            group: "Contact Info",
            type: "text",
            placeholder: "(___) ___-____",
            rowKey: "fax_number"
          },
          {
            label: "Mobile Phone #",
            group: "Contact Info",
            type: "text",
            placeholder: "(___) ___-____",
            rowKey: "mobile_phone_number"
          },
          {
            label: "Mobile Phone Carrier Name",
            group: "Contact Info",
            type: "single-select",
            placeholder: "Select Mobile Phone...",
            options: ["AT&T", "Verizon", "T-Mobile", "Sprint", "Other"],
            rowKey: "mobile_phone_carrier"
          }
        ]
      },
      // 4. Emergency Contact
      {
        id: "emergency_contact",
        title: "Emergency Contact",
        fields: [
          {
            label: "Emergency Contact Name",
            group: "Emergency Contact",
            type: "text",
            placeholder: "Enter emergency contact name",
            rowKey: "emergency_contact_name"
          },
          {
            label: "Email",
            group: "Emergency Contact",
            type: "text",
            placeholder: "email@example.com",
            rowKey: "emergency_contact_email"
          },
          {
            label: "Phone #",
            group: "Emergency Contact",
            type: "text",
            placeholder: "(___) ___-____",
            rowKey: "emergency_contact_phone"
          },
          {
            label: "Relationship",
            group: "Emergency Contact",
            type: "single-select",
            placeholder: "Select Relationship",
            options: ["Parent", "Sibling", "Spouse", "Friend", "Other"],
            rowKey: "emergency_contact_relationship"
          }
        ]
      },
      // 5. Identification
      {
        id: "identification",
        title: "Identification",
        fields: [
          {
            label: "Social Security #",
            group: "Identification",
            type: "text",
            placeholder: "...",
            rowKey: "ssn"
          },
          {
            label: "NPI #",
            group: "Identification",
            type: "text",
            placeholder: "Enter NPI number",
            rowKey: "npi_number"
          },
          {
            label: "Last Updated",
            group: "Identification",
            type: "text",
            placeholder: "MM/DD/YYYY",
            rowKey: "last_updated"
          },
          {
            label: "Enumeration Date",
            group: "Identification",
            type: "text",
            placeholder: "MM/DD/YYYY",
            rowKey: "enumeration_date"
          },
          {
            label: "Driver License or ID #",
            group: "Identification",
            type: "text",
            placeholder: "...",
            rowKey: "driver_license_id"
          },
          {
            label: "State Issued",
            group: "Identification",
            type: "single-select",
            placeholder: "Select State Issued",
            options: [
              "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
              "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
              "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
              "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
              "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
            ],
            rowKey: "state_issued"
          },
          {
            label: "Issue Date",
            group: "Identification",
            type: "text",
            placeholder: "MM/DD/YYYY",
            rowKey: "issue_date"
          },
          {
            label: "Expiration Date",
            group: "Identification",
            type: "text",
            placeholder: "MM/DD/YYYY",
            rowKey: "expiration_date"
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

export const providerInfoTemplate = {
  header: ({ gridName, row, provider }) => {
    const name = provider ? `${provider.first_name || ''} ${provider.last_name || ''}`.trim() : (row.provider_name || '');
    const title = provider ? provider.title || '' : (row.title || '');
    return `${gridName} for ${name} ${title}`.trim();
  },
  tabs: [
    { id: 'details', label: 'Details', icon: 'user-doctor', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Docs', icon: 'folder', enabled: true },
    { id: 'team', label: 'Team', icon: 'users', enabled: true },
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
    { id: 'details', label: 'Details', icon: 'shield-halved', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Docs', icon: 'folder', enabled: true },
  ],
  DetailsComponent: 'StateLicenseDetails',
};

// Mapping from grid table names to template IDs
export const gridToTemplateMap: Record<string, string> = {
  "Provider_Info": "provider_info",
  "State_Licenses": "state_licenses"
};

// Helper function to get template config by grid name
export function getTemplateConfigByGrid(gridName: string): TemplateConfig | null {
  if (gridName === "Provider_Info") return providerInfoTemplate;
  if (gridName === "State_Licenses") return stateLicenseTemplate;
  return null;
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