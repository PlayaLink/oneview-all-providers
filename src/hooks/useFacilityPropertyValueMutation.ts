import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFacilityPropertyValueByKey } from '@/lib/supabaseClient';

/**
 * Arguments for updating a facility property value.
 */
export type UpdateFacilityPropertyValueArgs = {
  facilityId: string;
  propertyKey: string;
  value: any;
};

/**
 * Custom React Query mutation hook for updating (or creating) a facility property value.
 * Automatically invalidates the facility query on success.
 */
export function useFacilityPropertyValueMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ facilityId, propertyKey, value }: UpdateFacilityPropertyValueArgs) => {
      return updateFacilityPropertyValueByKey(facilityId, propertyKey, value);
    },
    onSuccess: (_data, variables) => {
      // Invalidate facility data so UI updates everywhere
      queryClient.invalidateQueries({ queryKey: ['facility', variables.facilityId] });
      // Optionally: invalidate a list or other related queries
    },
    onError: (error) => {
      // Optionally: show a toast or log error
      console.error('Failed to update property value:', error);
    },
  });
} 