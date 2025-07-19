import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { getInputType, renderFieldComponent } from './getInputType';

// Field groups for Facility Affiliations - Updated to match database schema
export const facilityAffiliationsFieldGroups = [
  {
    id: 'facility_info',
    title: 'Facility Info',
    fields: [
      { label: 'Facility ID', group: 'Facility Info', type: 'text', rowKey: 'facility_id', placeholder: 'Enter facility ID', required: true },
      { label: 'Staff Category', group: 'Facility Info', type: 'single-select', rowKey: 'staff_category', placeholder: 'Select staff category', options: ['Physician', 'Nurse', 'Administrator', 'Technician', 'Other'] },
      { label: 'In Good Standing?', group: 'Facility Info', type: 'single-select', rowKey: 'in_good_standing', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select standing status' },
      { label: 'Facility Type', group: 'Facility Info', type: 'single-select', rowKey: 'facility_type', placeholder: 'Select facility type', options: ['Hospital', 'Clinic', 'Urgent Care', 'Surgery Center', 'Rehabilitation', 'Other'] },
    ],
  },
  {
    id: 'provider_affiliation',
    title: 'Provider Affiliation',
    fields: [
      { label: 'Currently Affiliated?', group: 'Provider Affiliation', type: 'single-select', rowKey: 'currently_affiliated', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select affiliation status' },
      { label: 'Appt. End Date', group: 'Provider Affiliation', type: 'date', rowKey: 'appt_end_date', placeholder: 'MM/DD/YYYY' },
      { label: 'Start Date', group: 'Provider Affiliation', type: 'date', rowKey: 'start_date', placeholder: 'MM/DD/YYYY' },
      { label: 'End Date', group: 'Provider Affiliation', type: 'date', rowKey: 'end_date', placeholder: 'MM/DD/YYYY' },
      { label: 'Reason For Leaving', group: 'Provider Affiliation', type: 'text', rowKey: 'reason_for_leaving', placeholder: 'Enter reason for leaving' },
      { label: 'Accepting New Patients?', group: 'Provider Affiliation', type: 'single-select', rowKey: 'accepting_new_patients', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select patient acceptance status' },
      { label: 'Telemedicine?', group: 'Provider Affiliation', type: 'single-select', rowKey: 'telemedicine', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select telemedicine availability' },
      { label: 'Takes Calls?', group: 'Provider Affiliation', type: 'single-select', rowKey: 'takes_calls', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select call coverage status' },
      { label: 'Admitting Privileges?', group: 'Provider Affiliation', type: 'single-select', rowKey: 'admitting_privileges', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select admitting privileges status' },
      { label: 'Primary Affiliation?', group: 'Provider Affiliation', type: 'single-select', rowKey: 'primary_affiliation', options: ['Yes', 'No', 'Unknown'], placeholder: 'Select primary affiliation status' },
    ],
  },
  {
    id: 'requirements',
    title: 'Requirements',
    fields: [
      { label: 'Requirements', group: 'Requirements', type: 'multi-select', rowKey: 'requirements', placeholder: 'Select requirements', options: ['credentialing', 'licensing', 'insurance', 'background_check', 'drug_screen', 'references', 'education_verification', 'experience_verification'] },
    ],
  },
  {
    id: 'other',
    title: 'Other',
    fields: [
      { label: 'Tags', group: 'Other', type: 'multi-select', rowKey: 'tags', placeholder: 'Select tags', options: ['urgent', 'new', 'active', 'inactive', 'pending', 'verified', 'primary', 'secondary'] },
      { label: 'Last Updated', group: 'Other', type: 'date', rowKey: 'last_updated', placeholder: 'MM/DD/YYYY' },
    ],
  },
];

const FacilityAffiliationsDetails = ({ formValues, handleChange }) => (
  <>
    {facilityAffiliationsFieldGroups.map((group) => (
      <CollapsibleSection key={group.id} title={group.title}>
        <div className="flex flex-col gap-4 self-stretch">
          {group.fields.map((field) => (
            <React.Fragment key={field.rowKey || field.label}>
              {renderFieldComponent({ field, formValues, handleChange })}
            </React.Fragment>
          ))}
        </div>
      </CollapsibleSection>
    ))}
  </>
);

export default FacilityAffiliationsDetails; 