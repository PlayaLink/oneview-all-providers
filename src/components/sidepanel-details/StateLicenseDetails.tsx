import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../inputs/SingleSelect';
import TextInputField from '../inputs/TextInputField';
import { getInputType, renderFieldComponent } from './getInputType';
import { extractTitleAcronym, generateProviderName } from '@/lib/utils';

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
        options: [
          "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
          "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
          "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
          "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
          "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
        ],
        key: "state"
      },
      {
        label: "License Type",
        group: "Search Criteria",
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
        options: ["Active", "Expired", "Pending", "Suspended", "Revoked"],
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
        options: ["Yes", "No"],
        placeholder: "Select renewal status",
        key: "dont_renew"
      },
      {
        label: "Primary?",
        group: "Additional Info",
        type: "single-select",
        options: ["Yes", "No"],
        placeholder: "Is this a primary license?",
        key: "is_primary"
      },
      {
        label: "Multi-state?",
        group: "Additional Info",
        type: "single-select",
        options: ["Yes", "No"],
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
        options: ["Yes", "No"],
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
        options: ["Yes", "No"],
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
        options: ["urgent", "expiring", "renewal", "compliance", "audit", "pending", "primary", "secondary"],
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
    {/* Custom Search Criteria Grouping */}
    <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xs font-semibold text-[#008BC9] uppercase tracking-wide">
          Search Criteria
        </h2>
      </div>

      {/* Form Grid */}
      <div className="flex flex-col gap-4">
        {searchCriteriaFields.map((field) => (
          <React.Fragment key={field.key || field.label}>
            {renderFieldComponent({ field, formValues, handleChange })}
          </React.Fragment>
        ))}
        {/* Provider fields */}
        {provider && (
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <TextInputField
                label="First Name"
                labelPosition="left"
                value={provider.first_name || ''}
                onChange={() => {}} // Read-only field
                disabled={true}
                data-testid="provider-first-name"
                aria-label="Provider first name"
              />
            </div>
            <div className="flex-1">
              <TextInputField
                label="Last Name"
                labelPosition="left"
                value={provider.last_name || ''}
                onChange={() => {}} // Read-only field
                disabled={true}
                data-testid="provider-last-name"
                aria-label="Provider last name"
              />
            </div>
          </div>
        )}
      </div>
    </div>
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
  header: ({ gridName, row, provider }) => {
    const name = provider ? generateProviderName(provider) : '';
    const title = provider ? extractTitleAcronym(provider.title || '') : extractTitleAcronym(row.title || '');
    return `${gridName} ${row.license || ''} for ${name} ${title}`.trim();
  },
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Docs', icon: 'folder', enabled: true },
  ],
  fieldGroups: stateLicenseFieldGroups,
  DetailsComponent: StateLicenseDetails,
};

export default StateLicenseDetails; 