import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to extract title acronym from formatted title
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

// Utility function to generate provider name in "First Last" format
export const generateProviderName = (provider?: any, row?: any): string => {
  console.log("=== generateProviderName DEBUG ===");
  console.log("provider:", provider);
  console.log("row:", row);
  
  if (provider) {
    // Use provider object if available
    const firstName = provider.first_name || '';
    const lastName = provider.last_name || '';
    const result = [firstName, lastName].filter(Boolean).join(' ');
    console.log("Using provider object, result:", result);
    console.log("=== END generateProviderName DEBUG ===");
    return result;
  } else if (row) {
    // Fallback to row data
    const result = row.provider_name || '';
    console.log("Using row data, result:", result);
    console.log("=== END generateProviderName DEBUG ===");
    return result;
  }
  console.log("No data available, returning empty string");
  console.log("=== END generateProviderName DEBUG ===");
  return '';
};

// Test cases for generateProviderName:
// generateProviderName({ first_name: "John", last_name: "Doe" }) -> "John Doe"
// generateProviderName({ first_name: "John" }) -> "John"
// generateProviderName({ last_name: "Doe" }) -> "Doe"
// generateProviderName({}, { provider_name: "Dr. John Doe" }) -> "Dr. John Doe"
// generateProviderName() -> ""
