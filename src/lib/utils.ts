import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generic utility function to extract title acronym from formatted title
// This is a fallback for grids that don't have their own title mapping
export const extractTitleAcronym = (formattedTitle: string): string => {
  if (!formattedTitle) return '';
  
  // Extract acronym from the format "ACRONYM - Full Title"
  const match = formattedTitle.match(/^([A-Z]+)\s*-\s*(.+)$/);
  if (match) {
    return match[1].trim();
  }
  
  // If no pattern matches, return the original string
  return formattedTitle;
};

// Test cases for extractTitleAcronym:
// extractTitleAcronym("MD - Medical Doctor") -> "MD"
// extractTitleAcronym("DO - Osteopathic Doctor") -> "DO"
// extractTitleAcronym("NP - Nurse Practitioner") -> "NP"
// extractTitleAcronym("PA - Physician Assistant") -> "PA"
// extractTitleAcronym("LCSW - Licensed Clinical Social Worker") -> "LCSW"
// extractTitleAcronym("Just a title without acronym") -> "Just a title without acronym"
// extractTitleAcronym("") -> ""
// extractTitleAcronym(null) -> ""
