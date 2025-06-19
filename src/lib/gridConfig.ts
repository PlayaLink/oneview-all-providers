import { ColDef } from "ag-grid-community";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
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

// Sample data - can be reused across all grids
export const sampleProviders = [
  {
    id: "1",
    firstName: "Sofia",
    lastName: "García",
    title: "MD",
    primarySpecialty: "Acupuncture",
    npiNumber: "1477552867",
    workEmail: "michelle.rivera@example.com",
    personalEmail: "alma.lawson@example.com",
    mobilePhone: "(225) 555-0118",
    tags: ["Team A", "1099", "Green", "Expired"],
    lastUpdated: "2017-12-04",
  },
  {
    id: "2",
    firstName: "Tom",
    lastName: "Petty",
    title: "MD",
    primarySpecialty: "General Surgery",
    npiNumber: "1841384468",
    workEmail: "tom.petty@healthspace.com",
    personalEmail: "tom.petty@gmail.com",
    mobilePhone: "(555) 123-4567",
    tags: ["Team A", "Team C", "Texas"],
    lastUpdated: "2024-01-15",
  },
  {
    id: "3",
    firstName: "Sarah",
    lastName: "Johnson",
    title: "MD",
    primarySpecialty: "Cardiology",
    npiNumber: "1234567890",
    workEmail: "sarah.johnson@healthspace.com",
    personalEmail: "sarah.j@gmail.com",
    mobilePhone: "(555) 234-5678",
    tags: ["Team B", "California"],
    lastUpdated: "2024-01-14",
  },
];

// Standard column definitions that can be reused
export const standardColumns: ColDef[] = [
  {
    headerName: "Provider Name",
    valueGetter: (params) =>
      `${params.data.lastName}, ${params.data.firstName}`,
    width: 200,
  },
  {
    headerName: "Title",
    field: "title",
    width: 120,
  },
  {
    headerName: "Specialty",
    field: "primarySpecialty",
    width: 200,
  },
  {
    headerName: "NPI #",
    field: "npiNumber",
    width: 140,
  },
  {
    headerName: "Work Email",
    field: "workEmail",
    width: 250,
  },
  {
    headerName: "Personal Email",
    field: "personalEmail",
    width: 250,
  },
  {
    headerName: "Mobile Phone",
    field: "mobilePhone",
    width: 145,
  },
  {
    headerName: "Tags",
    field: "tags",
    width: 200,
    valueFormatter: (params) => {
      return params.value && Array.isArray(params.value)
        ? params.value.join(", ")
        : "";
    },
  },
  {
    headerName: "Last Updated",
    field: "lastUpdated",
    width: 120,
  },
];

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

  // Actions & Exclusions Section
  {
    key: "event-log",
    title: "Event log",
    icon: faClipboardList,
    section: "actionsExclusions",
  },
  {
    key: "oig",
    title: "OIG",
    icon: faCheckCircle,
    section: "actionsExclusions",
  },

  // Certifications Section
  {
    key: "board-certifications",
    title: "Board Certifications",
    icon: faCertificate,
    section: "certifications",
  },
  {
    key: "other-certifications",
    title: "Other Certifications",
    icon: faHeartbeat,
    section: "certifications",
  },

  // Education & Training Section
  {
    key: "education-training",
    title: "Education & Training",
    icon: faUniversity,
    section: "educationTraining",
  },
  { key: "exams", title: "Exams", icon: faBook, section: "educationTraining" },

  // Work Experience Section
  {
    key: "practice-employer",
    title: "Practice/Employer",
    icon: faBuilding,
    section: "workExperience",
  },
  {
    key: "facility-affiliations",
    title: "Facility Affiliations",
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
