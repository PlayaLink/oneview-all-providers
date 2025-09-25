// ProviderInfoSelectInputOptions.ts
// Dropdown options for Provider Info grid

// Provider titles with structured data
export const PROVIDER_TITLES = [
  {
    title_acronym: "ND",
    full_title: "Doctor of Naturopathy",
    formatted_title: "ND - Doctor of Naturopathy"
  },
  {
    title_acronym: "OD",
    full_title: "Optometrist",
    formatted_title: "OD - Optometrist"
  },
  {
    title_acronym: "OTD",
    full_title: "Doctor of Occupational Therapy",
    formatted_title: "OTD - Doctor of Occupational Therapy"
  },
  {
    title_acronym: "PharmD",
    full_title: "Doctor of Pharmacy",
    formatted_title: "PharmD - Doctor of Pharmacy"
  },
  {
    title_acronym: "PsyD",
    full_title: "Doctor of Psychology",
    formatted_title: "PsyD - Doctor of Psychology"
  },
  {
    title_acronym: "SLPD",
    full_title: "Doctor of Speech-Language Pathology",
    formatted_title: "SLPD - Doctor of Speech-Language Pathology"
  },
  {
    title_acronym: "SP",
    full_title: "Supervising Physician",
    formatted_title: "SP - Supervising Physician"
  },
  {
    title_acronym: "MD",
    full_title: "Medical Doctor",
    formatted_title: "MD - Medical Doctor"
  },
  {
    title_acronym: "PA",
    full_title: "Physician Assistant",
    formatted_title: "PA - Physician Assistant"
  },
  {
    title_acronym: "NP",
    full_title: "Nurse Practitioner",
    formatted_title: "NP - Nurse Practitioner"
  },
  {
    title_acronym: "CNM",
    full_title: "Certified Nurse Midwife",
    formatted_title: "CNM - Certified Nurse Midwife"
  },
  {
    title_acronym: "DC",
    full_title: "Doctor of Chiropractic",
    formatted_title: "DC - Doctor of Chiropractic"
  },
  {
    title_acronym: "DPT",
    full_title: "Doctor of Physical Therapy",
    formatted_title: "DPT - Doctor of Physical Therapy"
  },
  {
    title_acronym: "DPM",
    full_title: "Doctor of Podiatric Medicine",
    formatted_title: "DPM - Doctor of Podiatric Medicine"
  },
  {
    title_acronym: "DDS",
    full_title: "Doctor of Dental Surgery",
    formatted_title: "DDS - Doctor of Dental Surgery"
  },
  {
    title_acronym: "RD",
    full_title: "Registered Dietitian",
    formatted_title: "RD - Registered Dietitian"
  },
  {
    title_acronym: "LCSW",
    full_title: "Licensed Clinical Social Worker",
    formatted_title: "LCSW - Licensed Clinical Social Worker"
  },
  {
    title_acronym: "LCPC",
    full_title: "Licensed Clinical Professional Counselor",
    formatted_title: "LCPC - Licensed Clinical Professional Counselor"
  },
  {
    title_acronym: "LPC",
    full_title: "Licensed Professional Counselor",
    formatted_title: "LPC - Licensed Professional Counselor"
  },
  {
    title_acronym: "DO",
    full_title: "Osteopathic Doctor",
    formatted_title: "DO - Osteopathic Doctor"
  },
  {
    title_acronym: "DNP",
    full_title: "Doctor of Nursing Practice",
    formatted_title: "DNP - Doctor of Nursing Practice"
  },
  {
    title_acronym: "DMD",
    full_title: "Doctor of Dental Medicine",
    formatted_title: "DMD - Doctor of Dental Medicine"
  },
  {
    title_acronym: "DVM",
    full_title: "Doctor of Veterinary Medicine",
    formatted_title: "DVM - Doctor of Veterinary Medicine"
  },
  {
    title_acronym: "DrPH",
    full_title: "Doctor of Public Health",
    formatted_title: "DrPH - Doctor of Public Health"
  },
  {
    title_acronym: "EdD",
    full_title: "Doctor of Education",
    formatted_title: "EdD - Doctor of Education"
  },
  {
    title_acronym: "DMSc",
    full_title: "Doctor of Medical Science",
    formatted_title: "DMSc - Doctor of Medical Science"
  }
];

// Helper function to get formatted titles for the options array
export const PROVIDER_TITLE_OPTIONS = PROVIDER_TITLES.map(title => ({ id: title.formatted_title, label: title.formatted_title }));

// Helper function to get title acronym from title value
export const getTitleAcronym = (titleValue: string): string => {
  if (!titleValue) return '';
  // First try to find an exact match in our PROVIDER_TITLES array
  const exactMatch = PROVIDER_TITLES.find(title => title.formatted_title === titleValue);
  if (exactMatch) {
    return exactMatch.title_acronym;
  }
  
  // Fallback: extract acronym from the format "ACRONYM - Full Title"
  const match = titleValue.match(/^([A-Z]+)\s*-\s*(.+)$/);
  if (match) {
    return match[1].trim();
  }
  
  // If no pattern matches, return the original string
  return titleValue;
};

// Prefix options
export const PREFIX_OPTIONS = [
  { id: "Dr.", label: "Dr." },
  { id: "Mr.", label: "Mr." },
  { id: "Mrs.", label: "Mrs." },
  { id: "Ms.", label: "Ms." },
  { id: "Mx.", label: "Mx." },
  { id: "Prof.", label: "Prof." },
  { id: "Rev.", label: "Rev." },
  { id: "Sr.", label: "Sr." },
  { id: "Fr.", label: "Fr." },
  { id: "Hon.", label: "Hon." },
  { id: "Other", label: "Other" }
];

// Suffix options
export const SUFFIX_OPTIONS = [
  { id: "Jr.", label: "Jr." },
  { id: "Sr.", label: "Sr." },
  { id: "II", label: "II" },
  { id: "III", label: "III" },
  { id: "IV", label: "IV" },
  { id: "V", label: "V" },
  { id: "MD", label: "MD" },
  { id: "DO", label: "DO" },
  { id: "PhD", label: "PhD" },
  { id: "Esq.", label: "Esq." },
  { id: "Other", label: "Other" }
];

// Pronoun options
export const PRONOUN_OPTIONS = [
  { id: "He/him/his", label: "He/him/his" },
  { id: "She/her/hers", label: "She/her/hers" },
  { id: "They/them/theirs", label: "They/them/theirs" },
  { id: "Other (please specify)", label: "Other (please specify)" }
];

// Specialty options
export const SPECIALTY_OPTIONS = [
  { id: "Abdominal Imaging", label: "Abdominal Imaging" },
  { id: "Acupuncture", label: "Acupuncture" },
  { id: "Acute Care Imaging", label: "Acute Care Imaging" },
  { id: "Acute Care Nurse Practitioner", label: "Acute Care Nurse Practitioner" },
  { id: "Acute Registered Nurse", label: "Acute Registered Nurse" },
  { id: "Addiction (Substance Use Disorder)", label: "Addiction (Substance Use Disorder)" },
  { id: "Adolescent Medicine", label: "Adolescent Medicine" },
  { id: "Adult Medicine", label: "Adult Medicine" },
  { id: "Allergy and Immunology", label: "Allergy and Immunology" },
  { id: "Anesthesiology", label: "Anesthesiology" },
  { id: "Bariatric Medicine", label: "Bariatric Medicine" },
  { id: "Breast Surgery", label: "Breast Surgery" },
  { id: "Burn Surgery", label: "Burn Surgery" },
  { id: "Cardiology", label: "Cardiology" },
  { id: "Cardiothoracic Surgery", label: "Cardiothoracic Surgery" },
  { id: "Pediatrics", label: "Pediatrics" },
  { id: "Acute Care", label: "Acute Care" },
  { id: "Aerospace Medicine", label: "Aerospace Medicine" },
  { id: "Critical Care Medicine", label: "Critical Care Medicine" },
  { id: "Dermatology", label: "Dermatology" }
];

// Taxonomy code options
export const TAXONOMY_CODE_OPTIONS = [
  { id: "Counselor - Addiction (101YA0400X)", label: "Counselor - Addiction (101YA0400X)" },
  { id: "Counselor (101Y00000X)", label: "Counselor (101Y00000X)" },
  { id: "Counselor - Mental Health (101YM0800X)", label: "Counselor - Mental Health (101YM0800X)" },
  { id: "Counselor - Pastoral (101YP1600X)", label: "Counselor - Pastoral (101YP1600X)" },
  { id: "Counselor - Professional (101YP2500X)", label: "Counselor - Professional (101YP2500X)" },
  { id: "Counselor - School (101YS0200X)", label: "Counselor - School (101YS0200X)" },
  { id: "Psychoanalyst (102L00000X)", label: "Psychoanalyst (102L00000X)" },
  { id: "Psychologist (103T00000X)", label: "Psychologist (103T00000X)" },
  { id: "Psychologist - Clinical (103TC0700X)", label: "Psychologist - Clinical (103TC0700X)" },
  { id: "Social Worker - Clinical (1041C0700X)", label: "Social Worker - Clinical (1041C0700X)" },
  { id: "Marriage & Family Therapist (106H00000X)", label: "Marriage & Family Therapist (106H00000X)" },
  { id: "Behavior Analyst (103K00000X)", label: "Behavior Analyst (103K00000X)" },
  { id: "Case Manager/Care Coordinator (171M00000X)", label: "Case Manager/Care Coordinator (171M00000X)" },
  { id: "Psychiatrist & Neurologist (2084P0800X)", label: "Psychiatrist & Neurologist (2084P0800X)" },
  { id: "Developmental Therapist (222Q00000X)", label: "Developmental Therapist (222Q00000X)" }
];

// Clinical services options
export const CLINICAL_SERVICES_OPTIONS = [
  { id: "Outpatient Psychiatric Treatment: Children", label: "Outpatient Psychiatric Treatment: Children" },
  { id: "Outpatient Psychiatric Treatment: Geriatric", label: "Outpatient Psychiatric Treatment: Geriatric" },
  { id: "Outpatient Psychiatric Treatment: Adult", label: "Outpatient Psychiatric Treatment: Adult" },
  { id: "Outpatient Psychiatric Treatment Adolescent", label: "Outpatient Psychiatric Treatment Adolescent" },
  { id: "Outpatient Substance Use Disorder Treatment: Geriatric", label: "Outpatient Substance Use Disorder Treatment: Geriatric" },
  { id: "Outpatient Substance Use Disorder Treatment: Adult", label: "Outpatient Substance Use Disorder Treatment: Adult" },
  { id: "Outpatient Substance Use Disorder Treatment: Youth", label: "Outpatient Substance Use Disorder Treatment: Youth" },
  { id: "Partial Hospitalization Program (PHP)", label: "Partial Hospitalization Program (PHP)" },
  { id: "Intensive Outpatient Program (IOP)", label: "Intensive Outpatient Program (IOP)" },
  { id: "Medication Management", label: "Medication Management" },
  { id: "Group Therapy", label: "Group Therapy" },
  { id: "Family Therapy", label: "Family Therapy" },
  { id: "Individual Counseling", label: "Individual Counseling" },
  { id: "Psychoeducation Services", label: "Psychoeducation Services" },
  { id: "Case Management", label: "Case Management" }
];

// Marital status options
export const MARITAL_STATUS_OPTIONS = [
  { id: "Single", label: "Single" },
  { id: "Married", label: "Married" },
  { id: "Divorced", label: "Divorced" },
  { id: "Widowed", label: "Widowed" },
  { id: "Separated", label: "Separated" },
  { id: "Other", label: "Other" }
];

// Telemedicine experience options
export const TELEMED_EXP_OPTIONS = [
  { id: "None", label: "None" },
  { id: "Some", label: "Some" },
  { id: "Extensive", label: "Extensive" }
];

// Language options
export const LANGUAGE_OPTIONS = [
  { id: "English", label: "English" },
  { id: "Spanish", label: "Spanish" },
  { id: "French", label: "French" },
  { id: "German", label: "German" },
  { id: "Chinese", label: "Chinese" },
  { id: "Other", label: "Other" }
];

// Mobile carrier options
export const MOBILE_CARRIER_OPTIONS = [
  { id: "AT&T", label: "AT&T" },
  { id: "Verizon", label: "Verizon" },
  { id: "T-Mobile", label: "T-Mobile" },
  { id: "Sprint", label: "Sprint" },
  { id: "Other", label: "Other" }
];

// Relationship options
export const RELATIONSHIP_OPTIONS = [
  { id: "Parent", label: "Parent" },
  { id: "Sibling", label: "Sibling" },
  { id: "Spouse", label: "Spouse" },
  { id: "Friend", label: "Friend" },
  { id: "Other", label: "Other" }
];

// US State options
export const US_STATE_OPTIONS = [
  { id: "AL", label: "AL" },
  { id: "AK", label: "AK" },
  { id: "AZ", label: "AZ" },
  { id: "AR", label: "AR" },
  { id: "CA", label: "CA" },
  { id: "CO", label: "CO" },
  { id: "CT", label: "CT" },
  { id: "DE", label: "DE" },
  { id: "FL", label: "FL" },
  { id: "GA", label: "GA" },
  { id: "HI", label: "HI" },
  { id: "ID", label: "ID" },
  { id: "IL", label: "IL" },
  { id: "IN", label: "IN" },
  { id: "IA", label: "IA" },
  { id: "KS", label: "KS" },
  { id: "KY", label: "KY" },
  { id: "LA", label: "LA" },
  { id: "ME", label: "ME" },
  { id: "MD", label: "MD" },
  { id: "MA", label: "MA" },
  { id: "MI", label: "MI" },
  { id: "MN", label: "MN" },
  { id: "MS", label: "MS" },
  { id: "MO", label: "MO" },
  { id: "MT", label: "MT" },
  { id: "NE", label: "NE" },
  { id: "NV", label: "NV" },
  { id: "NH", label: "NH" },
  { id: "NJ", label: "NJ" },
  { id: "NM", label: "NM" },
  { id: "NY", label: "NY" },
  { id: "NC", label: "NC" },
  { id: "ND", label: "ND" },
  { id: "OH", label: "OH" },
  { id: "OK", label: "OK" },
  { id: "OR", label: "OR" },
  { id: "PA", label: "PA" },
  { id: "RI", label: "RI" },
  { id: "SC", label: "SC" },
  { id: "SD", label: "SD" },
  { id: "TN", label: "TN" },
  { id: "TX", label: "TX" },
  { id: "UT", label: "UT" },
  { id: "VT", label: "VT" },
  { id: "VA", label: "VA" },
  { id: "WA", label: "WA" },
  { id: "WV", label: "WV" },
  { id: "WI", label: "WI" },
  { id: "WY", label: "WY" }
];

// Other specialties options
export const OTHER_SPECIALTIES_OPTIONS = [
  { id: "Pain Management", label: "Pain Management" },
  { id: "Sports Medicine", label: "Sports Medicine" },
  { id: "Geriatrics", label: "Geriatrics" },
  { id: "Sleep Medicine", label: "Sleep Medicine" },
  { id: "Palliative Care", label: "Palliative Care" },
  { id: "Infectious Disease", label: "Infectious Disease" },
  { id: "Genetics", label: "Genetics" },
  { id: "Occupational Medicine", label: "Occupational Medicine" },
  { id: "Preventive Medicine", label: "Preventive Medicine" },
  { id: "Rehabilitation Medicine", label: "Rehabilitation Medicine" },
  { id: "Other (please specify)", label: "Other (please specify)" }
];

// Classification options
export const CLASSIFICATION_OPTIONS = [
  { id: "Specialist", label: "Specialist" },
  { id: "Locum Tenens", label: "Locum Tenens" },
  { id: "Primary Care", label: "Primary Care" },
  { id: "Hospital-based", label: "Hospital-based" },
  { id: "Hospitalist", label: "Hospitalist" },
  { id: "PRN", label: "PRN" },
  { id: "New Hire", label: "New Hire" },
  { id: "Acquisition", label: "Acquisition" },
  { id: "Rehire", label: "Rehire" },
  { id: "Float Pool", label: "Float Pool" },
  { id: "Internal Transfer", label: "Internal Transfer" },
  { id: "Cross Credentialed", label: "Cross Credentialed" },
  { id: "Fellowship", label: "Fellowship" },
  { id: "Subspecialist", label: "Subspecialist" },
  { id: "Rotating", label: "Rotating" },
  { id: "Clinic Only", label: "Clinic Only" }
];

// CMS Medicare specialty code options
export const CMS_MEDICARE_SPECIALTY_OPTIONS = [
  { id: "CMS Code: CMS Desc - Taxonomy Desc (Taxonomy Code)", label: "CMS Code: CMS Desc - Taxonomy Desc (Taxonomy Code)" },
  { id: "Other", label: "Other" }
];

// Extended options for seeding scripts (includes more variety)
export const PROVIDER_TITLE_OPTIONS_EXTENDED = PROVIDER_TITLES.map(title => title.formatted_title);

export const PREFIX_OPTIONS_EXTENDED = [
  "Dr.", "Mr.", "Mrs.", "Ms.", "Mx.", "Prof.", "Rev.", "Sr.", "Fr.", "Hon.", "Other"
];

export const SUFFIX_OPTIONS_EXTENDED = [
  "Jr.", "Sr.", "II", "III", "IV", "V", "MD", "DO", "PhD", "Esq.", "Other"
];

export const SPECIALTY_OPTIONS_EXTENDED = [
  "Abdominal Imaging", "Acupuncture", "Acute Care Imaging", "Acute Care Nurse Practitioner", 
  "Acute Registered Nurse", "Addiction (Substance Use Disorder)", "Adolescent Medicine", 
  "Adult Medicine", "Allergy and Immunology", "Anesthesiology", "Bariatric Medicine", 
  "Breast Surgery", "Burn Surgery", "Cardiology", "Cardiothoracic Surgery", "Pediatrics", 
  "Acute Care", "Aerospace Medicine", "Critical Care Medicine", "Dermatology"
];

export const LANGUAGE_OPTIONS_EXTENDED = [
  "English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Arabic", 
  "Russian", "Portuguese", "Italian", "Dutch", "Other"
];
