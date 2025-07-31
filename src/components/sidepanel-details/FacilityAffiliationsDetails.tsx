import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { getInputType, renderFieldComponent } from './getInputType';
import { generateProviderName, generateDefaultHeaderText } from '@/lib/utils';

// Field groups for Facility Affiliations - Updated to match database schema
export const facilityAffiliationsFieldGroups = [
  {
    id: 'facility_info',
    title: 'Facility Info',
    fields: [
      { label: 'Facility ID', group: 'Facility Info', type: 'text', key: 'facility_id', placeholder: 'Enter facility ID', required: true },
      { label: 'Staff Category', group: 'Facility Info', type: 'single-select', key: 'staff_category', placeholder: 'Select staff category', options: ['Physician', 'Nurse', 'Administrator', 'Technician', 'Other'] },
      { label: 'In Good Standing?', group: 'Facility Info', type: 'single-select', key: 'in_good_standing', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select standing status' },
      { label: 'Facility Type', group: 'Facility Info', type: 'single-select', key: 'facility_type', placeholder: 'Select facility type', options: ['Hospital', 'Clinic', 'Urgent Care', 'Surgery Center', 'Rehabilitation', 'Other'] },
    ],
  },
  {
    id: 'provider_affiliation',
    title: 'Provider Affiliation',
    fields: [
      { label: 'Currently Affiliated?', group: 'Provider Affiliation', type: 'single-select', key: 'currently_affiliated', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select affiliation status' },
      { label: 'Appt. End Date', group: 'Provider Affiliation', type: 'date', key: 'appt_end_date', placeholder: 'MM/DD/YYYY' },
      { label: 'Start Date', group: 'Provider Affiliation', type: 'date', key: 'start_date', placeholder: 'MM/DD/YYYY' },
      { label: 'End Date', group: 'Provider Affiliation', type: 'date', key: 'end_date', placeholder: 'MM/DD/YYYY' },
      { label: 'Reason For Leaving', group: 'Provider Affiliation', type: 'text', key: 'reason_for_leaving', placeholder: 'Enter reason for leaving' },
      { label: 'Accepting New Patients?', group: 'Provider Affiliation', type: 'single-select', key: 'accepting_new_patients', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select patient acceptance status' },
      { label: 'Telemedicine?', group: 'Provider Affiliation', type: 'single-select', key: 'telemedicine', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select telemedicine availability' },
      { label: 'Takes Calls?', group: 'Provider Affiliation', type: 'single-select', key: 'takes_calls', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select call coverage status' },
      { label: 'Admitting Privileges?', group: 'Provider Affiliation', type: 'single-select', key: 'admitting_privileges', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select admitting privileges status' },
      { label: 'Primary Affiliation?', group: 'Provider Affiliation', type: 'single-select', key: 'primary_affiliation', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select primary affiliation status' },
    ],
  },
  {
    id: 'requirements',
    title: 'Requirements',
    fields: [
      { label: 'Requirements', group: 'Requirements', type: 'multi-select', key: 'requirements', placeholder: 'Select requirements', options: ['credentialing', 'licensing', 'insurance', 'background_check', 'drug_screen', 'references', 'education_verification', 'experience_verification'] },
    ],
  },
  {
    id: 'other',
    title: 'Other',
    fields: [
      { label: 'Tags', group: 'Other', type: 'multi-select', key: 'tags', placeholder: 'Select tags', options: ['urgent', 'new', 'active', 'inactive', 'pending', 'verified', 'primary', 'secondary'] },
      { label: 'Last Updated', group: 'Other', type: 'date', key: 'last_updated', placeholder: 'MM/DD/YYYY' },
    ],
  },
];

const FacilityAffiliationsDetails = ({ formValues, handleChange }) => (
  <>
    {facilityAffiliationsFieldGroups.map((group) => (
      <CollapsibleSection key={group.id} title={group.title}>
        <div className="flex flex-col gap-4 self-stretch">
          {group.fields.map((field) => (
            <React.Fragment key={field.key || field.label}>
              {renderFieldComponent({ field, formValues, handleChange })}
            </React.Fragment>
          ))}
        </div>
      </CollapsibleSection>
    ))}
  </>
);

// Unified template object for Facility Affiliations side panel
export const facilityAffiliationsTemplate = {
  id: 'facility_affiliations',
  name: 'Facility Affiliations',
  description: 'Template for editing provider facility affiliations',
  tabs: [
    { id: 'details', label: 'Details', icon: 'hospital', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'note-sticky', enabled: true },
    { id: 'documents', label: 'Documents', icon: 'folder', enabled: true },
  ],
  fieldGroups: facilityAffiliationsFieldGroups,
  header: ({ gridName, provider }) => generateDefaultHeaderText({ gridName, provider }),
  DetailsComponent: FacilityAffiliationsDetails,
};

export default FacilityAffiliationsDetails; 