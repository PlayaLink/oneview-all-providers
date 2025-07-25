import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faUserDoctor,
  faWeightScale,
  faHome,
  faAddressBook,
  faFileMedical,
  faBook,
  faPlay,
  faShieldAlt,
  faShieldHalved,
  faClipboard,
  faClipboardList,
  faCheckCircle,
  faCertificate,
  faHeartbeat,
  faUniversity,
  faBookMedical,
  faBuilding,
  faHospital,
  faBriefcase,
  faUserGroup,
  faUsers,
  faMedal,
  faGavel,
  faFolder,
  faFileImport,
  faTable,
  faExclamationTriangle,
  faStar,
  faFileExport,
  faFire,
  faKey,
  faWallet,
  faVolumeHigh,
  faClock,
  faBarsStaggered,
  faEllipsis,
  faPlus,
  faExternalLinkAlt,
  faIdCard,
  faFilterCircleXmark,
  faRotate,
  faUnlock,
  faBell,
  faBellSlash,
  faCopy,
  faCircleDown,
  faFlag,
  faEllipsisVertical,
  faCircleExclamation,
  faColumns,
} from "@fortawesome/free-solid-svg-icons";

// Icon mapping from string names to FontAwesome icon objects
const iconMap: Record<string, IconDefinition> = {
  "user-doctor": faUserDoctor,
  weight: faWeightScale,
  "house-chimney": faHome,
  "address-book": faAddressBook,
  "file-medical": faFileMedical,
  "book-atlas": faBook,
  triangle: faPlay, // Using faPlay as triangle alternative
  "shield-halved": faShieldHalved,
  "clipboard-prescription": faClipboard,
  prescription: faClipboard,
  "clipboard-list-check": faClipboardList,
  "badge-check": faCheckCircle, // Using faCheckCircle as alternative
  "file-certificate": faCertificate,
  heartbeat: faHeartbeat,
  university: faUniversity,
  "book-medical": faBookMedical,
  "building-user": faBuilding,
  "hospital-symbol": faHospital,
  "briefcase-medical": faBriefcase, // Using faBriefcase as alternative
  "people-arrows": faUserGroup, // Using faUserGroup as alternative
  users: faUsers,
  medal: faMedal,
  gavel: faGavel,
  folder: faFolder,
  "folder-download": faFolder,
  "file-import": faFileImport,
  "seal-exclamation": faExclamationTriangle, // Using faExclamationTriangle as alternative
  "ranking-star": faStar, // Using faStar as alternative
  "file-export": faFileExport,
  "sensor-fire": faFire, // Using faFire as alternative
  key: faKey,
  wallet: faWallet,
  "siren-on": faVolumeHigh, // Using faVolumeHigh as alternative
  clock: faClock,
  "bars-staggered": faBarsStaggered,
  ellipsis: faEllipsis,
  // Context menu icons
  plus: faPlus,
  "external-link-alt": faExternalLinkAlt,
  "id-card": faIdCard,
  "filter-circle-xmark": faFilterCircleXmark,
  rotate: faRotate,
  unlock: faUnlock,
  bell: faBell,
  "bell-slash": faBellSlash,
  copy: faCopy,
  "circle-down": faCircleDown,
  flag: faFlag,
  "ellipsis-vertical": faEllipsisVertical,
  "circle-exclamation": faCircleExclamation,
  sidebar: faColumns,
};

// Function to get FontAwesome icon from icon name
export const getIconByName = (iconName: string): IconDefinition => {
  return iconMap[iconName] || faTable; // fallback to table icon
};

// Export the icon map for other uses
export { iconMap };
