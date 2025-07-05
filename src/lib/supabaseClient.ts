import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nsqushsijqnlstgwgkzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function updateProvider(id: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from('providers')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data;
} 