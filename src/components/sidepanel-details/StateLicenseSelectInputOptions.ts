/**
 * State License Select Input Options
 * 
 * This file contains all dropdown options for State License forms.
 * It serves as a single source of truth for options used in:
 * - StateLicenseDetails.tsx
 * - StateLicenseDetailsWide.tsx
 * - seed-state-licenses.ts
 */

export const STATE_OPTIONS = [
  "ALLL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export const LICENSE_TYPE_OPTIONS = [
  "MD - Medical Doctor",
  "DO - Doctor of Osteopathic Medicine",
  "NP - Nurse Practitioner",
  "PA - Physician Assistant",
  "RN - Registered Nurse",
  "LPN - Licensed Practical Nurse",
  "CRNA - Certified Registered Nurse Anesthetist",
  "DPM - Doctor of Podiatric Medicine",
  "DDS - Doctor of Dental Surgery",
  "DMD - Doctor of Dental Medicine"
];

export const STATUS_OPTIONS = [
  "Active", "Expired", "Pending", "Suspended", "Revoked"
];

export const YES_NO_OPTIONS = ["Yes", "No"];

export const TAG_OPTIONS = [
  "urgent", "expiring", "renewal", "compliance", "audit", "pending", "primary", "secondary"
];

// Extended status options used in seeding scripts (more realistic variety)
export const EXTENDED_STATUS_OPTIONS = [
  // Active statuses
  "Active (probation completed)",
  "Active (Subject To Restrictions)",
  "Active (Subject to Restrictions) *",
  "Active (suspension completed)",
  "Active - Consent Order",
  "Active - Current",
  "Active - Do Not Renew",
  "Active - Fee Exempt",
  "Active - Fully Licensed",
  "Active - In Late Renewal",
  "Active - In Renewal",
  "Active - Not Practicing",
  "Active - One Year",
  "Active - One Year With Distinguished Professor Limitation",
  "Active - Pending DEA",
  "Active - Pending Renewal",
  "Active - Prescribing",
  "Active - Prior Discipline",
  "Active - Pro Bono",
  // Other statuses
  "Semi-Active",
  "Senior Active",
  "Special Emeritus Certification",
  "Special Status",
  "Suspension Completed",
  "Telemedicine",
  "Telemedicine Active",
  "Telemonitoring Active",
  "Teleradiology Active",
  "Temporary",
  "Temporary Approval",
  "Temporary License",
  "Temporary Permit",
  "Texas License Issued",
  "Timely Renewal",
  "Trainee/Student",
  "Unencumbered (full unrestricted license to practice)",
  "Unlimited",
  "Valid",
  // Cancelled statuses
  "Canc Non-Payment",
  "Canceled",
  "Cancelled",
  "Cancelled (board request)",
  "Cancelled (by request)",
  "Cancelled (considered)",
  "Cancelled (did not renew)",
  "Cancelled (non payment)",
  "Cancelled - Deceased",
  "Cancelled - Failure to Renew",
  "Cancelled - Requested",
  "Cancelled by Entity",
  "Cancelled by Request",
  "Cancelled Inactive",
  "Cancelled Nonpayment",
  "Cancelled Permit",
  "Cancelled, Did Not Renew"
];

// License type options used in seeding scripts (shorter format)
export const SEEDING_LICENSE_TYPE_OPTIONS = [
  "MD", "DO", "NP", "PA", "RN", "LPN", "CRNA", "DPM", "DDS", "DMD"
];
