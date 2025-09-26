import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import SearchCriteriaSection from './SearchCriteriaSection';
import { renderFieldComponent } from './getInputType';
import { generateProviderName, generateDefaultHeaderText, extractTitleAcronym } from '@/lib/utils';
import { useIsSingleColumn } from '@/hooks/use-is-single-column';
import { STATE_OPTIONS, LICENSE_TYPE_OPTIONS, STATUS_OPTIONS, YES_NO_OPTIONS, TAG_OPTIONS } from './StateLicenseSelectInputOptions';

// State Licenses fieldGroups definition for wide layout
export const stateLicenseWideFieldGroups = [
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

// Define the custom grouping for search criteria fields
const searchCriteriaFields = stateLicenseWideFieldGroups[0].fields;

// Gather the remaining fields for Additional Info
const additionalInfoFields = stateLicenseWideFieldGroups[1].fields;

const StateLicenseDetailsWide = ({ formValues, handleChange, provider }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isSingleColumn = useIsSingleColumn(containerRef);
  const labelPosition = isSingleColumn ? 'left' : 'above';


  return (
    <div ref={containerRef} className="@container flex flex-col gap-7">
      {/* Search Criteria Section */}
      <SearchCriteriaSection
        title="Search Criteria"
        fields={searchCriteriaFields}
        formValues={formValues}
        handleChange={handleChange}
        provider={provider}
        layout="horizontal"
        labelPosition={labelPosition}
      />

      {/* Additional Info Section */}
      <CollapsibleSection title="Additional Info">
        <div className="grid grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4 gap-4 w-full">
          {additionalInfoFields.map((field) => (
            <div key={field.key}>
              {renderFieldComponent({ field, formValues, handleChange, labelPosition })}
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
};

export const stateLicenseWideTemplate = {
  id: 'state_licenses_wide',
  name: 'State Licenses (Wide)',
  description: 'Template for displaying state license details in wide format',
  header: ({ gridKey, row, provider, isCreateMode }: { gridKey: string; row: any; provider?: any; isCreateMode?: boolean }) => generateDefaultHeaderText({ gridKey, provider, isCreateMode }),
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Docs', icon: 'folder', enabled: true },
  ],
  DetailsComponent: StateLicenseDetailsWide,
  fieldGroups: stateLicenseWideFieldGroups,
};

export default StateLicenseDetailsWide; 