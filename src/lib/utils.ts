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
export const generateDefaultHeaderText = ({ gridKey, provider, isCreateMode }: { gridKey: string; provider?: any; isCreateMode?: boolean }): string => {
  const prefix = isCreateMode ? 'Create new ' : '';
  // Convert grid key to Capital Case and replace underscores with spaces
  const rawDisplayName = (gridKey || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Singularize helper for phrases (operate on the last word, with exceptions)
  const singularizePhrase = (phrase: string): string => {
    const exceptions: Record<string, string> = {
      'state licenses': 'State License',
      'addresses': 'Address',
      'facility affiliations': 'Facility Affiliation',
      'facility properties': 'Facility Property',
      'facility property values': 'Facility Property Value',
      'facility requirements': 'Facility Requirement',
      'facility requirement values': 'Facility Requirement Value',
      'requirements': 'Requirement',
      'requirement data': 'Requirement Data',
      'contacts': 'Contact',
      'notes': 'Note',
      'documents': 'Document',
      'providers': 'Provider',
      'provider info': 'Provider',
      'birth info': 'Birth Info'
    };

    const lower = phrase.toLowerCase();
    if (exceptions[lower]) return exceptions[lower];

    const parts = phrase.split(' ');
    const last = parts[parts.length - 1];
    let singular = last;
    if (/.*ies$/i.test(last)) {
      singular = last.replace(/ies$/i, 'y');
    } else if (/.*ses$/i.test(last) || /.*xes$/i.test(last) || /.*zes$/i.test(last) || /.*ches$/i.test(last) || /.*shes$/i.test(last)) {
      singular = last.replace(/es$/i, '');
    } else if (/.*s$/i.test(last) && !/.*ss$/i.test(last)) {
      singular = last.replace(/s$/i, '');
    }
    parts[parts.length - 1] = singular;
    return parts.join(' ');
  };

  const displayName = singularizePhrase(rawDisplayName);

  if (!provider) {
    return `${prefix}${displayName}`;
  }
  
  const name = generateProviderName(provider);
  const title = extractTitleAcronym(provider.title || '');
  return `${prefix}${displayName} for ${name} ${title}`.trim();
};

// Test cases for generateDefaultHeaderText:
// generateDefaultHeaderText({ gridKey: "provider_info", provider: { first_name: "John", last_name: "Doe", title: "MD - Medical Doctor" } }) -> "Provider Info for John Doe MD"
// generateDefaultHeaderText({ gridKey: "birth_info", provider: { first_name: "John", last_name: "Doe", title: "DO - Osteopathic Doctor" } }) -> "Birth Info for John Doe DO"
// generateDefaultHeaderText({ gridKey: "provider_info" }) -> "Provider Info"
