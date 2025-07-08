import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

// Fetch functions for each grid
const fetchProviders = async () => {
  const { data, error } = await supabase.from('providers').select('*');
  if (error) throw error;
  return data;
};

const fetchStateLicenses = async () => {
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
};

const fetchBirthInfo = async () => {
  const { data, error } = await supabase
    .from('birth_info')
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
};

// Central hook
export function useGridData(gridName: string) {
  switch (gridName) {
    case 'Provider_Info':
      return useQuery({
        queryKey: ['providers'],
        queryFn: fetchProviders,
      });
    case 'State_Licenses':
      return useQuery({
        queryKey: ['state_licenses'],
        queryFn: fetchStateLicenses,
      });
    case 'Birth_Info':
      return useQuery({
        queryKey: ['birth_info'],
        queryFn: fetchBirthInfo,
      });
    default:
      return { data: [], isLoading: false, error: null };
  }
} 