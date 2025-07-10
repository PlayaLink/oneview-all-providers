import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { dbFetch, dbInsert, dbUpdate, dbDelete } from './dbClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';



export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

export async function updateProvider(id: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('providers')
    .update(updates)
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
  // ...add other fields as needed
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
  gender: z.string().optional(),
  identifies_transgender: z.string().optional(),
  hair_color: z.string().optional(),
  eye_color: z.string().optional(),
  height_ft: z.string().optional(),
  height_in: z.string().optional(),
  weight_lbs: z.string().optional(),
  ethnicity: z.string().optional(),
  tags: z.array(z.string()).nullable().optional(),
  provider: z.any().optional(),
  // ...add other fields as needed
});

// Per-table helpers using dbFetch
export function fetchProviders() {
  return dbFetch('providers', '*', ProviderSchema);
}

export function fetchStateLicenses() {
  return dbFetch(
    'state_licenses',
    '*,provider:providers(id,first_name,last_name,title,primary_specialty)',
    StateLicenseSchema
  );
}

export function fetchBirthInfo() {
  return dbFetch(
    'birth_info',
    '*,provider:providers(id,first_name,last_name,title,primary_specialty)',
    BirthInfoSchema
  );
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