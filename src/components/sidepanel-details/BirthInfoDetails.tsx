import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../inputs/SingleSelect';
import TextInputField from '../inputs/TextInputField';
import { getInputType, renderFieldComponent } from './getInputType';

// Birth Info field group definition (from templateConfigs)
export const birthInfoFieldGroup = {
  id: 'birth_info_flat',
  title: 'Birth Info',
  fields: [
    { label: 'Date of Birth', type: 'text', rowKey: 'date_of_birth', group: 'Birth Info' },
    { label: 'Country of Citizenship', type: 'text', rowKey: 'country_of_citizenship', group: 'Birth Info' },
    { label: 'Citizenship/Work Auth', type: 'text', rowKey: 'citizenship_work_auth', group: 'Birth Info' },
    { label: 'US Work Auth', type: 'text', rowKey: 'us_work_auth', group: 'Birth Info' },
    { label: 'Birth City', type: 'text', rowKey: 'birth_city', group: 'Birth Info' },
    { label: 'Birth State/Province', type: 'text', rowKey: 'birth_state_province', group: 'Birth Info' },
    { label: 'Birth County', type: 'text', rowKey: 'birth_county', group: 'Birth Info' },
    { label: 'Birth Country', type: 'text', rowKey: 'birth_country', group: 'Birth Info' },
    { label: 'Gender', type: 'single-select', options: ['Male', 'Female', 'Non-binary', 'Other'], rowKey: 'gender', group: 'Birth Info' },
    { label: 'Identifies as transgender?', type: 'single-select', options: ['Yes', 'No'], rowKey: 'identifies_transgender', group: 'Birth Info' },
    { label: 'Hair Color', type: 'single-select', options: ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'Other'], rowKey: 'hair_color', group: 'Birth Info' },
    { label: 'Eye Color', type: 'single-select', options: ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Other'], rowKey: 'eye_color', group: 'Birth Info' },
    { label: 'Height (ft)', type: 'text', rowKey: 'height_ft', group: 'Birth Info' },
    { label: 'Height (in)', type: 'text', rowKey: 'height_in', group: 'Birth Info' },
    { label: 'Weight (lbs)', type: 'text', rowKey: 'weight_lbs', group: 'Birth Info' },
    { label: 'Ethnicity', type: 'single-select', options: ['Hispanic', 'Non-Hispanic', 'Asian', 'Black', 'White', 'Native American', 'Other'], rowKey: 'ethnicity', group: 'Birth Info' },
    { label: 'Tags', type: 'multi-select', rowKey: 'tags', group: 'Birth Info' },
  ],
};

const BirthInfoDetails = ({ formValues, handleChange }) => (
  <div className="flex flex-col gap-4 self-stretch">
      {birthInfoFieldGroup.fields.map((field) => (
        <React.Fragment key={field.rowKey || field.label}>
          {renderFieldComponent({ field, formValues, handleChange })}
        </React.Fragment>
      ))}
    </div>
);

// Unified template object for Birth Info side panel
export const birthInfoTemplate = {
  id: 'birth_info',
  name: 'Birth Info',
  description: 'Template for displaying provider birth information',
  header: ({ gridName, row, provider }) => {
    // For Birth Info, just use the provider name if available, else fallback to row
    const name = provider ? `${provider.first_name || ''} ${provider.last_name || ''}`.trim() : (row.provider_name || '');
    const title = provider ? provider.title || '' : (row.title || '');
    return `${gridName} for ${name} ${title}`.trim();
  },
  tabs: [
    'details', // local tab, metadata defined here if needed
    'notes',   // shared tab, metadata from tabsRegistry
    'documents', // shared tab, metadata from tabsRegistry
  ],
  fieldGroups: [birthInfoFieldGroup],
  DetailsComponent: BirthInfoDetails,
};

export default BirthInfoDetails; 