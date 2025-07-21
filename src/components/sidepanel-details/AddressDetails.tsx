import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import TextInputField from '../inputs/TextInputField';
import { renderFieldComponent } from './getInputType';

// Address field group definition - Updated to match database schema
export const addressFieldGroup = {
  id: 'address_info_flat',
  title: 'Address Info',
  fields: [
    { label: 'Type', type: 'text', key: 'type', placeholder: 'Enter address type (e.g., Home, Work, Mailing)' },
    { label: 'Address', type: 'text', key: 'address', placeholder: 'Enter street address' },
    { label: 'Address 2', type: 'text', key: 'address_2', placeholder: 'Enter apartment, suite, etc.' },
    { label: 'City', type: 'text', key: 'city', placeholder: 'Enter city' },
    { label: 'State', type: 'text', key: 'state', placeholder: 'Enter state' },
    { label: 'Zip/Postal Code', type: 'text', key: 'zip_postal_code', placeholder: 'Enter zip/postal code' },
    { label: 'County', type: 'text', key: 'county', placeholder: 'Enter county' },
    { label: 'Country', type: 'text', key: 'country', placeholder: 'Enter country' },
    { label: 'Phone Number', type: 'text', key: 'phone_number', placeholder: '(___) ___-____' },
    { label: 'Email', type: 'text', key: 'email', placeholder: 'Enter email address' },
    { label: 'Start Date', type: 'date', key: 'start_date', placeholder: 'MM/DD/YYYY' },
    { label: 'End Date', type: 'date', key: 'end_date', placeholder: 'MM/DD/YYYY' },
    { label: 'Tags', type: 'multi-select', key: 'tags', placeholder: 'Select tags', options: ['primary', 'secondary', 'billing', 'mailing', 'home', 'work', 'active', 'inactive'] },
    { label: 'Last Updated', type: 'date', key: 'last_updated', placeholder: 'MM/DD/YYYY' }
  ],
};

const AddressDetails = ({ formValues, handleChange }) => (
  <div className="flex flex-col gap-4 self-stretch" role="form" aria-label="Address Details" data-testid="address-details-section">
    {addressFieldGroup.fields.map((field) => (
      <React.Fragment key={field.key || field.label}>
        {renderFieldComponent({ field, formValues, handleChange })}
      </React.Fragment>
    ))}
  </div>
);

export default AddressDetails; 