import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import SearchCriteriaSection from './SearchCriteriaSection';
import { renderFieldComponent } from './getInputType';
import { extractTitleAcronym, generateProviderName, generateDefaultHeaderText } from '@/lib/utils';
import { 
  STATE_OPTIONS, 
  STATUS_OPTIONS, 
  PAYMENT_INDICATOR_OPTIONS, 
  DONT_RENEW_OPTIONS, 
  DONT_TRANSFER_OPTIONS, 
  YES_NO_OPTIONS, 
  APPROVED_ERX_OPTIONS,
  DEA_LICENSE_TAGS 
} from './DEALicensesSelectInputOptions';

// DEA Licenses fieldGroups definition - Updated to match screenshot layout
export const deaLicenseFieldGroups = [
  {
    id: "search_criteria",
    title: "Search Criteria",
    fields: [
      {
        label: "State",
        group: "Search Criteria",
        type: "single-select",
        placeholder: "Select state",
        required: false,
        options: STATE_OPTIONS,
        key: "state"
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
        required: false,
        options: STATUS_OPTIONS,
        key: "status"
      },
      {
        label: "Payment Indicator",
        group: "Additional Info",
        type: "single-select",
        placeholder: "Select payment indicator",
        required: false,
        options: PAYMENT_INDICATOR_OPTIONS,
        key: "payment_indicator"
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
        options: DONT_RENEW_OPTIONS,
        placeholder: "Select renewal status",
        key: "dont_renew"
      },
      {
        label: "Don't Transfer?",
        group: "Additional Info",
        type: "single-select",
        options: DONT_TRANSFER_OPTIONS,
        placeholder: "Select transfer status",
        key: "dont_transfer"
      },
      {
        label: "Primary?",
        group: "Additional Info",
        type: "single-select",
        options: YES_NO_OPTIONS,
        placeholder: "Is this a primary license?",
        key: "primary_license"
      },
      {
        label: "Approved ERx",
        group: "Additional Info",
        type: "single-select",
        options: APPROVED_ERX_OPTIONS,
        placeholder: "Select Approved ERx",
        key: "approved_erx"
      },
      {
        label: "DEA Schedules",
        group: "Additional Info",
        type: "text",
        placeholder: "Enter DEA schedules",
        key: "dea_schedules"
      }
    ]
  },
  {
    id: "registered_address",
    title: "Registered Address",
    fields: [
      {
        label: "Address",
        group: "Registered Address",
        type: "text",
        placeholder: "Enter address",
        key: "address"
      },
      {
        label: "Address 2",
        group: "Registered Address",
        type: "text",
        placeholder: "Enter address line 2",
        key: "address2"
      },
      {
        label: "City",
        group: "Registered Address",
        type: "text",
        placeholder: "Enter city",
        key: "city"
      },
      {
        label: "State",
        group: "Registered Address",
        type: "single-select",
        placeholder: "Select state",
        options: STATE_OPTIONS,
        key: "address_state"
      },
      {
        label: "Zip/Postal Code",
        group: "Registered Address",
        type: "text",
        placeholder: "Enter ZIP/postal code",
        key: "zip_code"
      }
    ]
  }
];

// 1. Define the custom grouping for search criteria fields
const searchCriteriaFields = deaLicenseFieldGroups[0].fields;

// 2. Gather the remaining fields for Additional Info
const additionalInfoFields = deaLicenseFieldGroups[1].fields;

// 3. Gather the remaining fields for Registered Address
const registeredAddressFields = deaLicenseFieldGroups[2].fields;

const DEALicensesDetails = ({ formValues, handleChange, provider }) => (
  <div className="flex flex-col gap-4" data-testid="dea-licenses-details" role="main">
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

    {/* Registered Address Section */}
    <CollapsibleSection title="Registered Address">
      <div className="flex flex-col gap-4 self-stretch">
        {registeredAddressFields.map((field) => (
          <React.Fragment key={field.key || field.label}>
            {renderFieldComponent({ field, formValues, handleChange })}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>
  </div>
);

// Unified template object for DEA Licenses side panel
export const deaLicensesTemplate = {
  id: 'dea_licenses',
  name: 'DEA Licenses',
  description: 'Template for displaying DEA license details',
  header: ({ gridKey, row, provider, isCreateMode }: { gridKey: string; row: any; provider?: any; isCreateMode?: boolean }) => generateDefaultHeaderText({ gridKey, provider, isCreateMode }),
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Docs', icon: 'folder', enabled: true },
  ],
  fieldGroups: deaLicenseFieldGroups,
  DetailsComponent: DEALicensesDetails,
};

export default DEALicensesDetails;



