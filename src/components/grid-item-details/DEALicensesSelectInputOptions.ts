/**
 * Select input options for DEA Licenses grid
 * This file contains all dropdown options used in DEA Licenses forms and seeding scripts
 */

// State options for DEA license state and registered address state
export const STATE_OPTIONS = [
  'AL - Alabama',
  'AK - Alaska', 
  'AZ - Arizona',
  'AR - Arkansas',
  'CA - California',
  'CO - Colorado',
  'CT - Connecticut',
  'DE - Delaware',
  'FL - Florida',
  'GA - Georgia',
  'HI - Hawaii',
  'ID - Idaho',
  'IL - Illinois',
  'IN - Indiana',
  'IA - Iowa',
  'KS - Kansas',
  'KY - Kentucky',
  'LA - Louisiana',
  'ME - Maine',
  'MD - Maryland',
  'MA - Massachusetts',
  'MI - Michigan',
  'MN - Minnesota',
  'MS - Mississippi',
  'MO - Missouri',
  'MT - Montana',
  'NE - Nebraska',
  'NV - Nevada',
  'NH - New Hampshire',
  'NJ - New Jersey',
  'NM - New Mexico',
  'NY - New York',
  'NC - North Carolina',
  'ND - North Dakota',
  'OH - Ohio',
  'OK - Oklahoma',
  'OR - Oregon',
  'PA - Pennsylvania',
  'RI - Rhode Island',
  'SC - South Carolina',
  'SD - South Dakota',
  'TN - Tennessee',
  'TX - Texas',
  'UT - Utah',
  'VT - Vermont',
  'VA - Virginia',
  'WA - Washington',
  'WV - West Virginia',
  'WI - Wisconsin',
  'WY - Wyoming',
  'DC - District of Columbia',
  'PR - Puerto Rico',
  'VI - Virgin Islands',
  'GU - Guam',
  'AS - American Samoa',
  'MP - Northern Mariana Islands'
];

// Status options for DEA license status
export const STATUS_OPTIONS = [
  'Active',
  'Inactive', 
  'Expired',
  'Pending',
  'Issue'
];

// Payment indicator options
export const PAYMENT_INDICATOR_OPTIONS = [
  'Fee Exempt',
  'Paid'
];

// Don't renew options
export const DONT_RENEW_OPTIONS = [
  'Don\'t Renew (Yes)',
  'Renew (No)'
];

// Don't transfer options
export const DONT_TRANSFER_OPTIONS = [
  'Don\'t Transfer (Yes)',
  'Transfer (No)'
];

// Yes/No options for primary license and other boolean fields
export const YES_NO_OPTIONS = [
  'Yes',
  'No'
];

// Approved ERx options
export const APPROVED_ERX_OPTIONS = [
  'Yes',
  'No'
];

// DEA Schedules options
export const DEA_SCHEDULES_OPTIONS = [
  'Schedule I',
  'Schedule II', 
  'Schedule III',
  'Schedule IV',
  'Schedule V'
];

// Extended options for seeding scripts (includes more variations)
export const EXTENDED_STATE_OPTIONS = [
  ...STATE_OPTIONS,
  'TX - Texas',
  'CA - California',
  'NY - New York',
  'FL - Florida',
  'IL - Illinois'
];

export const EXTENDED_STATUS_OPTIONS = [
  ...STATUS_OPTIONS,
  'Suspended',
  'Revoked',
  'Under Review'
];

export const EXTENDED_PAYMENT_INDICATOR_OPTIONS = [
  ...PAYMENT_INDICATOR_OPTIONS,
  'Pending',
  'Overdue'
];

// Tags for DEA licenses
export const DEA_LICENSE_TAGS = [
  'DEA',
  'Controlled Substances',
  'Prescription',
  'Pharmacy',
  'Medical',
  'License',
  'Federal',
  'Drug Enforcement',
  'Schedule II',
  'Schedule III',
  'Schedule IV',
  'Schedule V',
  'Narcotics',
  'Opioids',
  'Stimulants',
  'Depressants',
  'Hallucinogens',
  'Anabolic Steroids'
];



