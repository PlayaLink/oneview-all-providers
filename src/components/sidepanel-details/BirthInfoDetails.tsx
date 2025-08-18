import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../inputs/SingleSelect';
import TextInputField from '../inputs/TextInputField';
import { getInputType, renderFieldComponent } from './getInputType';
import { extractTitleAcronym, generateProviderName, generateDefaultHeaderText } from '@/lib/utils';

// Birth Info field group definition - Updated to match database schema
export const birthInfoFieldGroup = {
  id: 'birth_info_flat',
  title: 'Birth Info',
  fields: [
    { label: 'Date of Birth', type: 'date', key: 'date_of_birth', placeholder: 'MM/DD/YYYY' },
    { label: 'Country of Citizenship', type: 'text', key: 'country_of_citizenship', placeholder: 'Enter country of citizenship' },
    { label: 'Citizenship/Work Auth', type: 'text', key: 'citizenship_work_auth', placeholder: 'Enter citizenship/work authorization' },
    { label: 'US Work Auth', type: 'text', key: 'us_work_auth', placeholder: 'Enter US work authorization' },
    { label: 'Birth City', type: 'text', key: 'birth_city', placeholder: 'Enter birth city' },
    { label: 'Birth State/Province', type: 'text', key: 'birth_state_province', placeholder: 'Enter birth state/province' },
    { label: 'Birth County', type: 'text', key: 'birth_county', placeholder: 'Enter birth county' },
    { label: 'Birth Country', type: 'text', key: 'birth_country', placeholder: 'Enter birth country' },
    { label: 'Gender', type: 'single-select', options: ['Male', 'Female', 'Non-binary', 'Other'], key: 'gender', placeholder: 'Select gender' },
    { label: 'Identifies as transgender?', type: 'single-select', options: ['Yes', 'No'], key: 'identifies_transgender', placeholder: 'Select transgender identification' },
    { label: 'Hair Color', type: 'single-select', options: ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'Other'], key: 'hair_color', placeholder: 'Select hair color' },
    { label: 'Eye Color', type: 'single-select', options: ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Other'], key: 'eye_color', placeholder: 'Select eye color' },
    { label: 'Height (ft)', type: 'text', key: 'height_ft', placeholder: 'Enter height in feet' },
    { label: 'Height (in)', type: 'text', key: 'height_in', placeholder: 'Enter height in inches' },
    { label: 'Weight (lbs)', type: 'text', key: 'weight_lbs', placeholder: 'Enter weight in pounds' },
    { label: 'Ethnicity', type: 'single-select', options: ['Hispanic', 'Non-Hispanic', 'Asian', 'Black', 'White', 'Native American', 'Other'], key: 'ethnicity', placeholder: 'Select ethnicity' },
    { label: 'Tags', type: 'multi-select', key: 'tags', placeholder: 'Select tags', options: ['urgent', 'new', 'active', 'inactive', 'pending', 'verified'] },
    { label: 'Last Updated', type: 'date', key: 'last_updated', placeholder: 'MM/DD/YYYY' }
  ],
};

const BirthInfoDetails = ({ formValues, handleChange }) => (
  <div className="flex flex-col gap-4 self-stretch">
      {birthInfoFieldGroup.fields.map((field) => (
        <React.Fragment key={field.key || field.label}>
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
  header: ({ gridName, provider, isCreateMode }) => generateDefaultHeaderText({ gridName, provider, isCreateMode }),
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Documents', icon: 'folder', enabled: true },
  ],
  fieldGroups: [birthInfoFieldGroup],
  DetailsComponent: BirthInfoDetails,
};

export default BirthInfoDetails; 