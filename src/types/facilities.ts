// Base table interfaces
export interface FacilityProperty {
  id: string;
  key: string;
  label: string;
  group: string;
  value: string | null;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface Facility {
  id: string;
  label: string;
  icon: string | null;
  facility_properties: string[]; // Array of facility_properties UUIDs
  requirements: string[]; // Array of requirements UUIDs
  providers: string[]; // Array of providers UUIDs
  created_at: string;
  updated_at: string;
}

// Extended interfaces for facilities with joined data
export interface FacilityWithProperties extends Omit<Facility, 'facility_properties'> {
  facility_property_details: FacilityProperty[];
}

export interface FacilityWithAllData extends Omit<Facility, 'facility_properties' | 'requirements' | 'providers'> {
  facility_property_details: FacilityProperty[];
  requirement_details: Array<{
    id: string;
    type: string;
    key: string;
    group: string;
    label: string;
    note: string | null;
    visible: boolean;
  }>;
  provider_details: Array<{
    id: string;
    first_name: string | null;
    last_name: string | null;
    npi_number: string | null;
    title: string | null;
    primary_specialty: string | null;
  }>;
}

// Form interfaces for creating/updating
export interface CreateFacilityProperty {
  key: string;
  label: string;
  group: string;
  value?: string;
  type?: string;
}

export interface CreateFacility {
  label: string;
  icon?: string;
  facility_properties?: string[];
  requirements?: string[];
  providers?: string[];
}

export interface UpdateFacilityProperty {
  key?: string;
  label?: string;
  group?: string;
  value?: string;
  type?: string;
}

export interface UpdateFacility {
  label?: string;
  icon?: string;
  facility_properties?: string[];
  requirements?: string[];
  providers?: string[];
}

// Filter and query interfaces
export interface FacilityFilters {
  label?: string;
  icon?: string;
  search?: string;
}

export interface FacilityPropertyFilters {
  key?: string;
  group?: string;
  type?: string;
  search?: string;
}

// Response types for API calls
export interface FacilitiesResponse {
  data: Facility[];
  count: number;
  error?: string;
}

export interface FacilityPropertiesResponse {
  data: FacilityProperty[];
  count: number;
  error?: string;
}

export interface FacilitiesWithPropertiesResponse {
  data: FacilityWithProperties[];
  count: number;
  error?: string;
}

export interface FacilitiesWithAllDataResponse {
  data: FacilityWithAllData[];
  count: number;
  error?: string;
}

// Utility types
export type FacilityPropertyType = 
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'email'
  | 'url'
  | 'phone'
  | 'single-select'
  | 'multi-select'
  | 'file'
  | 'oneview_record';

export type FacilityPropertyTypeLabel = Record<FacilityPropertyType, string>;

// Default labels for property types
export const FACILITY_PROPERTY_TYPE_LABELS: FacilityPropertyTypeLabel = {
  text: 'Text',
  number: 'Number',
  boolean: 'Boolean',
  date: 'Date',
  email: 'Email',
  url: 'URL',
  phone: 'Phone',
  'single-select': 'Single Select',
  'multi-select': 'Multi-Select',
  file: 'File',
  oneview_record: 'OneView Record'
}; 