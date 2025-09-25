import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faUserDoctor,
  faWeightScale,
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
  faCirclePlus,
  faCircleXmark,
  faStarHalf,
  faPenToSquare,
  faComment,
  faFileLines,
  faChevronUp,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faUser,
  faXmark,
  faUpload,
  faCaretDown,
  faCheck,
  faListCheck,
  faUserPlus,
  faSearch,
  faUpRightAndDownLeftFromCenter,
  faDownLeftAndUpRightToCenter,
  faTrash,
  faStickyNote,
  faCode,
  faPrescription,
  faHouseChimneyUser,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

// Unified icon mapping that can contain either FontAwesome icons or SVG file paths
// When you get access to premium FontAwesome icons, just replace the SVG paths with the IconDefinition
const iconMap: Record<string, IconDefinition | string> = {
  // Provider and medical icons
  "user-doctor": faUserDoctor,
  weight: faWeightScale,
  "house-chimney": faHome,
  "house-chimney-user": faHouseChimneyUser,
  "address-book": faAddressBook,
  "file-medical": faFileMedical,
  "book-atlas": faBook,
  triangle: faPlay, // Using faPlay as triangle alternative
  "shield-halved": faShieldHalved,
  "clipboard-prescription": faClipboard,
  prescription: faPrescription,
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
  
  // Action and UI icons
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
  paperclip: faPaperclip,
  "circle-plus": faCirclePlus,
  "circle-xmark": faCircleXmark,
  "circle-x": faCircleXmark, // Alias for circle-xmark
  "star-half-stroke": faStarHalf,
  "shield-check": faShieldHalved,
  "pen-to-square": faPenToSquare,
  comment: faComment,
  "comment-plus": faComment, // Using faComment as base, will combine with plus in component
  "file-lines": faFileLines,
  "sticky-note": faStickyNote,
  code: faCode,
  
  // Navigation and UI icons
  "chevron-up": faChevronUp,
  "chevron-down": faChevronDown,
  "chevron-left": faChevronLeft,
  "chevron-right": faChevronRight,
  "clipboard": faClipboard,
  "user": faUser,
  "xmark": faXmark,
  "times-circle": faTimesCircle,
  "times": faXmark, // Alias for xmark
  "upload": faUpload,
  "caret-down": faCaretDown,
  "check": faCheck,
  "list-check": faListCheck,
  "user-plus": faUserPlus,
  "search": faSearch,
  "up-right-and-down-left-from-center": faUpRightAndDownLeftFromCenter,
  "expand": faUpRightAndDownLeftFromCenter, // Alias for expand
  "down-left-and-up-right-to-center": faDownLeftAndUpRightToCenter,
  "collapse": faDownLeftAndUpRightToCenter, // Alias for collapse
  
  // Delete and trash icons
  "trash": faTrash,
  "trash-can": faTrash, // Alias for trash
  "delete": faTrash, // Alias for trash
  
  // Toggle icons
  "toggle-on": "/icons/toggle-on.svg",
  "toggle-off": "/icons/toggle-off.svg",

  // File export icons (using file-export as fallback for free FontAwesome)
  "file-excel": faFileExport,
  "file-csv": faFileExport,
  "file-pdf": faFileExport,

  // Premium FontAwesome icons (currently using custom SVG, replace with IconDefinition when available)
  "sidebar-flip": "/icons/sidebar-flip.svg",
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
