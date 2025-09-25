import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { renderFieldComponent } from './getInputType';
import { generateProviderName, generateDefaultHeaderText } from '@/lib/utils';
import { providerInfoFieldGroups } from './ProviderInfoDetails';

// Extract field groups for wide modal layout
const providerNameFields = providerInfoFieldGroups[0].fields;
const titleSpecialtyFields = providerInfoFieldGroups[1].fields;
const contactInfoFields = providerInfoFieldGroups[2].fields;
const emergencyContactFields = providerInfoFieldGroups[3].fields;
const identificationFields = providerInfoFieldGroups[4].fields;

const ProviderInfoDetailsWide = ({ formValues, handleChange }) => (
  <div className="flex flex-col gap-6" data-testid="provider-info-details-wide" role="main">
    {/* Provider Name Section */}
    <CollapsibleSection title="Provider Name">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {providerNameFields.map((field) => (
          <React.Fragment key={field.key}>
            {renderFieldComponent({ field, formValues, handleChange, labelPosition: 'above' })}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>

    {/* Title, Specialty & Classifications Section */}
    <CollapsibleSection title="Title, Specialty & Classifications">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {titleSpecialtyFields.map((field) => (
          <React.Fragment key={field.key}>
            {renderFieldComponent({ field, formValues, handleChange, labelPosition: 'above' })}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>

    {/* Contact Info Section */}
    <CollapsibleSection title="Contact Info">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {contactInfoFields.map((field) => (
          <React.Fragment key={field.key}>
            {renderFieldComponent({ field, formValues, handleChange, labelPosition: 'above' })}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>

    {/* Emergency Contact Section */}
    <CollapsibleSection title="Emergency Contact">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {emergencyContactFields.map((field) => (
          <React.Fragment key={field.key}>
            {renderFieldComponent({ field, formValues, handleChange, labelPosition: 'above' })}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>

    {/* Identification Section */}
    <CollapsibleSection title="Identification">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {identificationFields.map((field) => (
          <React.Fragment key={field.key}>
            {renderFieldComponent({ field, formValues, handleChange, labelPosition: 'above' })}
          </React.Fragment>
        ))}
      </div>
    </CollapsibleSection>
  </div>
);

export const providerInfoWideTemplate = {
  id: 'provider_info_wide',
  name: 'Provider Information (Wide)',
  description: 'Template for displaying provider information details in wide format',
  header: ({ gridKey, row, provider, isCreateMode }: { gridKey: string; row: any; provider?: any; isCreateMode?: boolean }) => generateDefaultHeaderText({ gridKey, provider, isCreateMode }),
  tabs: [
    { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'file-medical', enabled: true },
    { id: 'documents', label: 'Documents', icon: 'folder', enabled: true },
    { id: 'team', label: 'Team', icon: 'users', enabled: true },
  ],
  DetailsComponent: ProviderInfoDetailsWide,
  fieldGroups: providerInfoFieldGroups,
};

export default ProviderInfoDetailsWide;