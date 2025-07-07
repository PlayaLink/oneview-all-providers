import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../SingleSelect';
import TextInputField from '../inputs/TextInputField';

// State Licenses fieldGroups definition
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
];

function getInputType(field) {
  if (Array.isArray(field.options) && field.options.length > 0) {
    return field.multi ? 'multi-select' : 'single-select';
  }
  return 'text';
}

const StateLicenseDetails = ({ formValues, handleChange }) => (
  <>
    {stateLicenseFieldGroups.map((group) => (
      <CollapsibleSection key={group.id} title={group.title}>
        <div className="flex flex-col gap-4 self-stretch">
          {group.fields.map((field) => {
            const inputType = getInputType(field);
            if (inputType === 'multi-select') {
              return (
                <MultiSelectInput
                  key={field.label}
                  label={field.label}
                  labelPosition="left"
                  value={formValues[field.label] || []}
                  options={field.options?.map((opt) => ({ id: opt, label: opt })) || []}
                  onChange={(val) => handleChange(field.label, Array.isArray(val) ? val.map((v) => v.id) : [])}
                  placeholder={field.placeholder}
                  className="flex-1 min-w-0"
                />
              );
            } else if (inputType === 'single-select') {
              const options = field.options?.map((opt) => ({ id: opt, label: opt })) || [];
              const selectedValue = options.find((opt) => opt.id === formValues[field.label]) || null;
              return (
                <SingleSelect
                  key={field.label}
                  label={field.label}
                  labelPosition="left"
                  value={selectedValue}
                  options={options}
                  onChange={(val) => handleChange(field.label, val?.id ?? val)}
                  placeholder={field.placeholder}
                  className="flex-1 min-w-0"
                />
              );
            } else {
              return (
                <TextInputField
                  key={field.label}
                  label={field.label}
                  labelPosition="left"
                  value={formValues[field.label] || ''}
                  onChange={(val) => handleChange(field.label, val)}
                  placeholder={field.placeholder}
                  className="flex-1 min-w-0"
                />
              );
            }
          })}
        </div>
      </CollapsibleSection>
    ))}
  </>
);

export default StateLicenseDetails; 