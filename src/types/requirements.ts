// Enum types matching the database enums
export type RequirementType = 
  | 'facility'
  | 'board';

export type RequirementDataType = 
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

// Base table interfaces
export interface RequirementData {
  id: string;
  label: string;
  value: string | null;
  data_type: RequirementDataType;
  key: string;
  created_at: string;
  updated_at: string;
}

export interface Requirement {
  id: string;
  type: RequirementType;
  key: string;
  group: string;
  label: string;
  note: string | null;
  visible: boolean;
  required: boolean;
  credentialing_entity: string | null;
  data: string[]; // Array of requirement_data UUIDs
  created_at: string;
  updated_at: string;
}

// Extended interface for requirements with joined data
export interface RequirementWithData extends Omit<Requirement, 'data'> {
  requirement_data_items: RequirementData[];
}

// Form interfaces for creating/updating
export interface CreateRequirementData {
  label: string;
  value?: string;
  data_type?: RequirementDataType;
  key: string;
}

export interface CreateRequirement {
  type: RequirementType;
  key: string;
  group: string;
  label: string;
  note?: string;
  visible?: boolean;
  required?: boolean;
  credentialing_entity?: string;
  data?: string[];
}

export interface UpdateRequirementData {
  label?: string;
  value?: string;
  data_type?: RequirementDataType;
  key?: string;
}

export interface UpdateRequirement {
  type?: RequirementType;
  key?: string;
  group?: string;
  label?: string;
  note?: string;
  visible?: boolean;
  credentialing_entity?: string;
  data?: string[];
}

// Filter and query interfaces
export interface RequirementFilters {
  type?: RequirementType;
  group?: string;
  key?: string;
  search?: string;
  visible?: boolean;
  credentialing_entity?: string;
}

export interface RequirementDataFilters {
  data_type?: RequirementDataType;
  key?: string;
  search?: string;
}

// Response types for API calls
export interface RequirementsResponse {
  data: Requirement[];
  count: number;
  error?: string;
}

export interface RequirementDataResponse {
  data: RequirementData[];
  count: number;
  error?: string;
}

export interface RequirementsWithDataResponse {
  data: RequirementWithData[];
  count: number;
  error?: string;
}

// Utility types
export type RequirementTypeLabel = Record<RequirementType, string>;
export type RequirementDataTypeLabel = Record<RequirementDataType, string>;

// Default labels for enums
export const REQUIREMENT_TYPE_LABELS: RequirementTypeLabel = {
  facility: 'Facility',
  board: 'Board'
};

export const REQUIREMENT_DATA_TYPE_LABELS: RequirementDataTypeLabel = {
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