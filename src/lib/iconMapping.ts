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

// Unified icon mapping that can contain either FontAwesome icons or SVG file paths
// When you get access to premium FontAwesome icons, just replace the SVG paths with the IconDefinition
const iconMap: Record<string, IconDefinition | string> = {
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
  "star-half-stroke": faStarHalf,
  "shield-check": faShieldHalved,
  "pen-to-square": faPenToSquare,
  
  // Premium FontAwesome icons (currently using custom SVG, replace with IconDefinition when available)
  "sidebar-flip": "/icons/sidebar-flip.svg",
  
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

// Function to get icon (FontAwesome or SVG path) from icon name
export const getIconByName = (iconName: string): IconDefinition | string => {
  return iconMap[iconName] || faTable;
};

// Function to check if an icon is a custom SVG icon (returns a string path)
export const isCustomIcon = (iconName: string): boolean => {
  const icon = iconMap[iconName];
  return typeof icon === 'string' && icon.startsWith('/');
};

// Export the icon map for other uses
export { iconMap };
