// State Controlled Substance Licenses Select Input Options
// This file contains all dropdown options for the State Controlled Substance Licenses grid
// Used by both Details components and seeding scripts for consistency

// License Type Options
export const LICENSE_TYPE_OPTIONS = [
  { id: 'DO', label: 'DO' },
  { id: 'MD', label: 'MD' },
  { id: 'PA', label: 'PA' },
  { id: 'NP', label: 'NP' },
  { id: 'RN', label: 'RN' },
  { id: 'DDS', label: 'DDS' },
  { id: 'DMD', label: 'DMD' },
  { id: 'PharmD', label: 'PharmD' }
];

// State Options (US States)
export const STATE_OPTIONS = [
  { id: 'AL', label: 'AL - Alabama' },
  { id: 'AK', label: 'AK - Alaska' },
  { id: 'AZ', label: 'AZ - Arizona' },
  { id: 'AR', label: 'AR - Arkansas' },
  { id: 'CA', label: 'CA - California' },
  { id: 'CO', label: 'CO - Colorado' },
  { id: 'CT', label: 'CT - Connecticut' },
  { id: 'DE', label: 'DE - Delaware' },
  { id: 'FL', label: 'FL - Florida' },
  { id: 'GA', label: 'GA - Georgia' },
  { id: 'HI', label: 'HI - Hawaii' },
  { id: 'ID', label: 'ID - Idaho' },
  { id: 'IL', label: 'IL - Illinois' },
  { id: 'IN', label: 'IN - Indiana' },
  { id: 'IA', label: 'IA - Iowa' },
  { id: 'KS', label: 'KS - Kansas' },
  { id: 'KY', label: 'KY - Kentucky' },
  { id: 'LA', label: 'LA - Louisiana' },
  { id: 'ME', label: 'ME - Maine' },
  { id: 'MD', label: 'MD - Maryland' },
  { id: 'MA', label: 'MA - Massachusetts' },
  { id: 'MI', label: 'MI - Michigan' },
  { id: 'MN', label: 'MN - Minnesota' },
  { id: 'MS', label: 'MS - Mississippi' },
  { id: 'MO', label: 'MO - Missouri' },
  { id: 'MT', label: 'MT - Montana' },
  { id: 'NE', label: 'NE - Nebraska' },
  { id: 'NV', label: 'NV - Nevada' },
  { id: 'NH', label: 'NH - New Hampshire' },
  { id: 'NJ', label: 'NJ - New Jersey' },
  { id: 'NM', label: 'NM - New Mexico' },
  { id: 'NY', label: 'NY - New York' },
  { id: 'NC', label: 'NC - North Carolina' },
  { id: 'ND', label: 'ND - North Dakota' },
  { id: 'OH', label: 'OH - Ohio' },
  { id: 'OK', label: 'OK - Oklahoma' },
  { id: 'OR', label: 'OR - Oregon' },
  { id: 'PA', label: 'PA - Pennsylvania' },
  { id: 'RI', label: 'RI - Rhode Island' },
  { id: 'SC', label: 'SC - South Carolina' },
  { id: 'SD', label: 'SD - South Dakota' },
  { id: 'TN', label: 'TN - Tennessee' },
  { id: 'TX', label: 'TX - Texas' },
  { id: 'UT', label: 'UT - Utah' },
  { id: 'VT', label: 'VT - Vermont' },
  { id: 'VA', label: 'VA - Virginia' },
  { id: 'WA', label: 'WA - Washington' },
  { id: 'WV', label: 'WV - West Virginia' },
  { id: 'WI', label: 'WI - Wisconsin' },
  { id: 'WY', label: 'WY - Wyoming' }
];

// Status Options
export const STATUS_OPTIONS = [
  { id: 'Active', label: 'Active' },
  { id: 'Active - Fully Licensed', label: 'Active - Fully Licensed' },
  { id: 'Active - Not Practicing', label: 'Active - Not Practicing' },
  { id: 'Active on Probation', label: 'Active on Probation' },
  { id: 'Fully Licensed', label: 'Fully Licensed' },
  { id: 'License in Good Standing', label: 'License in Good Standing' },
  { id: 'Inactive', label: 'Inactive' },
  { id: 'Expired', label: 'Expired' },
  { id: 'Suspended', label: 'Suspended' },
  { id: 'Revoked', label: 'Revoked' }
];

// Don't Renew Options
export const DONT_RENEW_OPTIONS = [
  { id: 'Renew (No)', label: 'Renew (No)' },
  { id: 'Don\'t Renew (Yes)', label: 'Don\'t Renew (Yes)' }
];

// Is Primary Options
export const IS_PRIMARY_OPTIONS = [
  { id: 'Yes', label: 'Yes' },
  { id: 'No', label: 'No' }
];

// Title Options (Professional Titles)
export const TITLE_OPTIONS = [
  { id: 'DO', label: 'DO' },
  { id: 'MD', label: 'MD' },
  { id: 'PA', label: 'PA' },
  { id: 'NP', label: 'NP' },
  { id: 'RN', label: 'RN' },
  { id: 'DDS', label: 'DDS' },
  { id: 'DMD', label: 'DMD' },
  { id: 'PharmD', label: 'PharmD' }
];

// Primary Specialty Options
export const PRIMARY_SPECIALTY_OPTIONS = [
  { id: 'General Surgery', label: 'General Surgery' },
  { id: 'Internal Medicine', label: 'Internal Medicine' },
  { id: 'Family Medicine', label: 'Family Medicine' },
  { id: 'Emergency Medicine', label: 'Emergency Medicine' },
  { id: 'Anesthesiology', label: 'Anesthesiology' },
  { id: 'Radiology', label: 'Radiology' },
  { id: 'Pathology', label: 'Pathology' },
  { id: 'Psychiatry', label: 'Psychiatry' },
  { id: 'Pediatrics', label: 'Pediatrics' },
  { id: 'Obstetrics and Gynecology', label: 'Obstetrics and Gynecology' }
];

// Tags Options
export const TAGS_OPTIONS = [
  { id: 'Expiring Soon', label: 'Expiring Soon' },
  { id: 'Expired', label: 'Expired' },
  { id: 'High Priority', label: 'High Priority' },
  { id: 'Follow Up Required', label: 'Follow Up Required' },
  { id: 'Documentation Needed', label: 'Documentation Needed' }
];

// Extended options for seeding scripts (includes more variety)
export const EXTENDED_LICENSE_TYPE_OPTIONS = [
  ...LICENSE_TYPE_OPTIONS,
  { id: 'DVM', label: 'DVM' },
  { id: 'OD', label: 'OD' },
  { id: 'DC', label: 'DC' },
  { id: 'LCSW', label: 'LCSW' },
  { id: 'LPC', label: 'LPC' }
];

export const EXTENDED_STATUS_OPTIONS = [
  ...STATUS_OPTIONS,
  { id: 'Pending', label: 'Pending' },
  { id: 'Under Review', label: 'Under Review' },
  { id: 'Conditional', label: 'Conditional' },
  { id: 'Probationary', label: 'Probationary' }
];

export const EXTENDED_PRIMARY_SPECIALTY_OPTIONS = [
  ...PRIMARY_SPECIALTY_OPTIONS,
  { id: 'Cardiology', label: 'Cardiology' },
  { id: 'Dermatology', label: 'Dermatology' },
  { id: 'Endocrinology', label: 'Endocrinology' },
  { id: 'Gastroenterology', label: 'Gastroenterology' },
  { id: 'Hematology', label: 'Hematology' },
  { id: 'Infectious Disease', label: 'Infectious Disease' },
  { id: 'Nephrology', label: 'Nephrology' },
  { id: 'Neurology', label: 'Neurology' },
  { id: 'Oncology', label: 'Oncology' },
  { id: 'Orthopedics', label: 'Orthopedics' },
  { id: 'Pulmonology', label: 'Pulmonology' },
  { id: 'Rheumatology', label: 'Rheumatology' },
  { id: 'Urology', label: 'Urology' }
];

export const EXTENDED_TAGS_OPTIONS = [
  ...TAGS_OPTIONS,
  { id: 'New License', label: 'New License' },
  { id: 'Renewal Required', label: 'Renewal Required' },
  { id: 'Compliance Issue', label: 'Compliance Issue' },
  { id: 'Training Required', label: 'Training Required' },
  { id: 'Background Check', label: 'Background Check' }
];
