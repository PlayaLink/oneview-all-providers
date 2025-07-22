import React from 'react';
import CollapsibleSection from '../CollapsibleSection';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../inputs/SingleSelect';
import TextInputField from '../inputs/TextInputField';
import { getInputType, renderFieldComponent } from './getInputType';

// Provider Info fieldGroups definition - Updated to match database schema
export const providerInfoWideFieldGroups = [
  // 1. Provider Name
  {
    id: "provider_name",
    title: "Provider Name",
    fields: [
      { label: "Prefix", group: "Provider Name", type: "single-select", placeholder: "Select Prefix", options: ["Dr.", "Mr.", "Mrs.", "Ms.", "Mx.", "Prof.", "Rev.", "Sr.", "Fr.", "Hon.", "Other"], key: "prefix" },
      { label: "First Name", group: "Provider Name", type: "text", placeholder: "Enter first name", key: "first_name" },
      { label: "Middle Name", group: "Provider Name", type: "text", placeholder: "Enter middle name", key: "middle_name" },
      { label: "Last Name", group: "Provider Name", type: "text", placeholder: "Enter last name", required: true, key: "last_name" },
      { label: "Suffix", group: "Provider Name", type: "single-select", placeholder: "Select Suffix", options: ["Jr.", "Sr.", "II", "III", "IV", "V", "MD", "DO", "PhD", "Esq.", "Other"], key: "suffix" },
      { label: "Pronouns", group: "Provider Name", type: "single-select", placeholder: "Select Pronoun Types", options: ["He/him/his", "She/her/hers", "They/them/theirs", "Other (please specify)"], key: "pronouns" }
    ]
  },
  // 2. Type, Specialty & Classifications
  {
    id: "type_specialty_classifications",
    title: "Type, Specialty & Classifications",
    fields: [
      { label: "Provider Title", group: "Type, Specialty & Classifications", type: "single-select", placeholder: "Select Provider Title", required: true, options: [
        "ND - Doctor of Naturopathy", "OD - Optometrist", "OTD - Doctor of Occupational Therapy", "PharmD - Doctor of Pharmacy", "PsyD - Doctor of Psychology", "SLPD - Doctor of Speech-Language Pathology", "SP - Supervising Physician", "MD - Medical Doctor", "PA - Physician Assistant", "NP - Nurse Practitioner", "CNM - Certified Nurse Midwife", "DC - Doctor of Chiropractic", "DPT - Doctor of Physical Therapy", "DPM - Doctor of Podiatric Medicine", "DDS - Doctor of Dental Surgery", "RD - Registered Dietitian", "LCSW - Licensed Clinical Social Worker", "LCPC - Licensed Clinical Professional Counselor", "LPC - Licensed Professional Counselor", "DO - Osteopathic Doctor", "DNP - Doctor of Nursing Practice", "DMD - Doctor of Dental Medicine", "DVM - Doctor of Veterinary Medicine", "DrPH - Doctor of Public Health", "EdD - Doctor of Education", "DMSc - Doctor of Medical Science"
      ], key: "title" },
      { label: "Primary Specialty", group: "Type, Specialty & Classifications", type: "single-select", placeholder: "Select Specialties", required: true, options: [
        "Abdominal Imaging", "Acupuncture", "Acute Care Imaging", "Acute Care Nurse Practitioner", "Acute Registered Nurse", "Addiction (Substance Use Disorder)", "Adolescent Medicine", "Adult Medicine", "Allergy and Immunology", "Anesthesiology", "Bariatric Medicine", "Breast Surgery", "Burn Surgery", "Cardiology", "Cardiothoracic Surgery", "Pediatrics", "Acute Care", "Aerospace Medicine", "Critical Care Medicine", "Dermatology"
      ], key: "primary_specialty" },
      { label: "Other Specialties", group: "Type, Specialty & Classifications", type: "multi-select", placeholder: "Select Other Specialties", options: [
        "Pain Management", "Sports Medicine", "Geriatrics", "Sleep Medicine", "Palliative Care", "Infectious Disease", "Genetics", "Occupational Medicine", "Preventive Medicine", "Rehabilitation Medicine", "Other (please specify)"
      ], key: "other_specialties" },
      { label: "Classifications", group: "Type, Specialty & Classifications", type: "multi-select", placeholder: "Select Provider Classification(s)...", options: [
        "Specialist", "Locum Tenens", "Primary Care", "Hospital-based", "Hospitalist", "PRN", "New Hire", "Acquisition", "Rehire", "Float Pool", "Internal Transfer", "Cross Credentialed", "Fellowship", "Subspecialist", "Rotating", "Clinic Only"
      ], key: "classifications" },
      { label: "Taxonomy Codes", group: "Type, Specialty & Classifications", type: "multi-select", placeholder: "Select Taxonomy Code(s)...", options: [
        "Counselor - Addiction (101YA0400X)", "Counselor (101Y00000X)", "Counselor - Mental Health (101YM0800X)", "Counselor - Pastoral (101YP1600X)", "Counselor - Professional (101YP2500X)", "Counselor - School (101YS0200X)", "Psychoanalyst (102L00000X)", "Psychologist (103T00000X)", "Psychologist - Clinical (103TC0700X)", "Social Worker - Clinical (1041C0700X)", "Marriage & Family Therapist (106H00000X)", "Behavior Analyst (103K00000X)", "Case Manager/Care Coordinator (171M00000X)", "Psychiatrist & Neurologist (2084P0800X)", "Developmental Therapist (222Q00000X)"
      ], key: "taxonomy_codes" },
      { label: "Clinical Services", group: "Type, Specialty & Classifications", type: "multi-select", placeholder: "Select Clinical Service(s)...", options: [
        "Outpatient Psychiatric Treatment: Children", "Outpatient Psychiatric Treatment: Geriatric", "Outpatient Psychiatric Treatment: Adult", "Outpatient Psychiatric Treatment Adolescent", "Outpatient Substance Use Disorder Treatment: Geriatric", "Outpatient Substance Use Disorder Treatment: Adult", "Outpatient Substance Use Disorder Treatment: Youth", "Partial Hospitalization Program (PHP)", "Intensive Outpatient Program (IOP)", "Medication Management", "Group Therapy", "Family Therapy", "Individual Counseling", "Psychoeducation Services", "Case Management"
      ], key: "clinical_services" },
      { label: "Marital Status", group: "Type, Specialty & Classifications", type: "single-select", placeholder: "Select Marital Status", options: ["Single", "Married", "Divorced", "Widowed", "Separated", "Other"], key: "marital_status" },
      { label: "Telemed Exp.", group: "Type, Specialty & Classifications", type: "single-select", placeholder: "Select Telemed Exp.", options: ["None", "Some", "Extensive"], key: "telemed_exp" },
      { label: "Fluent languages", group: "Type, Specialty & Classifications", type: "multi-select", placeholder: "Select Fluent Language(s)...", options: ["English", "Spanish", "French", "German", "Chinese", "Other"], key: "fluent_languages" },
      { label: "CMS Medicare Specialty Codes", group: "Type, Specialty & Classifications", type: "multi-select", placeholder: "Select Medicare Specialty Code(s)...", options: ["CMS Code: CMS Desc - Taxonomy Desc (Taxonomy Code)", "Other"], key: "cms_medicare_specialty_codes" }
    ]
  },
  // 3. Contact Info
  {
    id: "contact_info",
    title: "Contact Info",
    fields: [
      { label: "Work Email", group: "Contact Info", type: "text", placeholder: "Enter work email", key: "work_email" },
      { label: "Personal Email", group: "Contact Info", type: "text", placeholder: "Enter personal email", key: "personal_email" },
      { label: "Mobile Phone #", group: "Contact Info", type: "text", placeholder: "(___) ___-____", key: "mobile_phone_number" },
      { label: "Mobile Phone Carrier Name", group: "Contact Info", type: "single-select", placeholder: "Select Mobile Phone...", options: ["AT&T", "Verizon", "T-Mobile", "Sprint", "Other"], key: "mobile_phone_carrier_name" },
      { label: "Pager #", group: "Contact Info", type: "text", placeholder: "(___) ___-____", key: "pager_number" },
      { label: "Fax #", group: "Contact Info", type: "text", placeholder: "(___) ___-____", key: "fax_number" }
    ]
  },
  // 4. Emergency Contact
  {
    id: "emergency_contact",
    title: "Emergency Contact",
    fields: [
      { label: "Emergency Contact Name", group: "Emergency Contact", type: "text", placeholder: "Enter emergency contact name", key: "emergency_contact_name" },
      { label: "Email", group: "Emergency Contact", type: "text", placeholder: "email@example.com", key: "emergency_contact_email" },
      { label: "Phone #", group: "Emergency Contact", type: "text", placeholder: "(___) ___-____", key: "emergency_contact_phone" },
      { label: "Relationship", group: "Emergency Contact", type: "single-select", placeholder: "Select Relationship", options: ["Parent", "Sibling", "Spouse", "Friend", "Other"], key: "emergency_contact_relationship" }
    ]
  },
  // 5. Identification
  {
    id: "identification",
    title: "Identification",
    fields: [
      { label: "Social Security #", group: "Identification", type: "text", placeholder: "...", key: "social_security_number" },
      { label: "NPI #", group: "Identification", type: "text", placeholder: "Enter NPI number", key: "npi_number" },
      { label: "Last Updated", group: "Identification", type: "date", placeholder: "MM/DD/YYYY", key: "last_updated" },
      { label: "Enumeration Date", group: "Identification", type: "date", placeholder: "MM/DD/YYYY", key: "enumeration_date" },
      { label: "Driver License or ID #", group: "Identification", type: "text", placeholder: "...", key: "driver_license_or_id_number" },
      { label: "State Issued", group: "Identification", type: "single-select", placeholder: "Select State Issued", options: [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
      ], key: "state_issued" },
      { label: "Issue Date", group: "Identification", type: "date", placeholder: "MM/DD/YYYY", key: "issue_date" },
      { label: "Expiration Date", group: "Identification", type: "date", placeholder: "MM/DD/YYYY", key: "expiration_date" }
    ]
  },
  // 6. Tags & Metadata
  {
    id: "tags_metadata",
    title: "Tags & Metadata",
    fields: [
      { label: "Tags", group: "Tags & Metadata", type: "multi-select", placeholder: "Select tags", options: ["urgent", "new", "active", "inactive", "pending", "verified", "primary", "secondary"], key: "tags" }
    ]
  }
];

const ProviderInfoDetailsWide = ({ formValues, handleChange }) => (
  <>
    {providerInfoWideFieldGroups.map((group) => (
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

// Unified template object for Provider Info Wide side panel
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
  fieldGroups: providerInfoWideFieldGroups,
  DetailsComponent: ProviderInfoDetailsWide,
};

export default ProviderInfoDetailsWide; 