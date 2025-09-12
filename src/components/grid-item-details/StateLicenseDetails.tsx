import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import SearchCriteriaSection from './SearchCriteriaSection';
import { renderFieldComponent } from './getInputType';
import { extractTitleAcronym, generateProviderName, generateDefaultHeaderText } from '@/lib/utils';
import { STATE_OPTIONS, LICENSE_TYPE_OPTIONS, STATUS_OPTIONS, YES_NO_OPTIONS, TAG_OPTIONS } from './StateLicenseSelectInputOptions';

// State Licenses fieldGroups definition - Updated to match screenshot layout
export const stateLicenseFieldGroups = [
  {
    id: "search_criteria",
    title: "Search Criteria",
    fields: [
      {
        label: "State",
        group: "Search Criteria",
        type: "single-select",
        placeholder: "Select state",
        required: true,
        options: STATE_OPTIONS,
        key: "state"
      },
      {
        label: "License Type",
        group: "Search Criteria",
        type: "single-select",
        placeholder: "Select license type",
        required: true,
        options: LICENSE_TYPE_OPTIONS,
        key: "license_type"
      },
      {
        label: "License",
        group: "Search Criteria",
        type: "text",
        placeholder: "Enter license number",
        required: true,
        key: "license"
      }
    ]
  },
  {
    id: "additional_info",
    title: "Additional Info",
    fields: [
      {
        label: "Status",
        group: "Additional Info",
        type: "single-select",
        placeholder: "Select status",
        required: true,
        options: STATUS_OPTIONS,
        key: "status"
      },
      {
        label: "Issue Date",
        group: "Additional Info",
        type: "date",
        placeholder: "Select issue date",
        key: "issue_date"
      },
      {
        label: "Exp. Date",
        group: "Additional Info",
        type: "date",
        placeholder: "Select expiration date",
        key: "expiration_date"
      },
      {
        label: "Don't Renew?",
        group: "Additional Info",
        type: "single-select",
        options: YES_NO_OPTIONS,
        placeholder: "Select renewal status",
        key: "dont_renew"
      },
      {
        label: "Primary?",
        group: "Additional Info",
        type: "single-select",
        options: YES_NO_OPTIONS,
        placeholder: "Is this a primary license?",
        key: "is_primary"
      },
      {
        label: "Multi-state?",
        group: "Additional Info",
        type: "single-select",
        options: YES_NO_OPTIONS,
        placeholder: "Is this a multistate license?",
        key: "is_multistate"
      },
      {
        label: "Taxonomy Code",
        group: "Additional Info",
        type: "text",
        placeholder: "Enter taxonomy code",
        key: "taxonomy_code"
      },
      {
        label: "Enrolled in PDMP?",
        group: "Additional Info",
        type: "single-select",
        options: YES_NO_OPTIONS,
        placeholder: "Enrolled in Prescription Drug Monitoring Program?",
        key: "enrolled_in_pdmp"
      },
      {
        label: "Fee Exemption",
        group: "Additional Info",
        type: "text",
        placeholder: "Enter fee exemption details",
        key: "fee_exemption"
      },
      {
        label: "Additional Info",
        group: "Additional Info",
        type: "single-select",
        options: YES_NO_OPTIONS,
        placeholder: "Anything else?",
        key: "license_additional_info"
      },
      {
        label: "Expires Within",
        group: "Additional Info",
        type: "text",
        placeholder: "Days until expiration",
        key: "expires_within"
      },
      {
        label: "Tags",
        group: "Additional Info",
        type: "multi-select",
        placeholder: "Select tags",
        options: TAG_OPTIONS,
        key: "tags"
      },
      {
        label: "Last Updated",
        group: "Additional Info",
        type: "date",
        placeholder: "Last updated date",
        key: "last_updated"
      }
    ]
  }
];

// 1. Define the custom grouping for search criteria fields
const searchCriteriaFields = stateLicenseFieldGroups[0].fields;

// 2. Gather the remaining fields for Additional Info
const additionalInfoFields = stateLicenseFieldGroups[1].fields;

const StateLicenseDetails = ({ formValues, handleChange, provider }) => (
  <div className="flex flex-col gap-4">
    {/* Search Criteria Section */}
    <SearchCriteriaSection
      title="Search Criteria"
      fields={searchCriteriaFields}
      formValues={formValues}
      handleChange={handleChange}
      provider={provider}
    />
    
    {/* Additional Info Section */}
    <CollapsibleSection title="Additional Info">
      <div className="flex flex-col gap-4 self-stretch">
        {additionalInfoFields.map((field) => (
          <React.Fragment key={field.key || field.label}>
            {renderFieldComponent({ field, formValues, handleChange })}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>
  </div>
);

// Unified template object for State Licenses side panel
export const stateLicenseTemplate = {
  id: 'state_licenses',
  name: 'State Licenses',
  description: 'Template for displaying state license details',
  header: ({ gridKey, row, provider, isCreateMode }: { gridKey: string; row: any; provider?: any; isCreateMode?: boolean }) => generateDefaultHeaderText({ gridKey, provider, isCreateMode }),
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Docs', icon: 'folder', enabled: true },
  ],
  fieldGroups: stateLicenseFieldGroups,
  DetailsComponent: StateLicenseDetails,
};

export default StateLicenseDetails; 