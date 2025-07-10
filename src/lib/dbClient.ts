import { supabase } from './supabaseClient';
import { z } from 'zod';

// Generic fetch
export async function dbFetch<T>(table: string, select: string, schema: z.ZodType<T>): Promise<T[]> {
  const { data, error } = await supabase.from(table).select(select);
  if (error) throw error;
  if (!Array.isArray(data)) throw new Error(`${table} data is not an array`);
  if (data.length > 0) {
    console.log(`[dbFetch] First row for table ${table}:`, data[0]);
  }
  try {
    data.forEach(row => schema.parse(row));
  } catch (e) {
    console.error(`[dbFetch] Zod validation error for table ${table}:`, e);
    throw e;
  }
  return data as T[];
}

// Generic insert
export async function dbInsert<T>(table: string, values: Partial<T>[], schema: z.ZodType<T>): Promise<T[]> {
  const { data, error } = await supabase.from(table).insert(values).select();
  if (error) throw error;
  if (!Array.isArray(data)) throw new Error(`${table} insert did not return an array`);
  data.forEach(row => schema.parse(row));
  return data as T[];
}

// Generic update
export async function dbUpdate<T>(table: string, id: string, updates: Partial<T>, schema: z.ZodType<T>): Promise<T> {
  const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single();
  if (error) throw error;
  schema.parse(data);
  return data as T;
}

// Generic delete
export async function dbDelete(table: string, id: string): Promise<boolean> {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
} 