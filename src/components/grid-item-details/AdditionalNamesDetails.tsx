import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../inputs/SingleSelect';
import TextInputField from '../inputs/TextInputField';
import { getInputType, renderFieldComponent } from './getInputType';
import { extractTitleAcronym, generateProviderName, generateDefaultHeaderText } from '@/lib/utils';
import { TYPE_OPTIONS, TITLE_OPTIONS, TAG_OPTIONS } from './AdditionalNamesSelectInputOptions';

// Additional Names field group definition - Pattern 2: Simple Field List
export const additionalNamesFieldGroup = {
  id: 'additional_names_flat',
  title: 'Additional Names',
  fields: [
    { label: 'Type', type: 'single-select', options: TYPE_OPTIONS.map(opt => opt.value), key: 'type', placeholder: 'Select type', required: true },
    { label: 'First Name', type: 'text', key: 'first_name', placeholder: 'Enter first name', required: true },
    { label: 'Middle Name', type: 'text', key: 'middle_name', placeholder: 'Enter middle name' },
    { label: 'Last Name', type: 'text', key: 'last_name', placeholder: 'Enter last name', required: true },
    { label: 'Title', type: 'single-select', options: TITLE_OPTIONS.map(opt => opt.value), key: 'title', placeholder: 'Select title' },
    { label: 'Start Date', type: 'date', key: 'start_date', placeholder: 'MM/DD/YYYY' },
    { label: 'End Date', type: 'date', key: 'end_date', placeholder: 'MM/DD/YYYY' },
    { label: 'Tags', type: 'multi-select', options: TAG_OPTIONS.map(opt => opt.value), key: 'tags', placeholder: 'Select tags' },
    { label: 'Last Updated', type: 'date', key: 'last_updated', placeholder: 'MM/DD/YYYY' }
  ],
};

const AdditionalNamesDetails = ({ formValues, handleChange }) => (
  <div 
    className="flex flex-col gap-4 self-stretch"
    role="main"
    aria-label="Additional Names Details"
    data-testid="additional-names-details"
  >
    {additionalNamesFieldGroup.fields.map((field) => (
      <React.Fragment key={field.key || field.label}>
        {renderFieldComponent({ field, formValues, handleChange })}
      </React.Fragment>
    ))}
  </div>
);

// Unified template object for Additional Names side panel
export const additionalNamesTemplate = {
  id: 'additional_names',
  name: 'Additional Names',
  description: 'Template for displaying provider additional names',
  header: ({ gridName, provider, isCreateMode }) => generateDefaultHeaderText({ gridName, provider, isCreateMode }),
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Docs', icon: 'folder', enabled: true },
  ],
  fieldGroups: [additionalNamesFieldGroup],
  DetailsComponent: AdditionalNamesDetails,
  validation: {
    required: ['type', 'first_name', 'last_name'],
    rules: {
      first_name: { minLength: 1, message: 'First name is required' },
      last_name: { minLength: 1, message: 'Last name is required' },
      type: { required: true, message: 'Type is required' }
    }
  }
};

export default AdditionalNamesDetails;
