import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../inputs/SingleSelect';
import TextInputField from '../inputs/TextInputField';
import { generateProviderName, generateDefaultHeaderText } from '@/lib/utils';
import { providerInfoFieldGroups } from './ProviderInfoDetails';
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

// Helper to get value and onChange for a field
function getFieldProps(fieldKey, formValues, handleChange) {
  return {
    value: formValues[fieldKey] || '',
    onChange: (val) => handleChange(fieldKey, val),
  };
}

const ProviderInfoDetailsWide = ({ formValues, handleChange }) => (
  <>
    {/* Provider Name Section */}
    <CollapsibleSection title="Provider Name">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <SingleSelect label="Prefix" labelPosition="above" options={PREFIX_OPTIONS} {...getFieldProps('prefix', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="First Name" labelPosition="above" {...getFieldProps('first_name', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Middle Name" labelPosition="above" {...getFieldProps('middle_name', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Last Name" labelPosition="above" {...getFieldProps('last_name', formValues, handleChange)} />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <SingleSelect label="Suffix" labelPosition="above" options={SUFFIX_OPTIONS} {...getFieldProps('suffix', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="Pronouns" labelPosition="above" options={PRONOUN_OPTIONS} {...getFieldProps('pronouns', formValues, handleChange)} />
        </div>
        <div className="flex-1" />
        <div className="flex-1" />
      </div>
    </CollapsibleSection>

    {/* Type, Specialty & Classifications Section */}
    <CollapsibleSection title="Title, Specialty & Classifications">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <SingleSelect label="Provider Title" labelPosition="above" options={PROVIDER_TITLE_OPTIONS} {...getFieldProps('title', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="Specialty List" labelPosition="above" options={SPECIALTY_OPTIONS} {...getFieldProps('primary_specialty', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <MultiSelectInput label="Taxonomy Codes" labelPosition="above" options={TAXONOMY_CODE_OPTIONS} {...getFieldProps('taxonomy_codes', formValues, handleChange)} />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <MultiSelectInput label="Clinical Services" labelPosition="above" options={CLINICAL_SERVICES_OPTIONS} {...getFieldProps('clinical_services', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="Marital Status" labelPosition="above" options={MARITAL_STATUS_OPTIONS} {...getFieldProps('marital_status', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="Telemed Exp." labelPosition="above" options={TELEMED_EXP_OPTIONS} {...getFieldProps('telemed_exp', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <MultiSelectInput label="Fluent Languages" labelPosition="above" options={LANGUAGE_OPTIONS} {...getFieldProps('fluent_languages', formValues, handleChange)} />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <MultiSelectInput label="CMS Medicare Specialty Codes" labelPosition="above" options={CMS_MEDICARE_SPECIALTY_OPTIONS} {...getFieldProps('cms_medicare_specialty_codes', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <MultiSelectInput label="Other Specialties" labelPosition="above" options={OTHER_SPECIALTIES_OPTIONS} {...getFieldProps('other_specialties', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <MultiSelectInput label="Classifications" labelPosition="above" options={CLASSIFICATION_OPTIONS} {...getFieldProps('classifications', formValues, handleChange)} />
        </div>
        <div className="flex-1" />
      </div>
    </CollapsibleSection>

    {/* Contact Info Section */}
    <CollapsibleSection title="Contact Info">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <TextInputField label="Work Email" labelPosition="above" {...getFieldProps('work_email', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Personal Email" labelPosition="above" {...getFieldProps('personal_email', formValues, handleChange)} />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <TextInputField label="Mobile Phone #" labelPosition="above" {...getFieldProps('mobile_phone_number', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="Mobile Phone Carrier Name" labelPosition="above" options={MOBILE_CARRIER_OPTIONS} {...getFieldProps('mobile_phone_carrier_name', formValues, handleChange)} />
        </div>
      </div>
    </CollapsibleSection>

    {/* Emergency Contact Section */}
    <CollapsibleSection title="Emergency Contact">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <TextInputField label="Emergency Contact Name" labelPosition="above" {...getFieldProps('emergency_contact_name', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Email" labelPosition="above" {...getFieldProps('emergency_contact_email', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Mobile Phone #" labelPosition="above" {...getFieldProps('emergency_contact_phone', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="Relationship" labelPosition="above" options={RELATIONSHIP_OPTIONS} {...getFieldProps('emergency_contact_relationship', formValues, handleChange)} />
        </div>
      </div>
    </CollapsibleSection>

    {/* Identification Section */}
    <CollapsibleSection title="Identification">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <TextInputField label="Social Security #" labelPosition="above" {...getFieldProps('social_security_number', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="NPI #" labelPosition="above" {...getFieldProps('npi_number', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Last Updated" labelPosition="above" {...getFieldProps('last_updated', formValues, handleChange)} />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <TextInputField label="Driver License or ID #" labelPosition="above" {...getFieldProps('driver_license_or_id_number', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="State Issued" labelPosition="above" options={US_STATE_OPTIONS} {...getFieldProps('state_issued', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Issue Date" labelPosition="above" {...getFieldProps('issue_date', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Expiration Date" labelPosition="above" {...getFieldProps('expiration_date', formValues, handleChange)} />
        </div>
      </div>
    </CollapsibleSection>
  </>
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
  DetailsComponent: ProviderInfoDetailsWide,
  fieldGroups: providerInfoFieldGroups,
};

export default ProviderInfoDetailsWide; 