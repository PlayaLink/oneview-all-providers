import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import SearchCriteriaSection from './SearchCriteriaSection';
import { renderFieldComponent } from './getInputType';
import { extractTitleAcronym, generateProviderName, generateDefaultHeaderText } from '@/lib/utils';
import { 
  STATE_OPTIONS, 
  LICENSE_TYPE_OPTIONS, 
  STATUS_OPTIONS, 
  DONT_RENEW_OPTIONS, 
  IS_PRIMARY_OPTIONS,
  TITLE_OPTIONS,
  PRIMARY_SPECIALTY_OPTIONS,
  TAGS_OPTIONS 
} from './StateControlledSubstanceLicensesSelectInputOptions';

// State Controlled Substance Licenses fieldGroups definition - Following Pattern 3: SearchCriteriaSection
export const stateControlledSubstanceLicenseFieldGroups = [
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
        key: "license_number"
      },
      {
        label: "First Name",
        group: "Search Criteria",
        type: "text",
        placeholder: "Enter first name",
        required: false,
        key: "first_name"
      },
      {
        label: "Last Name",
        group: "Search Criteria",
        type: "text",
        placeholder: "Enter last name",
        required: false,
        key: "last_name"
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
        required: false,
        key: "issue_date"
      },
      {
        label: "Exp. Date",
        group: "Additional Info",
        type: "date",
        placeholder: "Select expiration date",
        required: false,
        key: "expiration_date"
      },
      {
        label: "Expires Within",
        group: "Additional Info",
        type: "text",
        placeholder: "Days until expiration",
        required: false,
        key: "expires_within"
      },
      {
        label: "Don't Renew?",
        group: "Additional Info",
        type: "single-select",
        placeholder: "Select renewal preference",
        required: false,
        options: DONT_RENEW_OPTIONS,
        key: "dont_renew"
      },
      {
        label: "Primary?",
        group: "Additional Info",
        type: "single-select",
        placeholder: "Is this a primary license?",
        required: false,
        options: IS_PRIMARY_OPTIONS,
        key: "is_primary"
      },
      {
        label: "Tags",
        group: "Additional Info",
        type: "multi-select",
        placeholder: "Select tags",
        required: false,
        options: TAGS_OPTIONS,
        key: "tags"
      },
      {
        label: "Last Updated",
        group: "Additional Info",
        type: "date",
        placeholder: "Last update date",
        required: false,
        key: "last_updated"
      }
    ]
  }
];

interface StateControlledSubstanceLicenseDetailsProps {
  record: any;
  formValues: any;
  handleChange: (field: string, value: any) => void;
  provider?: any;
}

const StateControlledSubstanceLicenseDetails: React.FC<StateControlledSubstanceLicenseDetailsProps> = ({
  record,
  formValues,
  handleChange,
  provider
}) => {
  const searchCriteriaFields = stateControlledSubstanceLicenseFieldGroups[0].fields;
  const additionalInfoFields = stateControlledSubstanceLicenseFieldGroups[1].fields;

  return (
    <div 
      className="flex flex-col gap-4 self-stretch"
      role="main"
      aria-label="State Controlled Substance License Details"
      data-testid="state-controlled-substance-license-details"
    >
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
            <div key={field.key} data-testid={`field-${field.key}`}>
              {renderFieldComponent({ field, formValues, handleChange })}
            </div>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default StateControlledSubstanceLicenseDetails;

// Template object for sidepanel context
export const stateControlledSubstanceLicenseTemplate = {
  id: 'state_controlled_substance_licenses',
  name: 'State Controlled Substance Licenses',
  description: 'Template for displaying state controlled substance license details',
  header: ({ gridName, row, provider, isCreateMode }) => generateDefaultHeaderText({ gridName, provider, isCreateMode }),
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Docs', icon: 'folder', enabled: true },
  ],
  fieldGroups: stateControlledSubstanceLicenseFieldGroups,
  DetailsComponent: StateControlledSubstanceLicenseDetails,
};
