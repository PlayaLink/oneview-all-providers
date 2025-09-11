// AdditionalNamesSelectInputOptions.ts
// Dropdown options for Additional Names grid

// Type options for additional names
export const TYPE_OPTIONS = [
  { value: "Alternate Supervisor Name", label: "Alternate Supervisor Name" },
  { value: "Authorized Signer", label: "Authorized Signer" },
  { value: "Autonomous Supervisor Name", label: "Autonomous Supervisor Name" },
  { value: "Credentialing", label: "Credentialing" },
  { value: "Division President", label: "Division President" },
  { value: "Practice Administrator", label: "Practice Administrator" },
  { value: "Other Name", label: "Other Name" }
];

// Extended options for seeding scripts (includes more variety)
export const TYPE_OPTIONS_EXTENDED = [
  "Alternate Supervisor Name",
  "Authorized Signer", 
  "Autonomous Supervisor Name",
  "Credentialing",
  "Division President",
  "Practice Administrator",
  "Other Name",
  "Maiden Name",
  "Nickname",
  "Preferred Name",
  "Legal Name",
  "Business Name"
];

// Common professional titles
export const TITLE_OPTIONS = [
  { value: "MD", label: "MD" },
  { value: "DO", label: "DO" },
  { value: "PA", label: "PA" },
  { value: "NP", label: "NP" },
  { value: "RN", label: "RN" },
  { value: "LPN", label: "LPN" },
  { value: "PharmD", label: "PharmD" },
  { value: "DDS", label: "DDS" },
  { value: "DMD", label: "DMD" },
  { value: "PhD", label: "PhD" },
  { value: "MSN", label: "MSN" },
  { value: "BSN", label: "BSN" }
];

// Extended title options for seeding
export const TITLE_OPTIONS_EXTENDED = [
  "MD", "DO", "PA", "NP", "RN", "LPN", "PharmD", "DDS", "DMD", "PhD", "MSN", "BSN",
  "DVM", "OD", "DC", "PT", "OT", "RT", "MT", "MLT", "CNA", "MA", "LVN", "ADN"
];

// Common tags for additional names
export const TAG_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Unverified" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "legal", label: "Legal" },
  { value: "preferred", label: "Preferred" }
];

// Extended tag options for seeding
export const TAG_OPTIONS_EXTENDED = [
  "active", "inactive", "verified", "unverified", "primary", "secondary", 
  "legal", "preferred", "maiden", "nickname", "business", "professional"
];
