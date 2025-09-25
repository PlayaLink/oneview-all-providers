import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { renderFieldComponent } from './getInputType';
import { generateProviderName, generateDefaultHeaderText } from '@/lib/utils';
import {
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

// Provider Info fieldGroups definition for wide modal - Updated to match screenshot layout
export const providerInfoWideFieldGroups = [
  {
    id: "provider_name",
    title: "Provider Name",
    fields: [
      {
        label: "Prefix",
        group: "Provider Name",
        type: "single-select",
        placeholder: "Select Prefix",
        required: false,
        options: PREFIX_OPTIONS.map(opt => opt.id),
        key: "prefix"
      },
      {
        label: "First Name",
        group: "Provider Name",
        type: "text",
        placeholder: "Enter first name",
        required: false,
        key: "first_name"
      },
      {
        label: "Middle Name",
        group: "Provider Name",
        type: "text",
        placeholder: "Enter middle name",
        required: false,
        key: "middle_name"
      },
      {
        label: "Last Name",
        group: "Provider Name",
        type: "text",
        placeholder: "Enter last name",
        required: true,
        key: "last_name"
      },
      {
        label: "Suffix",
        group: "Provider Name",
        type: "single-select",
        placeholder: "Select Suffix",
        required: false,
        options: SUFFIX_OPTIONS.map(opt => opt.id),
        key: "suffix"
      },
      {
        label: "Pronouns",
        group: "Provider Name",
        type: "single-select",
        placeholder: "Select Pronoun Types",
        required: false,
        options: PRONOUN_OPTIONS.map(opt => opt.id),
        key: "pronouns"
      }
    ]
  },
  {
    id: "title_specialty_classifications",
    title: "Title, Specialty & Classifications",
    fields: [
      {
        label: "Provider Title",
        group: "Title, Specialty & Classifications",
        type: "single-select",
        placeholder: "Select Provider Title",
        required: true,
        options: PROVIDER_TITLE_OPTIONS.map(opt => opt.id),
        key: "title"
      },
      {
        label: "Specialty List",
        group: "Title, Specialty & Classifications",
        type: "single-select",
        placeholder: "Select Specialties",
        required: true,
        options: SPECIALTY_OPTIONS.map(opt => opt.id),
        key: "primary_specialty"
      },
      {
        label: "Taxonomy Codes",
        group: "Title, Specialty & Classifications",
        type: "multi-select",
        placeholder: "Select Taxonomy Code(s)...",
        required: false,
        options: TAXONOMY_CODE_OPTIONS.map(opt => opt.id),
        key: "taxonomy_codes"
      },
      {
        label: "Clinical Services",
        group: "Title, Specialty & Classifications",
        type: "multi-select",
        placeholder: "Select Clinical Service(s)...",
        required: false,
        options: CLINICAL_SERVICES_OPTIONS.map(opt => opt.id),
        key: "clinical_services"
      },
      {
        label: "Marital Status",
        group: "Title, Specialty & Classifications",
        type: "single-select",
        placeholder: "Select Marital Status",
        required: false,
        options: MARITAL_STATUS_OPTIONS.map(opt => opt.id),
        key: "marital_status"
      },
      {
        label: "Telemed Exp.",
        group: "Title, Specialty & Classifications",
        type: "single-select",
        placeholder: "Select Telemed Exp.",
        required: false,
        options: TELEMED_EXP_OPTIONS.map(opt => opt.id),
        key: "telemed_exp"
      },
      {
        label: "Fluent Languages",
        group: "Title, Specialty & Classifications",
        type: "multi-select",
        placeholder: "Select Fluent Language(s)...",
        required: false,
        options: LANGUAGE_OPTIONS.map(opt => opt.id),
        key: "fluent_languages"
      },
      {
        label: "CMS Medicare Specialty Codes",
        group: "Title, Specialty & Classifications",
        type: "multi-select",
        placeholder: "Select Medicare Specialty Code(s)...",
        required: false,
        options: CMS_MEDICARE_SPECIALTY_OPTIONS.map(opt => opt.id),
        key: "cms_medicare_specialty_codes"
      },
      {
        label: "Other Specialties",
        group: "Title, Specialty & Classifications",
        type: "multi-select",
        placeholder: "Select Other Specialties",
        required: false,
        options: OTHER_SPECIALTIES_OPTIONS.map(opt => opt.id),
        key: "other_specialties"
      },
      {
        label: "Classifications",
        group: "Title, Specialty & Classifications",
        type: "multi-select",
        placeholder: "Select Provider Classification(s)...",
        required: false,
        options: CLASSIFICATION_OPTIONS.map(opt => opt.id),
        key: "classifications"
      }
    ]
  },
  {
    id: "contact_info",
    title: "Contact Info",
    fields: [
      {
        label: "Work Email",
        group: "Contact Info",
        type: "text",
        placeholder: "Enter work email",
        required: false,
        key: "work_email"
      },
      {
        label: "Personal Email",
        group: "Contact Info",
        type: "text",
        placeholder: "Enter personal email",
        required: false,
        key: "personal_email"
      },
      {
        label: "Mobile Phone #",
        group: "Contact Info",
        type: "text",
        placeholder: "(___) ___-____",
        required: false,
        key: "mobile_phone_number"
      },
      {
        label: "Mobile Phone Carrier Name",
        group: "Contact Info",
        type: "single-select",
        placeholder: "Select Mobile Phone...",
        required: false,
        options: MOBILE_CARRIER_OPTIONS.map(opt => opt.id),
        key: "mobile_phone_carrier_name"
      }
    ]
  },
  {
    id: "emergency_contact",
    title: "Emergency Contact",
    fields: [
      {
        label: "Emergency Contact Name",
        group: "Emergency Contact",
        type: "text",
        placeholder: "Enter emergency contact name",
        required: false,
        key: "emergency_contact_name"
      },
      {
        label: "Email",
        group: "Emergency Contact",
        type: "text",
        placeholder: "email@example.com",
        required: false,
        key: "emergency_contact_email"
      },
      {
        label: "Mobile Phone #",
        group: "Emergency Contact",
        type: "text",
        placeholder: "(___) ___-____",
        required: false,
        key: "emergency_contact_phone"
      },
      {
        label: "Relationship",
        group: "Emergency Contact",
        type: "single-select",
        placeholder: "Select Relationship",
        required: false,
        options: RELATIONSHIP_OPTIONS.map(opt => opt.id),
        key: "emergency_contact_relationship"
      }
    ]
  },
  {
    id: "identification",
    title: "Identification",
    fields: [
      {
        label: "Social Security #",
        group: "Identification",
        type: "text",
        placeholder: "...",
        required: false,
        key: "social_security_number"
      },
      {
        label: "NPI #",
        group: "Identification",
        type: "text",
        placeholder: "Enter NPI number",
        required: false,
        key: "npi_number"
      },
      {
        label: "Last Updated",
        group: "Identification",
        type: "date",
        placeholder: "MM/DD/YYYY",
        required: false,
        key: "last_updated"
      },
      {
        label: "Driver License or ID #",
        group: "Identification",
        type: "text",
        placeholder: "...",
        required: false,
        key: "driver_license_or_id_number"
      },
      {
        label: "State Issued",
        group: "Identification",
        type: "single-select",
        placeholder: "Select State Issued",
        required: false,
        options: US_STATE_OPTIONS.map(opt => opt.id),
        key: "state_issued"
      },
      {
        label: "Issue Date",
        group: "Identification",
        type: "date",
        placeholder: "MM/DD/YYYY",
        required: false,
        key: "issue_date"
      },
      {
        label: "Expiration Date",
        group: "Identification",
        type: "date",
        placeholder: "MM/DD/YYYY",
        required: false,
        key: "expiration_date"
      }
    ]
  }
];

// Extract field groups for wide modal layout
const providerNameFields = providerInfoWideFieldGroups[0].fields;
const titleSpecialtyFields = providerInfoWideFieldGroups[1].fields;
const contactInfoFields = providerInfoWideFieldGroups[2].fields;
const emergencyContactFields = providerInfoWideFieldGroups[3].fields;
const identificationFields = providerInfoWideFieldGroups[4].fields;

const ProviderInfoDetailsWide = ({ formValues, handleChange }) => (
  <div className="flex flex-col gap-6" data-testid="provider-info-details-wide" role="main">
    {/* Provider Name Section */}
    <CollapsibleSection title="Provider Name">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {providerNameFields.map((field) => (
          <React.Fragment key={field.key}>
            {renderFieldComponent({ field, formValues, handleChange, labelPosition: 'above' })}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>

    {/* Title, Specialty & Classifications Section */}
    <CollapsibleSection title="Title, Specialty & Classifications">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {titleSpecialtyFields.map((field) => (
          <React.Fragment key={field.key}>
            {renderFieldComponent({ field, formValues, handleChange, labelPosition: 'above' })}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>

    {/* Contact Info Section */}
    <CollapsibleSection title="Contact Info">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {contactInfoFields.map((field) => (
          <React.Fragment key={field.key}>
            {renderFieldComponent({ field, formValues, handleChange, labelPosition: 'above' })}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>

    {/* Emergency Contact Section */}
    <CollapsibleSection title="Emergency Contact">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {emergencyContactFields.map((field) => (
          <React.Fragment key={field.key}>
            {renderFieldComponent({ field, formValues, handleChange, labelPosition: 'above' })}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>

    {/* Identification Section */}
    <CollapsibleSection title="Identification">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {identificationFields.map((field) => (
          <React.Fragment key={field.key}>
            {renderFieldComponent({ field, formValues, handleChange, labelPosition: 'above' })}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>
  </div>
);

export const providerInfoWideTemplate = {
  id: 'provider_info_wide',
  name: 'Provider Information (Wide)',
  description: 'Template for displaying provider information details in wide format',
  header: ({ gridKey, row, provider, isCreateMode }: { gridKey: string; row: any; provider?: any; isCreateMode?: boolean }) => generateDefaultHeaderText({ gridKey, provider, isCreateMode }),
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Documents', icon: 'folder', enabled: true },
    { id: 'team', label: 'Team', icon: 'users', enabled: true },
  ],
  fieldGroups: providerInfoWideFieldGroups,
  DetailsComponent: ProviderInfoDetailsWide,
};

export default ProviderInfoDetailsWide;