import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { dbFetch, dbInsert, dbUpdate, dbDelete } from './dbClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

// Ensure we have a valid URL for edge function calls
export const getSupabaseUrl = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
  if (!url || url === 'undefined') {
    console.warn('VITE_SUPABASE_URL is not set, using fallback URL');
    return 'https://nsqushsijqnlstgwgkzx.supabase.co';
  }
  return url;
};



export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Utility to convert text[] to {id, label}[]
function toIdLabelArray(arr: any): {id: string, label: string}[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((v) => ({ id: v, label: v }));
}
// Utility to convert {id, label}[] to string[]
function fromIdLabelArray(arr: any): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((v) => (typeof v === 'object' && v !== null ? v.id || v.label : v));
}

// --- PROVIDER HELPERS ---
export async function fetchProviders() {
  const data = await dbFetch('providers_with_full_name', '*', ProviderSchema);
  // Convert multi-select fields to {id, label}[]
  return data.map((row: any) => ({
    ...row,
    tags: toIdLabelArray(row.tags),
    classifications: toIdLabelArray(row.classifications),
    taxonomy_codes: toIdLabelArray(row.taxonomy_codes),
    clinical_services: toIdLabelArray(row.clinical_services),
    fluent_languages: toIdLabelArray(row.fluent_languages),
    cms_medicare_specialty_codes: toIdLabelArray(row.cms_medicare_specialty_codes),
    other_specialties: toIdLabelArray(row.other_specialties),
  }));
}

export async function updateProvider(id: string, updates: Record<string, any>) {
  // Convert multi-select fields to string[]
  const updatesCopy = { ...updates };
  if ('tags' in updatesCopy) updatesCopy.tags = fromIdLabelArray(updatesCopy.tags);
  if ('classifications' in updatesCopy) updatesCopy.classifications = fromIdLabelArray(updatesCopy.classifications);
  if ('taxonomy_codes' in updatesCopy) updatesCopy.taxonomy_codes = fromIdLabelArray(updatesCopy.taxonomy_codes);
  if ('clinical_services' in updatesCopy) updatesCopy.clinical_services = fromIdLabelArray(updatesCopy.clinical_services);
  if ('fluent_languages' in updatesCopy) updatesCopy.fluent_languages = fromIdLabelArray(updatesCopy.fluent_languages);
  if ('cms_medicare_specialty_codes' in updatesCopy) updatesCopy.cms_medicare_specialty_codes = fromIdLabelArray(updatesCopy.cms_medicare_specialty_codes);
  if ('other_specialties' in updatesCopy) updatesCopy.other_specialties = fromIdLabelArray(updatesCopy.other_specialties);
  const { data, error } = await supabase
    .from('providers')
    .update(updatesCopy)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

export async function updateStateLicense(id: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('state_licenses')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

export async function updateRecord(tableName: string, id: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

export async function insertRecord(tableName: string, record: Record<string, any>) {
  // Handle array fields - convert empty strings to null for array fields
  const recordCopy = { ...record };
  
  // Common array fields that should be handled
  const arrayFields = ['tags', 'classifications', 'taxonomy_codes', 'clinical_services', 'fluent_languages', 'cms_medicare_specialty_codes', 'other_specialties'];
  
  arrayFields.forEach(field => {
    if (field in recordCopy) {
      if (recordCopy[field] === "" || recordCopy[field] === null || recordCopy[field] === undefined) {
        recordCopy[field] = null;
      } else if (Array.isArray(recordCopy[field])) {
        // If it's already an array, use fromIdLabelArray to convert it properly
        recordCopy[field] = fromIdLabelArray(recordCopy[field]);
      }
    }
  });

  const { data, error } = await supabase
    .from(tableName)
    .insert([recordCopy])
    .select();
  if (error) throw error;
  return data;
}

// Zod schemas for runtime data validation
export const ProviderSchema = z.object({
  id: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  npi_number: z.string().optional(),
  work_email: z.string().optional(),
  personal_email: z.string().optional(),
  mobile_phone_number: z.string().optional(),
  title: z.string().optional(),
  tags: z.array(z.string()).nullable().optional(),
  primary_specialty: z.string().optional(),
  // ...add other fields as needed
});
export const StateLicenseSchema = z.object({
  id: z.string(),
  provider_id: z.string().optional(),
  license_type: z.string().nullable().optional(),
  license_additional_info: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  issue_date: z.string().nullable().optional(),
  expiration_date: z.string().nullable().optional(),
  expires_within: z.string().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  last_updated: z.string().nullable().optional(),
  provider: z.any().optional(),
  // Additional fields that exist in the database
  dont_renew: z.boolean().nullable().optional(),
  is_primary: z.boolean().nullable().optional(),
  is_multistate: z.boolean().nullable().optional(),
  taxonomy_code: z.string().nullable().optional(),
  enrolled_in_pdmp: z.boolean().nullable().optional(),
  fee_exemption: z.string().nullable().optional(),
});
export const BirthInfoSchema = z.object({
  id: z.string(),
  provider_id: z.string().optional(),
  date_of_birth: z.string().optional(),
  country_of_citizenship: z.string().optional(),
  citizenship_work_auth: z.string().optional(),
  us_work_auth: z.string().optional(),
  birth_city: z.string().optional(),
  birth_state_province: z.string().optional(),
  birth_county: z.string().optional(),
  birth_country: z.string().optional(),
  gender: z.string().nullable().optional(),
  identifies_transgender: z.union([z.string(), z.boolean()]).optional().nullable(),
  hair_color: z.string().optional(),
  eye_color: z.string().optional(),
  height_ft: z.union([z.string(), z.number()]).optional().nullable(),
  height_in: z.union([z.string(), z.number()]).optional().nullable(),
  weight_lbs: z.union([z.string(), z.number()]).optional().nullable(),
  ethnicity: z.string().optional(),
  tags: z.array(z.string()).nullable().optional(),
  provider: z.any().optional(),
  // ...add other fields as needed
});

// Per-table helpers using dbFetch
export function fetchStateLicenses() {
  return dbFetch(
    'state_licenses',
    '*,provider:providers(id,first_name,last_name,title,primary_specialty)',
    StateLicenseSchema
  ).then((result) => {
    return result;
  });
}

export function fetchBirthInfo() {
  return dbFetch(
    'birth_info',
    '*,provider:providers(id,first_name,last_name,title,primary_specialty)',
    BirthInfoSchema
  ).then(result => {
    return result;
  });
}

export async function fetchStateLicensesByProvider(providerId: string) {
  const { data, error } = await supabase
    .from('state_licenses')
    .select(`
      *,
      provider:providers(
        id,
        first_name,
        last_name,
        title,
        primary_specialty
      )
    `)
    .eq('provider_id', providerId);

  if (error) throw error;
  return data;
}

// NOTES CRUD
export async function fetchNotes(recordId: string, recordType: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('record_id', recordId)
    .eq('record_type', recordType)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addNote({ recordId, recordType, text, author }: { recordId: string, recordType: string, text: string, author: string }) {
  const { data, error } = await supabase
    .from('notes')
    .insert([
      { record_id: recordId, record_type: recordType, text, author }
    ])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function updateNote(noteId: string, updates: { text?: string }) {
  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', noteId)
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteNote(noteId: string) {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId);
  if (error) throw error;
  return true;
} 

export async function fetchDocumentsForRecord(recordId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('record_id', recordId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function insertDocument(document: any) {
  const { data, error } = await supabase
    .from('documents')
    .insert([document])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDocument(id: string, updates: any) {
  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDocument(id: string, bucket: string, path: string) {
  // Delete from storage first
  const { error: storageError } = await supabase.storage.from(bucket).remove([path]);
  if (storageError) throw storageError;
  // Then delete from table
  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);
  if (dbError) throw dbError;
  return true;
}

// FEATURE SETTINGS CRUD
export async function fetchFeatureSettings() {
  const { data, error } = await supabase
    .from('feature_settings')
    .select('*')
    .order('setting_key');
  if (error) throw error;
  return data;
}

export async function fetchFeatureSetting(key: string) {
  const { data, error } = await supabase
    .from('feature_settings')
    .select('*')
    .eq('setting_key', key)
    .single();
  if (error) throw error;
  return data;
}

export async function updateFeatureSetting(key: string, value: any) {
  const { data, error } = await supabase
    .from('feature_settings')
    .update({ setting_value: value })
    .eq('setting_key', key)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function upsertFeatureSetting(key: string, value: any, description?: string) {
  const { data, error } = await supabase
    .from('feature_settings')
    .upsert(
      { 
        setting_key: key, 
        setting_value: value,
        description: description || `Setting for ${key}`
      },
      { onConflict: 'setting_key' }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
} 

export const AddressSchema = z.object({
  id: z.string(),
  provider_id: z.string(),
  type: z.string().nullable(),
  address: z.string().nullable(),
  address_2: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  zip_postal_code: z.string().nullable(),
  phone_number: z.string().nullable(),
  email: z.string().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  county: z.string().nullable(),
  country: z.string().nullable(),
  tags: z.array(z.string()).nullable().optional(),
  last_updated: z.string().optional(),
  provider: z.any().optional(),
});

export function fetchAddresses() {
  return dbFetch(
    'addresses',
    '*,provider:providers(id,first_name,last_name,title,primary_specialty)',
    AddressSchema
  );
} 

// --- FACILITY AFFILIATIONS HELPERS ---

export const FacilityAffiliationSchema = z.object({
  id: z.string(),
  provider_id: z.string(),
  facility_id: z.string(),
  staff_category: z.string().nullable().optional(),
  in_good_standing: z.boolean().nullable().optional(),
  currently_affiliated: z.boolean().nullable().optional(),
  appt_end_date: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  reason_for_leaving: z.string().nullable().optional(),
  accepting_new_patients: z.boolean().nullable().optional(),
  telemedicine: z.boolean().nullable().optional(),
  takes_calls: z.boolean().nullable().optional(),
  admitting_privileges: z.boolean().nullable().optional(),
  primary_affiliation: z.boolean().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  last_updated: z.string().nullable().optional(),
  requirements: z.array(z.string()).optional(),
  provider: z.any().optional(),
});

export function fetchFacilityAffiliations() {
  return dbFetch(
    'facility_affiliations_with_provider',
    '*',
    FacilityAffiliationSchema
  );
}

export function fetchFacilityAffiliationsByProvider(providerId: string) {
  return dbFetch(
    'facility_affiliations',
    '*,provider:providers(id,first_name,last_name,title,primary_specialty)',
    FacilityAffiliationSchema
  );
}

export async function updateFacilityAffiliation(id: string, updates: Record<string, any>) {
  const updatesCopy = { ...updates };
  if ('tags' in updatesCopy) updatesCopy.tags = fromIdLabelArray(updatesCopy.tags);
  if ('requirements' in updatesCopy && typeof updatesCopy.requirements === 'string') {
    updatesCopy.requirements = updatesCopy.requirements.split(',').map((s: string) => s.trim());
  }
  const { data, error } = await supabase
    .from('facility_affiliations')
    .update(updatesCopy)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
}

export async function insertFacilityAffiliation(affiliation: Record<string, any>) {
  const insertCopy = { ...affiliation };
  if ('tags' in insertCopy) insertCopy.tags = fromIdLabelArray(insertCopy.tags);
  if ('requirements' in insertCopy && typeof insertCopy.requirements === 'string') {
    insertCopy.requirements = insertCopy.requirements.split(',').map((s: string) => s.trim());
  }
  const { data, error } = await supabase
    .from('facility_affiliations')
    .insert([insertCopy])
    .select();
  if (error) throw error;
  return data?.[0];
}

export async function deleteFacilityAffiliation(id: string) {
  const { error } = await supabase
    .from('facility_affiliations')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
} 

// Fetch all grid definitions
export async function fetchGridDefinitions() {
  const { data, error } = await supabase
    .from('grid_definitions')
    .select('*')
    .order('display_name');
  if (error) throw error;
  return data;
}

// Fetch columns for a grid
export async function fetchGridColumns(gridId: string) {
  const { data, error } = await supabase
    .from('grid_columns')
    .select('*')
    .eq('grid_id', gridId)
    .order('order');
  if (error) throw error;
  return data;
}

// Update column width in the database
export async function updateGridColumnWidth(columnId: string, width: number) {
  const { data, error } = await supabase
    .from('grid_columns')
    .update({ width })
    .eq('id', columnId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update multiple column widths in the database
export async function updateGridColumnWidths(updates: Array<{ columnId: string; width: number }>) {
  if (updates.length === 0) return [];
  
  // Update each column individually since we can't use upsert without grid_id
  const results = [];
  for (const { columnId, width } of updates) {
    const { data, error } = await supabase
      .from('grid_columns')
      .update({ width })
      .eq('id', columnId)
      .select()
      .single();
    
    if (error) throw error;
    results.push(data);
  }
  
  return results;
}

// Fetch columns for a grid by grid name/key
export async function fetchGridColumnsByGridName(gridName: string) {
  // First get the grid definition to get the grid_id
  const { data: gridDefs, error: gridError } = await supabase
    .from('grid_definitions')
    .select('id, display_name, key, table_name, expiring_within')
    .or(`display_name.eq.${gridName},key.eq.${gridName},table_name.eq.${gridName}`)
    .limit(1);
  
  if (gridError) throw gridError;
  if (!gridDefs || gridDefs.length === 0) {
    console.warn(`No grid definition found for gridName: ${gridName}`);
    return [];
  }

  const gridDef = gridDefs[0];
  
  // Then get the grid columns using the grid_id
  const { data, error } = await supabase
    .from('grid_columns')
    .select('*')
    .eq('grid_id', gridDef.id)
    .order('order');
  
  if (error) throw error;
  
  // Return both columns and grid definition info
  return {
    columns: data,
    gridDefinition: gridDef
  };
}

// Fetch field groups for a grid
export async function fetchGridFieldGroups(gridId: string) {
  const { data, error } = await supabase
    .from('grid_field_groups')
    .select('*')
    .eq('grid_id', gridId)
    .order('order');
  if (error) throw error;
  return data;
} 

// Fetch all rows from a given table name
export async function fetchGridData(tableName: string) {
  
  if (!tableName) return [];
  const { data, error } = await supabase
    .from(tableName)
    .select('*');
  if (error) {
    throw error;
  }
  return data;
} 

// Fetch all grid sections
export async function fetchGridSections() {
  const { data, error } = await supabase
    .from('grid_sections')
    .select('*')
    .order('order');
  if (error) throw error;
  return data;
} 

// --- REQUIREMENTS HELPERS ---

export const RequirementDataSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string().nullable().optional(),
  data_type: z.enum(['text', 'number', 'boolean', 'date', 'email', 'url', 'phone', 'single-select', 'multi-select', 'file', 'oneview_record']),
  key: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const RequirementSchema = z.object({
  id: z.string(),
  type: z.enum(['facility', 'board']),
  key: z.string(),
  group: z.string(),
  label: z.string(),
  note: z.string().nullable().optional(),
  visible: z.boolean(),
  required: z.boolean(),
  credentialing_entities: z.array(z.string()),
  data: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string(),
});

export function fetchRequirementData() {
  return dbFetch('requirement_data', '*', RequirementDataSchema);
}

export async function fetchRequirementDataById(id: string) {
  const { data, error } = await supabase
    .from('requirement_data')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return RequirementDataSchema.parse(data);
}

export async function fetchRequirementDataByKey(key: string) {
  const { data, error } = await supabase
    .from('requirement_data')
    .select('*')
    .eq('key', key);
  if (error) throw error;
  return RequirementDataSchema.array().parse(data);
}

export function createRequirementData(data: {
  label: string;
  value?: string;
  data_type?: 'text' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'phone' | 'single-select' | 'multi-select' | 'file' | 'oneview_record';
  key: string;
}) {
  return dbInsert('requirement_data', [data], RequirementDataSchema);
}

export function updateRequirementData(id: string, data: {
  label?: string;
  value?: string;
  data_type?: 'text' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'phone' | 'single-select' | 'multi-select' | 'file' | 'oneview_record';
  key?: string;
}) {
  return dbUpdate('requirement_data', id, data, RequirementDataSchema);
}

export function deleteRequirementData(id: string) {
  return dbDelete('requirement_data', id);
}

export function fetchRequirements() {
  return dbFetch('requirements', '*', RequirementSchema);
}

export async function fetchRequirementsWithData() {
  const { data, error } = await supabase
    .from('requirements_with_data')
    .select('*');
  if (error) throw error;
  return RequirementSchema.extend({
    requirement_data_items: z.array(RequirementDataSchema)
  }).array().parse(data);
}

export async function fetchRequirementById(id: string) {
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return RequirementSchema.parse(data);
}

export async function fetchRequirementByKey(key: string) {
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('key', key);
  if (error) throw error;
  return RequirementSchema.array().parse(data);
}

export async function fetchRequirementsByGroup(groupName: string) {
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('group', groupName);
  if (error) throw error;
  return RequirementSchema.array().parse(data);
}

export async function fetchRequirementsByType(type: string) {
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('type', type);
  if (error) throw error;
  return RequirementSchema.array().parse(data);
}

export function createRequirement(data: {
  type: 'facility' | 'board';
  key: string;
  group: string;
  label: string;
  note?: string;
  visible?: boolean;
  required?: boolean;
  credentialing_entities?: string[];
  data?: string[];
}) {
  return dbInsert('requirements', [data], RequirementSchema);
}

export function updateRequirement(id: string, data: {
  type?: 'facility' | 'board';
  key?: string;
  group?: string;
  label?: string;
  note?: string;
  visible?: boolean;
  required?: boolean;
  credentialing_entities?: string[];
  data?: string[];
}) {
  return dbUpdate('requirements', id, data, RequirementSchema);
}

export function deleteRequirement(id: string) {
  return dbDelete('requirements', id);
}

// Helper function to get requirement data items by IDs
export async function fetchRequirementDataByIds(ids: string[]) {
  if (!ids.length) return [];
  
  const { data, error } = await supabase
    .from('requirement_data')
    .select('*')
    .in('id', ids);
  
  if (error) throw error;
  return RequirementDataSchema.array().parse(data);
}

// Helper function to search requirements
export async function searchRequirements(searchTerm: string, filters?: {
  type?: string;
  group?: string;
  visible?: boolean;
  credentialing_entities?: string[];
}) {
  let query = supabase
    .from('requirements')
    .select('*')
    .or(`label.ilike.%${searchTerm}%,key.ilike.%${searchTerm}%,note.ilike.%${searchTerm}%`);
  
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  
  if (filters?.group) {
    query = query.eq('group', filters.group);
  }
  
  if (filters?.visible !== undefined) {
    query = query.eq('visible', filters.visible);
  }
  
  if (filters?.credentialing_entities && filters.credentialing_entities.length > 0) {
    query = query.overlaps('credentialing_entities', filters.credentialing_entities);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return RequirementSchema.array().parse(data);
}

// Helper function to get requirements by credentialing entities
export async function fetchRequirementsByCredentialingEntities(credentialingEntityIds: string[]) {
  if (!credentialingEntityIds.length) return [];
  
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .overlaps('credentialing_entities', credentialingEntityIds);
  if (error) throw error;
  return RequirementSchema.array().parse(data);
}

// Helper function to get requirements by a single credentialing entity (for backward compatibility)
export async function fetchRequirementsByCredentialingEntity(credentialingEntityId: string) {
  return fetchRequirementsByCredentialingEntities([credentialingEntityId]);
}

// Helper function to get visible requirements only
export async function fetchVisibleRequirements() {
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('visible', true);
  if (error) throw error;
  return RequirementSchema.array().parse(data);
}

// Helper function to get requirements by type and credentialing entities
export async function fetchRequirementsByTypeAndEntities(type: string, credentialingEntityIds: string[]) {
  if (!credentialingEntityIds.length) return [];
  
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('type', type)
    .overlaps('credentialing_entities', credentialingEntityIds);
  if (error) throw error;
  return RequirementSchema.array().parse(data);
}

// Helper function to get requirements by type and a single credentialing entity (for backward compatibility)
export async function fetchRequirementsByTypeAndEntity(type: string, credentialingEntityId: string) {
  return fetchRequirementsByTypeAndEntities(type, [credentialingEntityId]);
} 

// --- FACILITIES HELPERS ---

export const FacilityPropertySchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  group: z.string(),
  value: z.string().nullable().optional(),
  type: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const FacilityPropertyValueSchema = z.object({
  id: z.string(),
  facility_id: z.string(),
  facility_property_id: z.string(),
  value: z.any(), // JSONB can store any JSON value
  created_at: z.string(),
  updated_at: z.string(),
});

export const FacilityRequirementValueSchema = z.object({
  id: z.string(),
  facility_id: z.string(),
  requirement_id: z.string(),
  requirement_data_id: z.string(),
  value: z.any(), // JSONB can store any JSON value
  created_at: z.string(),
  updated_at: z.string(),
});

export const FacilitySchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.string().nullable().optional(),
  requirements: z.array(z.string()),
  providers: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string(),
});

export function fetchFacilityProperties() {
  return dbFetch('facility_properties', '*', FacilityPropertySchema);
}

export async function fetchFacilityPropertyById(id: string) {
  const { data, error } = await supabase
    .from('facility_properties')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return FacilityPropertySchema.parse(data);
}

export async function fetchFacilityPropertyByKey(key: string) {
  const { data, error } = await supabase
    .from('facility_properties')
    .select('*')
    .eq('key', key);
  if (error) throw error;
  return FacilityPropertySchema.array().parse(data);
}

export async function fetchFacilityPropertiesByGroup(groupName: string) {
  const { data, error } = await supabase
    .from('facility_properties')
    .select('*')
    .eq('group', groupName);
  if (error) throw error;
  return FacilityPropertySchema.array().parse(data);
}

export function createFacilityProperty(data: {
  key: string;
  label: string;
  group: string;
  value?: string;
  type?: string;
}) {
  return dbInsert('facility_properties', [data], FacilityPropertySchema);
}

export function updateFacilityProperty(id: string, data: {
  key?: string;
  label?: string;
  group?: string;
  value?: string;
  type?: string;
}) {
  return dbUpdate('facility_properties', id, data, FacilityPropertySchema);
}

export function deleteFacilityProperty(id: string) {
  return dbDelete('facility_properties', id);
}

export function fetchFacilities() {
  return dbFetch('facilities', '*', FacilitySchema);
}

export async function fetchFacilitiesWithProperties() {
  const { data, error } = await supabase
    .from('facilities_with_properties')
    .select('*');
  if (error) throw error;
  return FacilitySchema.extend({
    properties: z.array(z.object({
      id: z.string(),
      key: z.string(),
      label: z.string(),
      type: z.string(),
      group: z.string(),
      value: z.any(),
      is_required: z.boolean().optional(),
      validation_rules: z.any().optional()
    }))
  }).array().parse(data);
}

export async function fetchFacilitiesWithAllData() {
  const { data, error } = await supabase
    .from('facilities_with_all_data')
    .select('*');
  if (error) throw error;
  return FacilitySchema.extend({
    properties: z.array(z.object({
      id: z.string(),
      key: z.string(),
      label: z.string(),
      type: z.string(),
      group: z.string(),
      value: z.any(),
      is_required: z.boolean().optional(),
      validation_rules: z.any().optional(),
      options: z.array(z.object({
        id: z.string(),
        label: z.string()
      })).optional().nullable()
    })),
    requirements: z.array(z.object({
      id: z.string(),
      key: z.string(),
      label: z.string(),
      group: z.string(),
      type: z.string(),
      note: z.string().nullable(),
      visible: z.boolean(),
      required: z.boolean()
    })),
    providers: z.array(z.object({
      id: z.string(),
      first_name: z.string().nullable(),
      last_name: z.string().nullable(),
      npi_number: z.string().nullable(),
      title: z.string().nullable(),
      primary_specialty: z.string().nullable(),
      role: z.string().nullable(),
      start_date: z.string().nullable(),
      end_date: z.string().nullable(),
      is_active: z.boolean()
    }))
  }).array().parse(data);
}

export async function fetchFacilityById(id: string) {
  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return FacilitySchema.parse(data);
}

export async function fetchFacilityWithAllData(id: string) {
  const { data, error } = await supabase
    .from('facilities_with_all_data')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  
  return FacilitySchema.extend({
    properties: z.array(z.object({
      id: z.string(),
      key: z.string(),
      label: z.string(),
      type: z.string(),
      group: z.string(),
      value: z.any(),
      is_required: z.boolean().optional(),
      validation_rules: z.any().optional(),
      options: z.array(z.object({
        id: z.string(),
        label: z.string()
      })).optional().nullable()
    })),
    requirements: z.array(z.object({
      id: z.string(),
      key: z.string(),
      label: z.string(),
      group: z.string(),
      type: z.string(),
      note: z.string().nullable(),
      visible: z.boolean(),
      required: z.boolean()
    })),
    providers: z.array(z.object({
      id: z.string(),
      first_name: z.string().nullable(),
      last_name: z.string().nullable(),
      npi_number: z.string().nullable(),
      title: z.string().nullable(),
      primary_specialty: z.string().nullable(),
      role: z.string().nullable(),
      start_date: z.string().nullable(),
      end_date: z.string().nullable(),
      is_active: z.boolean()
    }))
  }).parse(data);
}

export async function fetchFacilitiesByLabel(label: string) {
  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .ilike('label', `%${label}%`);
  if (error) throw error;
  return FacilitySchema.array().parse(data);
}

export function createFacility(data: {
  label: string;
  icon?: string;
  requirements?: string[];
  providers?: string[];
}) {
  return dbInsert('facilities', [data], FacilitySchema);
}

export function updateFacility(id: string, data: {
  label?: string;
  icon?: string;
  requirements?: string[];
  providers?: string[];
}) {
  return dbUpdate('facilities', id, data, FacilitySchema);
}

export function deleteFacility(id: string) {
  return dbDelete('facilities', id);
}

// Helper function to get facility properties by IDs
export async function fetchFacilityPropertiesByIds(ids: string[]) {
  if (!ids.length) return [];
  
  const { data, error } = await supabase
    .from('facility_properties')
    .select('*')
    .in('id', ids);
  
  if (error) throw error;
  return FacilityPropertySchema.array().parse(data);
}

// Helper function to search facilities
export async function searchFacilities(searchTerm: string, filters?: {
  label?: string;
  icon?: string;
}) {
  let query = supabase
    .from('facilities')
    .select('*')
    .or(`label.ilike.%${searchTerm}%`);
  
  if (filters?.label) {
    query = query.ilike('label', `%${filters.label}%`);
  }
  
  if (filters?.icon) {
    query = query.eq('icon', filters.icon);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return FacilitySchema.array().parse(data);
}

// Helper function to search facility properties
export async function searchFacilityProperties(searchTerm: string, filters?: {
  key?: string;
  group?: string;
  type?: string;
}) {
  let query = supabase
    .from('facility_properties')
    .select('*')
    .or(`label.ilike.%${searchTerm}%,key.ilike.%${searchTerm}%,value.ilike.%${searchTerm}%`);
  
  if (filters?.key) {
    query = query.eq('key', filters.key);
  }
  
  if (filters?.group) {
    query = query.eq('group', filters.group);
  }
  
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return FacilityPropertySchema.array().parse(data);
}

// --- ANNOTATIONS HELPERS ---

export const AnnotationSchema = z.object({
  id: z.string(),
  text: z.string(),
  element_selector: z.string(),
  position_x: z.number(),
  position_y: z.number(),
  placement: z.enum(['top', 'bottom', 'left', 'right']),
  page_url: z.string(),
  git_branch: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export function fetchAnnotations() {
  return dbFetch('annotations', '*', AnnotationSchema).then(data => {
    // Transform the data to match the Annotation interface
    const transformed = data.map(row => ({
      ...row,
      position: {
        x: row.position_x,
        y: row.position_y
      }
    }));
    
    return transformed;
  });
}

export async function fetchAnnotationsByPage(pageUrl: string) {
  const { data, error } = await supabase
    .from('annotations')
    .select('*')
    .eq('page_url', pageUrl)
    .order('created_at', { ascending: false });
  if (error) throw error;
  
  // Transform the data to match the Annotation interface
  return data.map(row => ({
    ...row,
    position: {
      x: row.position_x,
      y: row.position_y
    }
  }));
}

export async function addAnnotation(data: {
  text: string;
  element_selector: string;
  position_x: number;
  position_y: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
  page_url: string;
  git_branch?: string;
}) {
  try {
    return await dbInsert('annotations', [data], AnnotationSchema);
  } catch (error) {
    console.error('Error adding annotation:', error);
    
    // If it's an RLS error, provide helpful error message
    if (error && typeof error === 'object' && 'code' in error && error.code === '42501') {
      console.error('RLS policy blocked insert. Please run the update-annotations-rls.sql script in Supabase.');
      throw new Error('Authentication required. Please check RLS policies or authenticate.');
    }
    
    throw error;
  }
}

export async function updateAnnotation(id: string, data: {
  text?: string;
  element_selector?: string;
  position_x?: number;
  position_y?: number;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  page_url?: string;
}) {
  return dbUpdate('annotations', id, data, AnnotationSchema);
}

export async function deleteAnnotation(id: string) {
  return dbDelete('annotations', id);
}

// --- CONTACTS HELPERS ---

export const ContactSchema = z.object({
  id: z.string(),
  facility_id: z.string(),
  type: z.enum(['general', 'credentialing', 'billing', 'emergency', 'administrative', 'clinical', 'technical']),
  first_name: z.string(),
  last_name: z.string(),
  job_title: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  restrictions: z.string().nullable().optional(),
  preferred_contact_method: z.enum(['email', 'phone', 'fax']),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  fax: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export function fetchContacts() {
  return dbFetch('contacts', '*', ContactSchema);
}

export async function fetchContactsWithFacility() {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      facility:facilities(id, label, icon)
    `);
  if (error) throw error;
  return ContactSchema.extend({
    facility: z.object({
      id: z.string(),
      label: z.string(),
      icon: z.string().nullable()
    })
  }).array().parse(data);
}

export async function fetchContactsByFacility(facilityId: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('facility_id', facilityId);
  if (error) throw error;
  return ContactSchema.array().parse(data);
}

export async function fetchContactsByType(type: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('type', type);
  if (error) throw error;
  return ContactSchema.array().parse(data);
}

export async function fetchContactById(id: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return ContactSchema.parse(data);
}

export function createContact(data: {
  facility_id: string;
  type: 'general' | 'credentialing' | 'billing' | 'emergency' | 'administrative' | 'clinical' | 'technical';
  first_name: string;
  last_name: string;
  job_title?: string;
  department?: string;
  restrictions?: string;
  preferred_contact_method?: 'email' | 'phone' | 'fax';
  email?: string;
  phone?: string;
  fax?: string;
  notes?: string;
}) {
  return dbInsert('contacts', [data], ContactSchema);
}

export function updateContact(id: string, data: {
  type?: 'general' | 'credentialing' | 'billing' | 'emergency' | 'administrative' | 'clinical' | 'technical';
  first_name?: string;
  last_name?: string;
  job_title?: string;
  department?: string;
  restrictions?: string;
  preferred_contact_method?: 'email' | 'phone' | 'fax';
  email?: string;
  phone?: string;
  fax?: string;
  notes?: string;
}) {
  return dbUpdate('contacts', id, data, ContactSchema);
}

export function deleteContact(id: string) {
  return dbDelete('contacts', id);
}

export async function searchContacts(searchTerm: string, filters?: {
  type?: string;
  department?: string;
  facility_id?: string;
}) {
  let query = supabase
    .from('contacts')
    .select('*')
    .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,job_title.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%`);
  
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  
  if (filters?.department) {
    query = query.eq('department', filters.department);
  }
  
  if (filters?.facility_id) {
    query = query.eq('facility_id', filters.facility_id);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return ContactSchema.array().parse(data);
} 

// --- FACILITY PROPERTY VALUES HELPERS ---

export function fetchFacilityPropertyValues() {
  return dbFetch('facility_property_values', '*', FacilityPropertyValueSchema);
}

export async function fetchFacilityPropertyValuesByFacility(facilityId: string) {
  const { data, error } = await supabase
    .from('facility_property_values')
    .select('*')
    .eq('facility_id', facilityId);
  if (error) throw error;
  return FacilityPropertyValueSchema.array().parse(data);
}

export async function fetchFacilityPropertyValuesByProperty(propertyId: string) {
  const { data, error } = await supabase
    .from('facility_property_values')
    .select('*')
    .eq('facility_property_id', propertyId);
  if (error) throw error;
  return FacilityPropertyValueSchema.array().parse(data);
}

export function createFacilityPropertyValue(data: {
  facility_id: string;
  facility_property_id: string;
  value?: any; // Can be string, number, boolean, array, object, null
}) {
  return dbInsert('facility_property_values', [data], FacilityPropertyValueSchema);
}

export function updateFacilityPropertyValue(id: string, data: {
  value?: any; // Can be string, number, boolean, array, object, null
}) {
  return dbUpdate('facility_property_values', id, data, FacilityPropertyValueSchema);
}

export function deleteFacilityPropertyValue(id: string) {
  return dbDelete('facility_property_values', id);
}

export async function fetchFacilitiesWithPropertyValues() {
  const { data, error } = await supabase
    .from('facilities_with_property_values')
    .select('*');
  if (error) throw error;
  return data;
}

export async function fetchFacilitiesWithPropertyValuesJson() {
  const { data, error } = await supabase
    .from('facilities_with_property_values_json')
    .select('*');
  if (error) throw error;
  return data;
} 

// Helper function to convert property value based on type
export function convertPropertyValue(value: any, propertyType: string): any {
  switch (propertyType) {
    case 'number':
      return typeof value === 'number' ? value : parseFloat(value?.toString() || '0');
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        return value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
      }
      return false;
    case 'multi-select':
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
      }
      return [];
    case 'single-select':
    case 'text':
    case 'email':
    case 'url':
    case 'phone':
    default:
      // For JSONB storage, return the actual value, not a string
      return value || '';
  }
}

// Helper function to get facility property value with proper typing
export async function getFacilityPropertyValue(facilityId: string, propertyKey: string) {
  const { data, error } = await supabase
    .from('facility_property_values')
    .select(`
      *,
      facility_property:facility_properties(key, label, type, group)
    `)
    .eq('facility_id', facilityId)
    .eq('facility_property.key', propertyKey)
    .single();
  
  if (error) throw error;
  
  if (data) {
    const convertedValue = convertPropertyValue(data.value, data.facility_property.type);
    return {
      ...data,
      converted_value: convertedValue
    };
  }
  
  return null;
}

// Helper function to get all property values for a facility with proper typing
export async function getFacilityPropertyValues(facilityId: string) {
  const { data, error } = await supabase
    .from('facility_property_values')
    .select(`
      *,
      facility_property:facility_properties(key, label, type, group)
    `)
    .eq('facility_id', facilityId);
  
  if (error) throw error;
  
  return data?.map(item => ({
    ...item,
    converted_value: convertPropertyValue(item.value, item.facility_property.type)
  })) || [];
}

// Helper function to get facility properties grouped by category
export async function getFacilityPropertiesGrouped(facilityId: string) {
  const propertyValues = await getFacilityPropertyValues(facilityId);
  
  const grouped = propertyValues.reduce((acc, item) => {
    const group = item.facility_property.group;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push({
      id: item.id,
      key: item.facility_property.key,
      label: item.facility_property.label,
      type: item.facility_property.type,
      value: item.converted_value,
      raw_value: item.value
    });
    return acc;
  }, {} as Record<string, Array<{
    id: string;
    key: string;
    label: string;
    type: string;
    value: any;
    raw_value: any;
  }>>);
  
  return grouped;
}

// Helper function to update facility property value with proper type conversion
export async function updateFacilityPropertyValueByKey(
  facilityId: string, 
  propertyKey: string, 
  value: any
) {
  // First get the property definition to know the type
  const { data: propertyDef, error: propError } = await supabase
    .from('facility_properties')
    .select('id, type')
    .eq('key', propertyKey)
    .single();
  
  if (propError) throw propError;
  
  // Convert the value based on the property type
  const convertedValue = convertPropertyValue(value, propertyDef.type);
  
  // Check if value already exists
  const { data: existingValue, error: checkError } = await supabase
    .from('facility_property_values')
    .select('id')
    .eq('facility_id', facilityId)
    .eq('facility_property_id', propertyDef.id)
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') throw checkError; // PGRST116 = no rows returned
  
  if (existingValue) {
    // Update existing value
    return updateFacilityPropertyValue(existingValue.id, { value: convertedValue });
  } else {
    // Create new value
    return createFacilityPropertyValue({
      facility_id: facilityId,
      facility_property_id: propertyDef.id,
      value: convertedValue
    });
  }
}

// --- FACILITY REQUIREMENT VALUES HELPERS ---

export function fetchFacilityRequirementValues() {
  return dbFetch('facility_requirement_values', '*', FacilityRequirementValueSchema);
}

export async function fetchFacilityRequirementValuesByFacility(facilityId: string) {
  const { data, error } = await supabase
    .from('facility_requirement_values')
    .select('*')
    .eq('facility_id', facilityId);
  if (error) throw error;
  return FacilityRequirementValueSchema.array().parse(data);
}

export async function fetchFacilityRequirementValuesByRequirement(requirementId: string) {
  const { data, error } = await supabase
    .from('facility_requirement_values')
    .select('*')
    .eq('requirement_id', requirementId);
  if (error) throw error;
  return FacilityRequirementValueSchema.array().parse(data);
}

export function createFacilityRequirementValue(data: {
  facility_id: string;
  requirement_id: string;
  requirement_data_id: string;
  value?: any; // Can be string, number, boolean, array, object, null
}) {
  return dbInsert('facility_requirement_values', [data], FacilityRequirementValueSchema);
}

export function updateFacilityRequirementValue(id: string, data: {
  value?: any; // Can be string, number, boolean, array, object, null
}) {
  return dbUpdate('facility_requirement_values', id, data, FacilityRequirementValueSchema);
}

export function deleteFacilityRequirementValue(id: string) {
  return dbDelete('facility_requirement_values', id);
}

// Helper function to convert requirement value based on data type
export function convertRequirementValue(value: any, dataType: string): any {
  switch (dataType) {
    case 'number':
      return typeof value === 'number' ? value : parseFloat(value?.toString() || '0');
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        return value.toLowerCase() === 'yes' || value.toLowerCase() === 'true';
      }
      return false;
    case 'multi-select':
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
      }
      return [];
    case 'single-select':
    case 'text':
    case 'email':
    case 'url':
    case 'phone':
    case 'oneview_record':
    default:
      // For JSONB storage, return the actual value, not a string
      return value || '';
  }
}

// Helper function to get facility requirement value with proper typing
export async function getFacilityRequirementValue(
  facilityId: string, 
  requirementKey: string, 
  dataKey: string
) {
  const { data, error } = await supabase
    .from('facility_requirement_values')
    .select(`
      *,
      requirement:requirements(key, label, type, group),
      requirement_data:requirement_data(key, label, data_type)
    `)
    .eq('facility_id', facilityId)
    .eq('requirement.key', requirementKey)
    .eq('requirement_data.key', dataKey)
    .single();
  
  if (error) throw error;
  
  if (data) {
    const convertedValue = convertRequirementValue(data.value, data.requirement_data.data_type);
    return {
      ...data,
      converted_value: convertedValue
    };
  }
  
  return null;
}

// Helper function to get all requirement values for a facility with proper typing
export async function getFacilityRequirementValues(facilityId: string) {
  const { data, error } = await supabase
    .from('facility_requirement_values')
    .select(`
      *,
      requirement:requirements(key, label, type, group),
      requirement_data:requirement_data(key, label, data_type)
    `)
    .eq('facility_id', facilityId);
  
  if (error) throw error;
  
  return data?.map(item => ({
    ...item,
    converted_value: convertRequirementValue(item.value, item.requirement_data.data_type)
  })) || [];
}

// Helper function to get facility requirements grouped by requirement
export async function getFacilityRequirementsGrouped(facilityId: string) {
  const requirementValues = await getFacilityRequirementValues(facilityId);
  
  const grouped = requirementValues.reduce((acc, item) => {
    const requirementKey = item.requirement.key;
    if (!acc[requirementKey]) {
      acc[requirementKey] = {
        requirement: item.requirement,
        data: []
      };
    }
    acc[requirementKey].data.push({
      id: item.id,
      key: item.requirement_data.key,
      label: item.requirement_data.label,
      data_type: item.requirement_data.data_type,
      value: item.converted_value,
      raw_value: item.value
    });
    return acc;
  }, {} as Record<string, {
    requirement: any;
    data: Array<{
      id: string;
      key: string;
      label: string;
      data_type: string;
      value: any;
      raw_value: any;
    }>;
  }>);
  
  return grouped;
}

// Helper function to update facility requirement value with proper type conversion
export async function updateFacilityRequirementValueByKeys(
  facilityId: string, 
  requirementKey: string, 
  dataKey: string, 
  value: any
) {
  // First get the requirement and data definitions to know the types
  const { data: requirementDef, error: reqError } = await supabase
    .from('requirements')
    .select('id')
    .eq('key', requirementKey)
    .single();
  
  if (reqError) throw reqError;
  
  const { data: dataDef, error: dataError } = await supabase
    .from('requirement_data')
    .select('id, data_type')
    .eq('key', dataKey)
    .single();
  
  if (dataError) throw dataError;
  
  // Convert the value based on the data type
  const convertedValue = convertRequirementValue(value, dataDef.data_type);
  
  // Check if value already exists
  const { data: existingValue, error: checkError } = await supabase
    .from('facility_requirement_values')
    .select('id')
    .eq('facility_id', facilityId)
    .eq('requirement_id', requirementDef.id)
    .eq('requirement_data_id', dataDef.id)
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') throw checkError; // PGRST116 = no rows returned
  
  if (existingValue) {
    // Update existing value
    return updateFacilityRequirementValue(existingValue.id, { value: convertedValue });
  } else {
    // Create new value
    return createFacilityRequirementValue({
      facility_id: facilityId,
      requirement_id: requirementDef.id,
      requirement_data_id: dataDef.id,
      value: convertedValue
    });
  }
} 

// Fetch all grid data for a provider from the edge function
export async function fetchAllProviderGrids(provider_id: string) {
  // Get the current session and access token from Supabase
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  const url = `${getSupabaseUrl()}/functions/v1/all-records?provider_id=${provider_id}`;
  
  try {

    
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const res = await fetch(url, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    
    
    
    // Get the response text first to debug
    const responseText = await res.text();
    
    
    if (!res.ok) {
      // If we get a 401 and don't have a token, try with a dummy token
      if (res.status === 401 && !accessToken) {

        const dummyRes = await fetch(url, {
          headers: { Authorization: `Bearer dummy-token-for-development` },
        });
        
        const dummyText = await dummyRes.text();
        
        
        if (!dummyRes.ok) {
          
          // Return fallback data instead of crashing
          return {
            providers: [],
            state_licenses: [],
            birth_info: [],
            addresses: [],
            facility_affiliations: []
          };
        }
        
        try {
          const json = JSON.parse(dummyText);
  
          return json;
        } catch (parseError) {
          console.error('Failed to parse dummy token response:', parseError);
          return {
            providers: [],
            state_licenses: [],
            birth_info: [],
            addresses: [],
            facility_affiliations: []
          };
        }
      }
      
      // Try to parse the error response as JSON
      try {
        const errorJson = JSON.parse(responseText);
        throw new Error(`Edge function error: ${res.status} - ${errorJson.message || errorJson.code || res.statusText}`);
      } catch (parseError) {
        throw new Error(`Edge function error: ${res.status} ${res.statusText} - ${responseText.substring(0, 100)}`);
      }
    }
    
    // Try to parse the successful response as JSON
    try {
      const json = JSON.parse(responseText);

      return json;
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      console.error('Response text:', responseText);
      throw new Error(`Invalid JSON response from edge function: ${responseText.substring(0, 100)}`);
    }
  } catch (error) {
    console.error('Error calling edge function:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn('Edge function request timed out, using fallback data');
      } else if (error.message.includes('message channel closed')) {
        console.warn('Message channel closed, using fallback data');
      } else {
        console.warn('Edge function error:', error.message);
      }
    }
    
    // Fallback: return empty results instead of crashing
    return {
      providers: [],
      state_licenses: [],
      birth_info: [],
      addresses: [],
      facility_affiliations: []
    };
  }
} 

// Fetch all actions
export async function fetchActions() {
  const { data, error } = await supabase
    .from('actions')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

// Fetch actions for a specific grid
export async function fetchGridActions(gridId: string) {
  const { data, error } = await supabase
    .from('grid_actions')
    .select(`
      *,
      action:actions(*)
    `)
    .eq('grid_id', gridId)
    .order('order');
  if (error) throw error;
  return data;
}

// Fetch actions for a grid by grid name/key
export async function fetchGridActionsByGridName(gridName: string) {
  // First get the grid definition to get the grid_id
  // Try to find the grid by display_name, key, or table_name
  const { data: gridDefs, error: gridError } = await supabase
    .from('grid_definitions')
    .select('id, display_name, key, table_name')
    .or(`display_name.eq.${gridName},key.eq.${gridName},table_name.eq.${gridName}`)
    .limit(1);
  
  if (gridError) throw gridError;
  if (!gridDefs || gridDefs.length === 0) {
    console.warn(`No grid definition found for gridName: ${gridName}`);
    return [];
  }

  const gridDef = gridDefs[0];
  

  // Then get the grid actions using the grid_id
  const { data, error } = await supabase
    .from('grid_actions')
    .select(`
      *,
      action:actions(*)
    `)
    .eq('grid_id', gridDef.id)
    .order('order');
  
  if (error) throw error;
  return data;
}

// Fetch all grid actions with their related data
export async function fetchAllGridActions() {
  const { data, error } = await supabase
    .from('grid_actions')
    .select(`
      *,
      action:actions(*),
      grid:grid_definitions(display_name, table_name, key)
    `)
    .order('order');
  if (error) throw error;
  return data;
}

// Update expiring_within value for a grid definition
export async function updateGridExpiringWithin(gridName: string, expiringWithin: number) {
  console.log("updateGridExpiringWithin called with:", { gridName, expiringWithin });
  
  // First get the grid definition to get the grid_id
  const { data: gridDefs, error: gridError } = await supabase
    .from('grid_definitions')
    .select('id')
    .or(`display_name.eq.${gridName},key.eq.${gridName},table_name.eq.${gridName}`)
    .limit(1);
  
  if (gridError) {
    console.error("Error finding grid definition:", gridError);
    throw gridError;
  }
  
  if (!gridDefs || gridDefs.length === 0) {
    console.error("No grid definition found for gridName:", gridName);
    throw new Error(`No grid definition found for gridName: ${gridName}`);
  }

  const gridDef = gridDefs[0];
  console.log("Found grid definition:", gridDef);
  
  // Update the expiring_within value
  const { data, error } = await supabase
    .from('grid_definitions')
    .update({ expiring_within: expiringWithin })
    .eq('id', gridDef.id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating grid definition:", error);
    throw error;
  }
  
  console.log("Update successful:", data);
  return data;
}

// Bulk delete records from a table
export async function bulkDeleteRecords(tableName: string, recordIds: string[]) {
  if (!tableName || recordIds.length === 0) {
    throw new Error('Table name and record IDs are required for bulk deletion');
  }

  console.log(`Bulk deleting ${recordIds.length} records from table: ${tableName}`);

  // Delete records in batches to avoid overwhelming the database
  const batchSize = 100;
  const deletedIds: string[] = [];
  const errors: Array<{ id: string; error: any }> = [];

  for (let i = 0; i < recordIds.length; i += batchSize) {
    const batch = recordIds.slice(i, i + batchSize);
    
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .in('id', batch);
      
      if (error) {
        console.error(`Batch deletion error:`, error);
        // Add all IDs in this batch to errors
        batch.forEach(id => errors.push({ id, error }));
      } else {
        deletedIds.push(...batch);
      }
    } catch (error) {
      console.error(`Batch deletion exception:`, error);
      // Add all IDs in this batch to errors
      batch.forEach(id => errors.push({ id, error }));
    }
  }

  return {
    deletedIds,
    errors,
    totalRequested: recordIds.length,
    totalDeleted: deletedIds.length,
    totalErrors: errors.length
  };
} 