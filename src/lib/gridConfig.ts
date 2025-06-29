import { ColDef } from "ag-grid-community";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
// Fixed export issues - updated 2025
import {
  faUserDoctor,
  faWeight,
  faHouse,
  faAddressBook,
  faPlay,
  faFileMedical,
  faShieldAlt,
  faClipboard,
  faPills,
  faClipboardList,
  faCheckCircle,
  faCertificate,
  faHeartbeat,
  faUniversity,
  faBook,
  faBuilding,
  faHospital,
  faBriefcase,
  faUserGroup,
  faMedal,
  faGavel,
  faFolder,
  faFileArrowUp,
} from "@fortawesome/free-solid-svg-icons";

// Sample State Licenses data
export const sampleStateLicenses = [
  {
    id: "1",
    providerName: "Dr. Sarah Johnson",
    title: "MD",
    specialty: "Internal Medicine",
    licenseType: "Medical Doctor",
    license: "MD12345678",
    additionalInfo: "Full License",
    state: "CA",
    status: "Active",
    issueDate: "2018-03-15",
    expDate: "2024-03-15",
    expiresWithin: "90+ days",
    lastUpdated: "2023-12-01",
  },
  {
    id: "2",
    providerName: "Dr. Michael Chen",
    title: "DO",
    specialty: "Cardiology",
    licenseType: "Osteopathic Physician",
    license: "DO87654321",
    additionalInfo: "Restricted - Hospital Only",
    state: "NY",
    status: "Active",
    issueDate: "2019-07-22",
    expDate: "2024-07-22",
    expiresWithin: "180+ days",
    lastUpdated: "2023-11-15",
  },
  {
    id: "3",
    providerName: "Dr. Emily Rodriguez",
    title: "MD",
    specialty: "Pediatrics",
    licenseType: "Medical Doctor",
    license: "MD11223344",
    additionalInfo: "Full License",
    state: "TX",
    status: "Active",
    issueDate: "2020-01-10",
    expDate: "2025-01-10",
    expiresWithin: "1 year+",
    lastUpdated: "2023-12-10",
  },
  {
    id: "4",
    providerName: "Dr. James Wilson",
    title: "MD",
    specialty: "Emergency Medicine",
    licenseType: "Medical Doctor",
    license: "MD55667788",
    additionalInfo: "Full License",
    state: "FL",
    status: "Pending Renewal",
    issueDate: "2017-09-05",
    expDate: "2024-01-30",
    expiresWithin: "30 days",
    lastUpdated: "2023-12-15",
  },
  {
    id: "5",
    providerName: "Dr. Lisa Thompson",
    title: "NP",
    specialty: "Family Practice",
    licenseType: "Nurse Practitioner",
    license: "NP99887766",
    additionalInfo: "Advanced Practice",
    state: "CO",
    status: "Active",
    issueDate: "2021-04-18",
    expDate: "2024-04-18",
    expiresWithin: "120 days",
    lastUpdated: "2023-11-28",
  },
];

// Sample data - healthcare providers with birth info
export const sampleProviders = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "MD",
    specialty: "Internal Medicine",
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567",
    status: "Active",
    lastUpdated: "2023-12-01",
    birthDate: "1985-03-15",
    birthPlace: "Los Angeles, CA",
    citizenship: "US Citizen",
    ssn: "***-**-1234",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    title: "DO",
    specialty: "Cardiology",
    email: "michael.chen@example.com",
    phone: "(555) 234-5678",
    status: "Active",
    lastUpdated: "2023-11-28",
    birthDate: "1982-07-22",
    birthPlace: "San Francisco, CA",
    citizenship: "US Citizen",
    ssn: "***-**-5678",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    title: "MD",
    specialty: "Pediatrics",
    email: "emily.rodriguez@example.com",
    phone: "(555) 345-6789",
    status: "Active",
    lastUpdated: "2023-12-10",
    birthDate: "1988-01-10",
    birthPlace: "Houston, TX",
    citizenship: "US Citizen",
    ssn: "***-**-9012",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    title: "MD",
    specialty: "Emergency Medicine",
    email: "james.wilson@example.com",
    phone: "(555) 456-7890",
    status: "Pending",
    lastUpdated: "2023-12-15",
    birthDate: "1980-09-05",
    birthPlace: "Miami, FL",
    citizenship: "US Citizen",
    ssn: "***-**-3456",
  },
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    title: "NP",
    specialty: "Family Practice",
    email: "lisa.thompson@example.com",
    phone: "(555) 567-8901",
    status: "Active",
    lastUpdated: "2023-11-25",
    birthDate: "1990-04-18",
    birthPlace: "Denver, CO",
    citizenship: "US Citizen",
    ssn: "***-**-7890",
  },
];

// Re-export columns from the new dynamic system for backward compatibility
export { standardColumns, birthInfoColumns } from "./columnConfigs";

// Grid configuration interface
export interface Grid {
  key: string;
  title: string;
  icon: IconDefinition;
  section: string;
}

// All grid definitions
const grids: Grid[] = [
  // Provider Info Section
  {
    key: "provider-info",
    title: "Provider Info",
    icon: faUserDoctor,
    section: "providerInfo",
  },
  {
    key: "birth-info",
    title: "Birth Info",
    icon: faWeight,
    section: "providerInfo",
  },
  {
    key: "addresses",
    title: "Addresses",
    icon: faHouse,
    section: "providerInfo",
  },
  {
    key: "additional-names",
    title: "Additional Names",
    icon: faAddressBook,
    section: "providerInfo",
  },
  { key: "caqh", title: "CAQH", icon: faPlay, section: "providerInfo" },
  {
    key: "health-info",
    title: "Health Info",
    icon: faFileMedical,
    section: "providerInfo",
  },

  // Licensure Section
  {
    key: "state-licenses",
    title: "State Licenses",
    icon: faShieldAlt,
    section: "licensure",
  },
  {
    key: "dea-licenses",
    title: "DEA Licenses",
    icon: faClipboard,
    section: "licensure",
  },
  {
    key: "controlled-substance-licenses",
    title: "State Controlled Substance Licenses",
    icon: faPills,
    section: "licensure",
  },

  // Certifications Section
  {
    key: "board-certifications",
    title: "Board Certifications",
    icon: faClipboardList,
    section: "certifications",
  },
  {
    key: "cpr-certifications",
    title: "CPR Certifications",
    icon: faCheckCircle,
    section: "certifications",
  },

  // Training Section
  {
    key: "malpractice-training",
    title: "Malpractice Training",
    icon: faCertificate,
    section: "training",
  },
  {
    key: "cme-training",
    title: "CME Training",
    icon: faHeartbeat,
    section: "training",
  },

  // Education Section
  {
    key: "education-training",
    title: "Education & Training",
    icon: faUniversity,
    section: "educationTraining",
  },
  {
    key: "medical-school",
    title: "Medical School",
    icon: faUniversity,
    section: "education",
  },
  {
    key: "undergraduate",
    title: "Undergraduate",
    icon: faBook,
    section: "education",
  },

  // Work Experience Section
  {
    key: "hospital-affiliations",
    title: "Hospital Affiliations",
    icon: faBuilding,
    section: "workExperience",
  },
  {
    key: "clinic-affiliations",
    title: "Clinic Affiliations",
    icon: faHospital,
    section: "workExperience",
  },
  {
    key: "work-history",
    title: "Work History",
    icon: faBriefcase,
    section: "workExperience",
  },
  {
    key: "peer-references",
    title: "Peer References",
    icon: faUserGroup,
    section: "workExperience",
  },
  {
    key: "military-experience",
    title: "Military Experience",
    icon: faMedal,
    section: "workExperience",
  },

  // Malpractice Insurance Section
  {
    key: "malpractice-insurance",
    title: "Malpractice Insurance",
    icon: faGavel,
    section: "malpracticeInsurance",
  },

  // Documents Section
  {
    key: "documents",
    title: "Documents",
    icon: faFolder,
    section: "documents",
  },
  {
    key: "sent-forms",
    title: "Sent Forms",
    icon: faFileArrowUp,
    section: "documents",
  },
];

// Grid configuration utility class
export class GridConfig {
  static findGridByKey(key: string): Grid | undefined {
    return grids.find((grid) => grid.key === key);
  }

  static getGridsBySection(section: string): Grid[] {
    return grids.filter((grid) => grid.section === section);
  }

  static getAllGrids(): Grid[] {
    return grids;
  }
}

// Export the grids array as well for direct access
export { grids };
