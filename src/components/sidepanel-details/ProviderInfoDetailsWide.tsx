import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../inputs/SingleSelect';
import TextInputField from '../inputs/TextInputField';
import { providerInfoFieldGroups } from './ProviderInfoDetails';

function getFieldProps(fieldKey, formValues, handleChange, type = 'text') {
  let value;
  if (type === 'multi-select') {
    value = Array.isArray(formValues[fieldKey]) ? formValues[fieldKey] : [];
  } else if (type === 'single-select') {
    value = formValues[fieldKey] || null;
  } else {
    value = formValues[fieldKey] || '';
  }
  return {
    value,
    onChange: (val) => handleChange(fieldKey, val),
  };
}

const ProviderInfoDetailsWide = ({ formValues, handleChange }) => (
  <>
    {providerInfoFieldGroups.map((group) => (
      <CollapsibleSection key={group.id} title={group.title}>
        <div className="flex flex-row gap-4 w-full flex-wrap">
          {group.fields.map((field, idx) => {
            // Render 4 fields per row, wrap as needed
            const FieldComponent =
              field.type === 'multi-select' ? MultiSelectInput :
              field.type === 'single-select' ? SingleSelect :
              TextInputField;
            return (
              <div className="flex-1 min-w-[220px]" key={field.key || field.label}>
                <FieldComponent
                  label={field.label}
                  labelPosition="above"
                  options={field.options ? field.options.map(opt => ({ id: opt, label: opt })) : undefined}
                  placeholder={field.placeholder}
                  {...getFieldProps(field.key, formValues, handleChange, field.type)}
                />
              </div>
            );
          })}
        </div>
      </CollapsibleSection>
    ))}
  </>
);

export const providerInfoWideTemplate = {
  id: 'provider_info_wide',
  name: 'Provider Information (Wide)',
  description: 'Template for displaying provider information details in wide format',
  header: ({ gridName, row, provider }) => {
    const name = provider ? [provider.last_name, provider.first_name].filter(Boolean).join(', ') : (row.provider_name || '');
    const title = provider ? provider.title || '' : (row.title || '');
    return `${gridName} for ${name} ${title}`.trim();
  },
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Documents', icon: 'folder', enabled: true },
    { id: 'team', label: 'Team', icon: 'users', enabled: true },
  ],
  DetailsComponent: ProviderInfoDetailsWide,
  fieldGroups: [],
};

export default ProviderInfoDetailsWide; 