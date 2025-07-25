import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../inputs/SingleSelect';
import TextInputField from '../inputs/TextInputField';
import { getInputType, renderFieldComponent } from './getInputType';

// State Licenses fieldGroups definition - Updated to match database schema
export const stateLicenseFieldGroups = [
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
        key: "license_type"
      },
      {
        label: "License Number",
        group: "License Details",
        type: "text",
        placeholder: "Enter license number",
        required: true,
        key: "license"
      },
      {
        label: "Additional Info",
        group: "License Details",
        type: "single-select",
        options: ["Yes", "No"],
        placeholder: "Anything else?",
        key: "license_additional_info"
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
        key: "state"
      },
      {
        label: "Status",
        group: "License Details",
        type: "single-select",
        placeholder: "Select status",
        required: true,
        options: ["Active", "Expired", "Pending", "Suspended", "Revoked"],
        key: "status"
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
        key: "issue_date"
      },
      {
        label: "Expiration Date",
        group: "Important Dates",
        type: "date",
        placeholder: "Select expiration date",
        key: "expiration_date"
      },
      {
        label: "Expires Within",
        group: "Important Dates",
        type: "text",
        placeholder: "Days until expiration",
        key: "expires_within"
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
        key: "tags"
      },
      {
        label: "Last Updated",
        group: "Metadata",
        type: "date",
        placeholder: "Last updated date",
        key: "last_updated"
      }
    ]
  }
];

// 1. Define the custom grouping for search criteria fields
const searchCriteriaFields = [
  stateLicenseFieldGroups[0].fields.find(f => f.key === 'state'),
  stateLicenseFieldGroups[0].fields.find(f => f.key === 'license_type'),
  stateLicenseFieldGroups[0].fields.find(f => f.key === 'license'),
].filter(Boolean);

// 2. Gather the remaining fields for General Info
const generalInfoFields = [
  ...stateLicenseFieldGroups[0].fields.filter(f => !['state', 'license_type', 'license'].includes(f.key)),
  ...stateLicenseFieldGroups[1].fields,
  ...stateLicenseFieldGroups[2].fields,
];

const StateLicenseDetails = ({ formValues, handleChange }) => (
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
      </div>
      </div>
    {/* General Info Section */}
    <CollapsibleSection title="General Info">
      <div className="flex flex-col gap-4 self-stretch">
        {generalInfoFields.map((field) => (
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
    const name = provider ? [provider.last_name, provider.first_name].filter(Boolean).join(', ') : (row.provider_name || '');
    const title = provider ? provider.title || '' : (row.title || '');
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