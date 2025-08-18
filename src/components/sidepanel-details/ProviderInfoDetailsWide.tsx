import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../inputs/SingleSelect';
import TextInputField from '../inputs/TextInputField';
import { generateProviderName, generateDefaultHeaderText } from '@/lib/utils';
import { providerInfoFieldGroups } from './ProviderInfoDetails';

// Helper to get value and onChange for a field
function getFieldProps(fieldKey, formValues, handleChange) {
  return {
    value: formValues[fieldKey] || '',
    onChange: (val) => handleChange(fieldKey, val),
  };
}

const ProviderInfoDetailsWide = ({ formValues, handleChange }) => (
  <>
    {/* Provider Name Section */}
    <CollapsibleSection title="Provider Name">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <SingleSelect label="Prefix" labelPosition="above" options={["Dr.", "Mr.", "Mrs.", "Ms.", "Mx.", "Prof.", "Rev.", "Sr.", "Fr.", "Hon.", "Other"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('prefix', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="First Name" labelPosition="above" {...getFieldProps('first_name', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Middle Name" labelPosition="above" {...getFieldProps('middle_name', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Last Name" labelPosition="above" {...getFieldProps('last_name', formValues, handleChange)} />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <SingleSelect label="Suffix" labelPosition="above" options={["Jr.", "Sr.", "II", "III", "IV", "V", "MD", "DO", "PhD", "Esq.", "Other"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('suffix', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="Pronouns" labelPosition="above" options={["He/him/his", "She/her/hers", "They/them/theirs", "Other (please specify)"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('pronouns', formValues, handleChange)} />
        </div>
        <div className="flex-1" />
        <div className="flex-1" />
      </div>
    </CollapsibleSection>

    {/* Type, Specialty & Classifications Section */}
    <CollapsibleSection title="Title, Specialty & Classifications">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <SingleSelect label="Provider Title" labelPosition="above" options={["ND - Doctor of Naturopathy", "OD - Optometrist", "OTD - Doctor of Occupational Therapy", "PharmD - Doctor of Pharmacy", "PsyD - Doctor of Psychology", "SLPD - Doctor of Speech-Language Pathology", "SP - Supervising Physician", "MD - Medical Doctor", "PA - Physician Assistant", "NP - Nurse Practitioner", "CNM - Certified Nurse Midwife", "DC - Doctor of Chiropractic", "DPT - Doctor of Physical Therapy", "DPM - Doctor of Podiatric Medicine", "DDS - Doctor of Dental Surgery", "RD - Registered Dietitian", "LCSW - Licensed Clinical Social Worker", "LCPC - Licensed Clinical Professional Counselor", "LPC - Licensed Professional Counselor", "DO - Osteopathic Doctor", "DNP - Doctor of Nursing Practice", "DMD - Doctor of Dental Medicine", "DVM - Doctor of Veterinary Medicine", "DrPH - Doctor of Public Health", "EdD - Doctor of Education", "DMSc - Doctor of Medical Science"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('title', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="Specialty List" labelPosition="above" options={["Abdominal Imaging", "Acupuncture", "Acute Care Imaging", "Acute Care Nurse Practitioner", "Acute Registered Nurse", "Addiction (Substance Use Disorder)", "Adolescent Medicine", "Adult Medicine", "Allergy and Immunology", "Anesthesiology", "Bariatric Medicine", "Breast Surgery", "Burn Surgery", "Cardiology", "Cardiothoracic Surgery", "Pediatrics", "Acute Care", "Aerospace Medicine", "Critical Care Medicine", "Dermatology"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('primary_specialty', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <MultiSelectInput label="Taxonomy Codes" labelPosition="above" options={["Counselor - Addiction (101YA0400X)", "Counselor (101Y00000X)", "Counselor - Mental Health (101YM0800X)", "Counselor - Pastoral (101YP1600X)", "Counselor - Professional (101YP2500X)", "Counselor - School (101YS0200X)", "Psychoanalyst (102L00000X)", "Psychologist (103T00000X)", "Psychologist - Clinical (103TC0700X)", "Social Worker - Clinical (1041C0700X)", "Marriage & Family Therapist (106H00000X)", "Behavior Analyst (103K00000X)", "Case Manager/Care Coordinator (171M00000X)", "Psychiatrist & Neurologist (2084P0800X)", "Developmental Therapist (222Q00000X)"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('taxonomy_codes', formValues, handleChange)} />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <MultiSelectInput label="Clinical Services" labelPosition="above" options={["Outpatient Psychiatric Treatment: Children", "Outpatient Psychiatric Treatment: Geriatric", "Outpatient Psychiatric Treatment: Adult", "Outpatient Psychiatric Treatment Adolescent", "Outpatient Substance Use Disorder Treatment: Geriatric", "Outpatient Substance Use Disorder Treatment: Adult", "Outpatient Substance Use Disorder Treatment: Youth", "Partial Hospitalization Program (PHP)", "Intensive Outpatient Program (IOP)", "Medication Management", "Group Therapy", "Family Therapy", "Individual Counseling", "Psychoeducation Services", "Case Management"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('clinical_services', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="Marital Status" labelPosition="above" options={["Single", "Married", "Divorced", "Widowed", "Separated", "Other"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('marital_status', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="Telemed Exp." labelPosition="above" options={["None", "Some", "Extensive"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('telemed_exp', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <MultiSelectInput label="Fluent Languages" labelPosition="above" options={["English", "Spanish", "French", "German", "Chinese", "Other"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('fluent_languages', formValues, handleChange)} />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <MultiSelectInput label="CMS Medicare Specialty Codes" labelPosition="above" options={["CMS Code: CMS Desc - Taxonomy Desc (Taxonomy Code)", "Other"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('cms_medicare_specialty_codes', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <MultiSelectInput label="Other Specialties" labelPosition="above" options={["Pain Management", "Sports Medicine", "Geriatrics", "Sleep Medicine", "Palliative Care", "Infectious Disease", "Genetics", "Occupational Medicine", "Preventive Medicine", "Rehabilitation Medicine", "Other (please specify)"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('other_specialties', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <MultiSelectInput label="Classifications" labelPosition="above" options={["Specialist", "Locum Tenens", "Primary Care", "Hospital-based", "Hospitalist", "PRN", "New Hire", "Acquisition", "Rehire", "Float Pool", "Internal Transfer", "Cross Credentialed", "Fellowship", "Subspecialist", "Rotating", "Clinic Only"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('classifications', formValues, handleChange)} />
        </div>
        <div className="flex-1" />
      </div>
    </CollapsibleSection>

    {/* Contact Info Section */}
    <CollapsibleSection title="Contact Info">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <TextInputField label="Work Email" labelPosition="above" {...getFieldProps('work_email', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Personal Email" labelPosition="above" {...getFieldProps('personal_email', formValues, handleChange)} />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <TextInputField label="Label goes here" labelPosition="above" {...getFieldProps('mobile_phone_number', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="Mobile Phone Carrier Name" labelPosition="above" options={["AT&T", "Verizon", "T-Mobile", "Sprint", "Other"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('mobile_phone_carrier_name', formValues, handleChange)} />
        </div>
      </div>
    </CollapsibleSection>

    {/* Emergency Contact Section */}
    <CollapsibleSection title="Emergency Contact">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <TextInputField label="Emergency Contact Name" labelPosition="above" {...getFieldProps('emergency_contact_name', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Email" labelPosition="above" {...getFieldProps('emergency_contact_email', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Mobile Phone #" labelPosition="above" {...getFieldProps('emergency_contact_phone', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="Relationship" labelPosition="above" options={["Parent", "Sibling", "Spouse", "Friend", "Other"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('emergency_contact_relationship', formValues, handleChange)} />
        </div>
      </div>
    </CollapsibleSection>

    {/* Identification Section */}
    <CollapsibleSection title="Identification">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <TextInputField label="Social Security #" labelPosition="above" {...getFieldProps('social_security_number', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="NPI #" labelPosition="above" {...getFieldProps('npi_number', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Last Updated" labelPosition="above" {...getFieldProps('last_updated', formValues, handleChange)} />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-2">
        <div className="flex-1">
          <TextInputField label="Driver License or ID #" labelPosition="above" {...getFieldProps('driver_license_or_id_number', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <SingleSelect label="State Issued" labelPosition="above" options={["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"].map(opt => ({ id: opt, label: opt }))} {...getFieldProps('state_issued', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Issue Date" labelPosition="above" {...getFieldProps('issue_date', formValues, handleChange)} />
        </div>
        <div className="flex-1">
          <TextInputField label="Expiration Date" labelPosition="above" {...getFieldProps('expiration_date', formValues, handleChange)} />
        </div>
      </div>
    </CollapsibleSection>
  </>
);

export const providerInfoWideTemplate = {
  id: 'provider_info_wide',
  name: 'Provider Information (Wide)',
  description: 'Template for displaying provider information details in wide format',
  header: ({ gridName, row, provider, isCreateMode }) => generateDefaultHeaderText({ gridName, provider, isCreateMode }),
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