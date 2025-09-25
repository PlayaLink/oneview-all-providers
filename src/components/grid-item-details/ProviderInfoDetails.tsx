import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../inputs/SingleSelect';
import TextInputField from '../inputs/TextInputField';
import { getInputType, renderFieldComponent } from './getInputType';
import { extractTitleAcronym, generateProviderName, generateDefaultHeaderText } from '@/lib/utils';
import { 
  PROVIDER_TITLES, 
  getTitleAcronym,
  PREFIX_OPTIONS,
  SUFFIX_OPTIONS,
  PRONOUN_OPTIONS,
  PROVIDER_TITLE_OPTIONS,
  SPECIALTY_OPTIONS,
  TAXONOMY_CODE_OPTIONS,
  CLINICAL_SERVICES_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  TELEMED_EXP_OPTIONS,
  LANGUAGE_OPTIONS,
  OTHER_SPECIALTIES_OPTIONS,
  CLASSIFICATION_OPTIONS,
  CMS_MEDICARE_SPECIALTY_OPTIONS,
  MOBILE_CARRIER_OPTIONS,
  RELATIONSHIP_OPTIONS,
  US_STATE_OPTIONS
} from './ProviderInfoSelectInputOptions';

// Re-export provider titles and helper functions from options file
export const providerTitles = PROVIDER_TITLES;
export const getProviderTitleOptions = () => PROVIDER_TITLES.map(title => title.formatted_title);
export { getTitleAcronym };

// Provider Info fieldGroups definition - Updated to match database schema
export const providerInfoFieldGroups = [
  // 1. Provider Name
  {
    id: "provider_name",
    title: "Provider Name",
    fields: [
      { label: "Prefix", group: "Provider Name", type: "single-select", placeholder: "Select Prefix", options: PREFIX_OPTIONS.map(opt => opt.id), key: "prefix" },
      { label: "First Name", group: "Provider Name", type: "text", placeholder: "Enter first name", key: "first_name" },
      { label: "Middle Name", group: "Provider Name", type: "text", placeholder: "Enter middle name", key: "middle_name" },
      { label: "Last Name", group: "Provider Name", type: "text", placeholder: "Enter last name", required: true, key: "last_name" },
      { label: "Suffix", group: "Provider Name", type: "single-select", placeholder: "Select Suffix", options: SUFFIX_OPTIONS.map(opt => opt.id), key: "suffix" },
      { label: "Pronouns", group: "Provider Name", type: "single-select", placeholder: "Select Pronoun Types", options: PRONOUN_OPTIONS.map(opt => opt.id), key: "pronouns" }
    ]
  },
  // 2. Type, Specialty & Classifications
  {
    id: "type_specialty_classifications",
    title: "Type, Specialty & Classifications",
    fields: [
      { label: "Provider Title", group: "Type, Specialty & Classifications", type: "single-select", placeholder: "Select Provider Title", required: true, options: PROVIDER_TITLE_OPTIONS.map(opt => opt.id), key: "title" },
      { label: "Primary Specialty", group: "Type, Specialty & Classifications", type: "single-select", placeholder: "Select Specialties", required: true, options: SPECIALTY_OPTIONS.map(opt => opt.id), key: "primary_specialty" },
      { label: "Other Specialties", group: "Type, Specialty & Classifications", type: "multi-select", placeholder: "Select Other Specialties", options: OTHER_SPECIALTIES_OPTIONS.map(opt => opt.id), key: "other_specialties" },
      { label: "Classifications", group: "Type, Specialty & Classifications", type: "multi-select", placeholder: "Select Provider Classification(s)...", options: CLASSIFICATION_OPTIONS.map(opt => opt.id), key: "classifications" },
      { label: "Taxonomy Codes", group: "Type, Specialty & Classifications", type: "multi-select", placeholder: "Select Taxonomy Code(s)...", options: TAXONOMY_CODE_OPTIONS.map(opt => opt.id), key: "taxonomy_codes" },
      { label: "Clinical Services", group: "Type, Specialty & Classifications", type: "multi-select", placeholder: "Select Clinical Service(s)...", options: CLINICAL_SERVICES_OPTIONS.map(opt => opt.id), key: "clinical_services" },
      { label: "Marital Status", group: "Type, Specialty & Classifications", type: "single-select", placeholder: "Select Marital Status", options: MARITAL_STATUS_OPTIONS.map(opt => opt.id), key: "marital_status" },
      { label: "Telemed Exp.", group: "Type, Specialty & Classifications", type: "single-select", placeholder: "Select Telemed Exp.", options: TELEMED_EXP_OPTIONS.map(opt => opt.id), key: "telemed_exp" },
      { label: "Fluent languages", group: "Type, Specialty & Classifications", type: "multi-select", placeholder: "Select Fluent Language(s)...", options: LANGUAGE_OPTIONS.map(opt => opt.id), key: "fluent_languages" },
      { label: "CMS Medicare Specialty Codes", group: "Type, Specialty & Classifications", type: "multi-select", placeholder: "Select Medicare Specialty Code(s)...", options: CMS_MEDICARE_SPECIALTY_OPTIONS.map(opt => opt.id), key: "cms_medicare_specialty_codes" }
    ]
  },
  // 3. Contact Info
  {
    id: "contact_info",
    title: "Contact Info",
    fields: [
      { label: "Work Email", group: "Contact Info", type: "text", placeholder: "Enter work email", key: "work_email" },
      { label: "Personal Email", group: "Contact Info", type: "text", placeholder: "Enter personal email", key: "personal_email" },
      { label: "Mobile Phone #", group: "Contact Info", type: "text", placeholder: "(___) ___-____", key: "mobile_phone_number" },
      { label: "Mobile Phone Carrier Name", group: "Contact Info", type: "single-select", placeholder: "Select Mobile Phone...", options: MOBILE_CARRIER_OPTIONS.map(opt => opt.id), key: "mobile_phone_carrier_name" },
      { label: "Pager #", group: "Contact Info", type: "text", placeholder: "(___) ___-____", key: "pager_number" },
      { label: "Fax #", group: "Contact Info", type: "text", placeholder: "(___) ___-____", key: "fax_number" }
    ]
  },
  // 4. Emergency Contact
  {
    id: "emergency_contact",
    title: "Emergency Contact",
    fields: [
      { label: "Emergency Contact Name", group: "Emergency Contact", type: "text", placeholder: "Enter emergency contact name", key: "emergency_contact_name" },
      { label: "Email", group: "Emergency Contact", type: "text", placeholder: "email@example.com", key: "emergency_contact_email" },
      { label: "Phone #", group: "Emergency Contact", type: "text", placeholder: "(___) ___-____", key: "emergency_contact_phone" },
      { label: "Relationship", group: "Emergency Contact", type: "single-select", placeholder: "Select Relationship", options: RELATIONSHIP_OPTIONS.map(opt => opt.id), key: "emergency_contact_relationship" }
    ]
  },
  // 5. Identification
  {
    id: "identification",
    title: "Identification",
    fields: [
      { label: "Social Security #", group: "Identification", type: "text", placeholder: "...", key: "social_security_number" },
      { label: "NPI #", group: "Identification", type: "text", placeholder: "Enter NPI number", key: "npi_number" },
      { label: "Last Updated", group: "Identification", type: "date", placeholder: "MM/DD/YYYY", key: "last_updated" },
      { label: "Enumeration Date", group: "Identification", type: "date", placeholder: "MM/DD/YYYY", key: "enumeration_date" },
      { label: "Driver License or ID #", group: "Identification", type: "text", placeholder: "...", key: "driver_license_or_id_number" },
      { label: "State Issued", group: "Identification", type: "single-select", placeholder: "Select State Issued", options: US_STATE_OPTIONS.map(opt => opt.id), key: "state_issued" },
      { label: "Issue Date", group: "Identification", type: "date", placeholder: "MM/DD/YYYY", key: "issue_date" },
      { label: "Expiration Date", group: "Identification", type: "date", placeholder: "MM/DD/YYYY", key: "expiration_date" }
    ]
  },
  // 6. Tags & Metadata
  {
    id: "tags_metadata",
    title: "Tags & Metadata",
    fields: [
      { label: "Tags", group: "Tags & Metadata", type: "multi-select", placeholder: "Select tags", options: ["urgent", "new", "active", "inactive", "pending", "verified", "primary", "secondary"], key: "tags" }
    ]
  }
];

const ProviderInfoDetails = ({ formValues, handleChange }) => (
  <>
    {providerInfoFieldGroups.map((group) => (
      <CollapsibleSection key={group.id} title={group.title}>
        <div className="flex flex-col gap-4 self-stretch">
          {group.fields.map((field) => (
            <React.Fragment key={field.key || field.label}>
              {renderFieldComponent({ field, formValues, handleChange })}
            </React.Fragment>
          ))}
        </div>
      </CollapsibleSection>
    ))}
  </>
);

// Unified template object for Provider Info side panel
export const providerInfoTemplate = {
  id: 'provider_info',
  name: 'Provider Information',
  description: 'Template for displaying provider information details',
  header: ({ gridKey, provider, isCreateMode }: { gridKey: string; provider?: any; isCreateMode?: boolean }) => generateDefaultHeaderText({ gridKey, provider, isCreateMode }),
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'comment', enabled: true },
    { id: 'documents', label: 'Documents 2', icon: 'file-lines', enabled: true },
    { id: 'team', label: 'Team', icon: 'users', enabled: true },
  ],
  fieldGroups: providerInfoFieldGroups,
  DetailsComponent: ProviderInfoDetails,
};

export default ProviderInfoDetails; 