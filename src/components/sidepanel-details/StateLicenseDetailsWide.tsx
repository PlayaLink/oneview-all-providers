import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../inputs/SingleSelect';
import TextInputField from '../inputs/TextInputField';
import { generateProviderName, generateDefaultHeaderText, extractTitleAcronym } from '@/lib/utils';

// Helper to get value and onChange for a field
function getFieldProps(fieldKey, formValues, handleChange) {
  return {
    value: formValues[fieldKey] || '',
    onChange: (val) => handleChange(fieldKey, val),
  };
}

const StateLicenseDetailsWide = ({ formValues, handleChange }) => (
  <>
    {/* Search Criteria Section */}
    <CollapsibleSection title="Search Criteria">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <SingleSelect 
            label="State" 
            labelPosition="above" 
            options={[
              "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
              "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
              "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
              "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
              "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
            ].map(opt => ({ id: opt, label: opt }))} 
            {...getFieldProps('state', formValues, handleChange)} 
          />
        </div>
        <div className="flex-1">
          <SingleSelect 
            label="License Type" 
            labelPosition="above" 
            options={[
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
            ].map(opt => ({ id: opt, label: opt }))} 
            {...getFieldProps('license_type', formValues, handleChange)} 
          />
        </div>
        <div className="flex-1">
          <TextInputField 
            label="License" 
            labelPosition="above" 
            {...getFieldProps('license', formValues, handleChange)} 
          />
        </div>
      </div>
    </CollapsibleSection>

    {/* Additional Info Section */}
    <CollapsibleSection title="Additional Info">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <SingleSelect 
            label="Status" 
            labelPosition="above" 
            options={["Active", "Expired", "Pending", "Suspended", "Revoked"].map(opt => ({ id: opt, label: opt }))} 
            {...getFieldProps('status', formValues, handleChange)} 
          />
        </div>
        <div className="flex-1">
          <TextInputField 
            label="Issue Date" 
            labelPosition="above" 
            {...getFieldProps('issue_date', formValues, handleChange)} 
          />
        </div>
        <div className="flex-1">
          <TextInputField 
            label="Exp. Date" 
            labelPosition="above" 
            {...getFieldProps('expiration_date', formValues, handleChange)} 
          />
        </div>
        <div className="flex-1">
          <SingleSelect 
            label="Don't Renew?" 
            labelPosition="above" 
            options={["Yes", "No"].map(opt => ({ id: opt, label: opt }))} 
            {...getFieldProps('dont_renew', formValues, handleChange)} 
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <SingleSelect 
            label="Primary?" 
            labelPosition="above" 
            options={["Yes", "No"].map(opt => ({ id: opt, label: opt }))} 
            {...getFieldProps('is_primary', formValues, handleChange)} 
          />
        </div>
        <div className="flex-1">
          <SingleSelect 
            label="Multi-state?" 
            labelPosition="above" 
            options={["Yes", "No"].map(opt => ({ id: opt, label: opt }))} 
            {...getFieldProps('is_multistate', formValues, handleChange)} 
          />
        </div>
        <div className="flex-1">
          <TextInputField 
            label="Taxonomy Code" 
            labelPosition="above" 
            {...getFieldProps('taxonomy_code', formValues, handleChange)} 
          />
        </div>
        <div className="flex-1">
          <SingleSelect 
            label="Enrolled in PDMP?" 
            labelPosition="above" 
            options={["Yes", "No"].map(opt => ({ id: opt, label: opt }))} 
            {...getFieldProps('enrolled_in_pdmp', formValues, handleChange)} 
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <TextInputField 
            label="Fee Exemption" 
            labelPosition="above" 
            {...getFieldProps('fee_exemption', formValues, handleChange)} 
          />
        </div>
        <div className="flex-1">
          <SingleSelect 
            label="Additional Info" 
            labelPosition="above" 
            options={["Yes", "No"].map(opt => ({ id: opt, label: opt }))} 
            {...getFieldProps('license_additional_info', formValues, handleChange)} 
          />
        </div>
        <div className="flex-1">
          <TextInputField 
            label="Expires Within" 
            labelPosition="above" 
            {...getFieldProps('expires_within', formValues, handleChange)} 
          />
        </div>
        <div className="flex-1">
          <MultiSelectInput 
            label="Tags" 
            labelPosition="above" 
            options={["urgent", "expiring", "renewal", "compliance", "audit", "pending", "primary", "secondary"].map(opt => ({ id: opt, label: opt }))} 
            {...getFieldProps('tags', formValues, handleChange)} 
          />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <TextInputField 
            label="Last Updated" 
            labelPosition="above" 
            {...getFieldProps('last_updated', formValues, handleChange)} 
          />
        </div>
        <div className="flex-1" />
        <div className="flex-1" />
        <div className="flex-1" />
      </div>
    </CollapsibleSection>
  </>
);

export const stateLicenseWideTemplate = {
  id: 'state_licenses_wide',
  name: 'State Licenses (Wide)',
  description: 'Template for displaying state license details in wide format',
  header: ({ gridName, row, provider }) => generateDefaultHeaderText({ gridName, provider }),
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Docs', icon: 'folder', enabled: true },
  ],
  DetailsComponent: StateLicenseDetailsWide,
  fieldGroups: [],
};

export default StateLicenseDetailsWide; 