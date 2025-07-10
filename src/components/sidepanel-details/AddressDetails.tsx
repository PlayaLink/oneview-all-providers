import React from 'react';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import TextInputField from '../inputs/TextInputField';
import { renderFieldComponent } from './getInputType';

// Address field group definition
export const addressFieldGroup = {
  id: 'address_info_flat',
  title: 'Address Info',
  fields: [
    { label: 'Type', type: 'text', rowKey: 'type' },
    { label: 'Address', type: 'text', rowKey: 'address' },
    { label: 'Address 2', type: 'text', rowKey: 'address_2' },
    { label: 'City', type: 'text', rowKey: 'city' },
    { label: 'State', type: 'text', rowKey: 'state' },
    { label: 'Zip/Postal Code', type: 'text', rowKey: 'zip_postal_code' },
    { label: 'Tags', type: 'multi-select', rowKey: 'tags' },
  ],
};

const AddressDetails = ({ formValues, handleChange }) => (
  <div className="flex flex-col gap-4 self-stretch" role="form" aria-label="Address Details" data-testid="address-details-section">
    {addressFieldGroup.fields.map((field) => (
      <React.Fragment key={field.rowKey || field.label}>
        {renderFieldComponent({ field, formValues, handleChange })}
      </React.Fragment>
    ))}
  </div>
);

export default AddressDetails; 