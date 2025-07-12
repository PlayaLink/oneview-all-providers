import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { getInputType, renderFieldComponent } from './getInputType';

// Field groups for Facility Affiliations
export const facilityAffiliationsFieldGroups = [
  {
    id: 'facility_info',
    title: 'Facility Info',
    fields: [
      { label: 'Facility Name', group: 'Facility Info', type: 'text', rowKey: 'facility_name', required: true },
      { label: 'Staff Category', group: 'Facility Info', type: 'single-select', rowKey: 'staff_category' },
      { label: 'In Good Standing?', group: 'Facility Info', type: 'single-select', rowKey: 'in_good_standing', options: ['Yes', 'No', 'Unknown'] },
      { label: 'Facility Type', group: 'Facility Info', type: 'single-select', rowKey: 'facility_type' },
    ],
  },
  {
    id: 'provider_affiliation',
    title: 'Provider Affiliation',
    fields: [
      { label: 'Currently Affiliated?', group: 'Provider Affiliation', type: 'single-select', rowKey: 'currently_affiliated', options: ['Yes', 'No', 'Unknown'] },
      { label: 'Appt. End Date', group: 'Provider Affiliation', type: 'date', rowKey: 'appt_end_date' },
      { label: 'Start Date', group: 'Provider Affiliation', type: 'date', rowKey: 'start_date' },
      { label: 'End Date', group: 'Provider Affiliation', type: 'date', rowKey: 'end_date' },
      { label: 'Reason For Leaving', group: 'Provider Affiliation', type: 'text', rowKey: 'reason_for_leaving' },
      { label: 'Accepting New Patients?', group: 'Provider Affiliation', type: 'single-select', rowKey: 'accepting_new_patients', options: ['Yes', 'No', 'Unknown'] },
      { label: 'Telemedicine?', group: 'Provider Affiliation', type: 'single-select', rowKey: 'telemedicine', options: ['Yes', 'No', 'Unknown'] },
      { label: 'Takes Calls?', group: 'Provider Affiliation', type: 'single-select', rowKey: 'takes_calls', options: ['Yes', 'No', 'Unknown'] },
      { label: 'Admitting Privileges?', group: 'Provider Affiliation', type: 'single-select', rowKey: 'admitting_privileges', options: ['Yes', 'No', 'Unknown'] },
      { label: 'Primary Affiliation?', group: 'Provider Affiliation', type: 'single-select', rowKey: 'primary_affiliation', options: ['Yes', 'No', 'Unknown'] },
    ],
  },
  {
    id: 'other',
    title: 'Other',
    fields: [
      { label: 'Tags', group: 'Other', type: 'multi-select', rowKey: 'tags' },
      { label: 'Last Updated', group: 'Other', type: 'date', rowKey: 'last_updated' },
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