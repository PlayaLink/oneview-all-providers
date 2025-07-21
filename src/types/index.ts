export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  primarySpecialty: string;
  npiNumber: string;
  workEmail: string;
  personalEmail: string;
  mobilePhone: string;
  tags: string[];
  lastUpdated: string;
}

export interface FacilityAffiliation {
  id: string;
  provider_id: string;
  facility_name: string;
  staff_category?: string | null;
  in_good_standing?: boolean | null;
  facility_type?: string | null;
  currently_affiliated?: boolean | null;
  appt_end_date?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  reason_for_leaving?: string | null;
  accepting_new_patients?: boolean | null;
  telemedicine?: boolean | null;
  takes_calls?: boolean | null;
  admitting_privileges?: boolean | null;
  primary_affiliation?: boolean | null;
  tags?: string[] | null;
  last_updated?: string | null;
  requirements?: string[]; // Array of requirement record IDs
  provider?: any;
}

// Export all types from other modules
export * from './requirements';
export * from './facilities';
export * from './contacts';
export * from './featureSettings';
