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
export const generateProviderName = (provider?: any): string => {
  if (!provider) {
    throw new Error('generateProviderName: Provider object is required');
  }
  
  const firstName = provider.first_name || '';
  const lastName = provider.last_name || '';
  return [firstName, lastName].filter(Boolean).join(' ');
};

// Test cases for generateProviderName:
// generateProviderName({ first_name: "John", last_name: "Doe" }) -> "John Doe"
// generateProviderName({ first_name: "John" }) -> "John"
// generateProviderName({ last_name: "Doe" }) -> "Doe"
// generateProviderName() -> throws Error: "Provider object is required"

// Reusable helper function for default header text generation
export const generateDefaultHeaderText = ({ gridName, provider, isCreateMode }: { gridName: string; provider?: any; isCreateMode?: boolean }): string => {
  const prefix = isCreateMode ? 'Create new ' : '';
  // Convert grid name to Capital Case and replace underscores with spaces
  const displayName = (gridName || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (!provider) {
    return `${prefix}${displayName} record`.trim();
  }
  
  const name = generateProviderName(provider);
  const title = extractTitleAcronym(provider.title || '');
  return `${prefix}${displayName} record for ${name} ${title}`.trim();
};

// Test cases for generateDefaultHeaderText:
// generateDefaultHeaderText({ gridName: "Provider Info", provider: { first_name: "John", last_name: "Doe", title: "MD - Medical Doctor" } }) -> "Provider Info for John Doe MD"
// generateDefaultHeaderText({ gridName: "Birth Info", provider: { first_name: "John", last_name: "Doe", title: "DO - Osteopathic Doctor" } }) -> "Birth Info for John Doe DO"
// generateDefaultHeaderText({ gridName: "Provider Info" }) -> "Provider Info"
