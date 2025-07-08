import { createClient } from '@supabase/supabase-js';

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

export async function fetchStateLicenses() {
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
    `);
  if (error) throw error;
  return data;
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