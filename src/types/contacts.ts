// Contact type enum
export type ContactType = 
  | 'general'
  | 'credentialing'
  | 'billing'
  | 'emergency'
  | 'administrative'
  | 'clinical'
  | 'technical';

// Preferred contact method enum
export type PreferredContactMethod = 
  | 'email'
  | 'phone'
  | 'fax';

// Base table interface
export interface Contact {
  id: string;
  facility_id: string;
  type: ContactType;
  first_name: string;
  last_name: string;
  job_title: string | null;
  department: string | null;
  restrictions: string | null;
  preferred_contact_method: PreferredContactMethod;
  email: string | null;
  phone: string | null;
  fax: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Extended interface for contacts with facility data
export interface ContactWithFacility extends Omit<Contact, 'facility_id'> {
  facility: {
    id: string;
    label: string;
    icon: string | null;
  };
}

// Form interfaces for creating/updating
export interface CreateContact {
  facility_id: string;
  type: ContactType;
  first_name: string;
  last_name: string;
  job_title?: string;
  department?: string;
  restrictions?: string;
  preferred_contact_method?: PreferredContactMethod;
  email?: string;
  phone?: string;
  fax?: string;
  notes?: string;
}

export interface UpdateContact {
  type?: ContactType;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  department?: string;
  restrictions?: string;
  preferred_contact_method?: PreferredContactMethod;
  email?: string;
  phone?: string;
  fax?: string;
  notes?: string;
}

// Labels for display
export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  general: 'General',
  credentialing: 'Credentialing',
  billing: 'Billing',
  emergency: 'Emergency',
  administrative: 'Administrative',
  clinical: 'Clinical',
  technical: 'Technical'
};

export const PREFERRED_CONTACT_METHOD_LABELS: Record<PreferredContactMethod, string> = {
  email: 'Email',
  phone: 'Phone',
  fax: 'Fax'
};

// Utility functions
export const getContactFullName = (contact: Contact | CreateContact): string => {
  return `${contact.first_name} ${contact.last_name}`.trim();
};

export const getContactDisplayInfo = (contact: Contact | CreateContact): string => {
  const fullName = getContactFullName(contact);
  const title = contact.job_title ? ` - ${contact.job_title}` : '';
  const department = contact.department ? ` (${contact.department})` : '';
  return `${fullName}${title}${department}`;
}; 