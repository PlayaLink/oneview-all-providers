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
  faPaperclip,
  faTimes,
  faToggleOn,
  faToggleOff,
  faCirclePlus,
  faCircleXmark,
  faBars,
  faStarHalf,
  faPenToSquare,
  faComment,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";

// Custom SVG icons mapping
const customIcons: Record<string, string> = {
  "sidebar-flip": "/icons/sidebar-flip.svg",
};

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
  // Action icons
  "faCircleDown": faCircleDown,
  "faPaperclip": faPaperclip,
  "faBell": faBell,
  "faTable": faTable,
  "faFlag": faFlag,
  "faTimes": faTimes,
  "faToggleOn": faToggleOn,
  "faToggleOff": faToggleOff,
  "faStar": faStar,
  "faShieldCheck": faShieldHalved, // Using faShieldHalved as alternative for faShieldCheck
  // Action icons from database
  "circle-plus": faCirclePlus,
  "circle-xmark": faCircleXmark,
  "sidebar-flip": faBars,
  "star-half-stroke": faStarHalf,
  "shield-check": faShieldHalved,
  "pen-to-square": faPenToSquare,
  comment: faComment,
  "file-lines": faFileLines,
};

// Function to get icon (FontAwesome or custom SVG path) from icon name
export const getIconByName = (iconName: string): IconDefinition | string => {
  // First check if it's a custom SVG icon
  if (iconName in customIcons) {
    return customIcons[iconName];
  }
  
  // Fall back to FontAwesome icons
  return iconMap[iconName] || faTable;
};

// Function to check if an icon is a custom SVG icon
export const isCustomIcon = (iconName: string): boolean => {
  return iconName in customIcons;
};

// Export the icon map for other uses
export { iconMap };
