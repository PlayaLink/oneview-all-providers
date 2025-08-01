import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faUserDoctor,
  faHome,
  faAddressBook,
  faFileMedical,
  faBook,
  faPlay,
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
// Only including icons that are actually used in the codebase
const iconMap: Record<string, IconDefinition> = {
  // Grid and tab icons
  "bars-staggered": faBarsStaggered,
  "comment": faComment,
  "file-lines": faFileLines,
  "users": faUsers,
  "hospital": faHospital,
  "folder": faFolder,
  "file-medical": faFileMedical,
  "note-sticky": faComment, // Using faComment as alternative for note-sticky
  "house-chimney": faHome,
  
  // Action icons from database
  "plus": faPlus,
  "external-link-alt": faExternalLinkAlt,
  "id-card": faIdCard,
  "filter-circle-xmark": faFilterCircleXmark,
  "rotate": faRotate,
  "unlock": faUnlock,
  "bell": faBell,
  "bell-slash": faBellSlash,
  "copy": faCopy,
  "circle-down": faCircleDown,
  "flag": faFlag,
  "ellipsis-vertical": faEllipsisVertical,
  "circle-exclamation": faCircleExclamation,
  "sidebar": faColumns,
  
  // Legacy action icon names (from database)
  "faCircleDown": faCircleDown,
  "faPaperclip": faPaperclip,
  "faBell": faBell,
  "faTable": faTable,
  "faFlag": faFlag,
  "faTimes": faTimes,
  "faToggleOn": faToggleOn,
  "faToggleOff": faToggleOff,
  "faStar": faStar,
  "faShieldCheck": faShieldHalved,
  
  // Additional action icons
  "circle-plus": faCirclePlus,
  "circle-xmark": faCircleXmark,
  "sidebar-flip": faBars,
  "star-half-stroke": faStarHalf,
  "shield-check": faShieldHalved,
  "pen-to-square": faPenToSquare,
  
  // Legacy icons (keeping for backward compatibility)
  "user-doctor": faUserDoctor,
  "address-book": faAddressBook,
  "book-atlas": faBook,
  "triangle": faPlay,
  "shield-halved": faShieldHalved,
  "clipboard-prescription": faClipboard,
  "prescription": faClipboard,
  "clipboard-list-check": faClipboardList,
  "badge-check": faCheckCircle,
  "file-certificate": faCertificate,
  "heartbeat": faHeartbeat,
  "university": faUniversity,
  "book-medical": faBookMedical,
  "building-user": faBuilding,
  "hospital-symbol": faHospital,
  "briefcase-medical": faBriefcase,
  "people-arrows": faUserGroup,
  "medal": faMedal,
  "gavel": faGavel,
  "folder-download": faFolder,
  "file-import": faFileImport,
  "seal-exclamation": faExclamationTriangle,
  "ranking-star": faStar,
  "file-export": faFileExport,
  "sensor-fire": faFire,
  "key": faKey,
  "wallet": faWallet,
  "siren-on": faVolumeHigh,
  "clock": faClock,
  "ellipsis": faEllipsis,
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
