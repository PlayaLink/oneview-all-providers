import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchFeatureSettings, 
  fetchFeatureSetting, 
  updateFeatureSetting,
  upsertFeatureSetting 
} from '@/lib/supabaseClient';
import { FeatureSettings, FeatureSettingKey, DEFAULT_FEATURE_SETTINGS, FeatureSetting } from '@/types/featureSettings';

export function useFeatureSettings() {
  const queryClient = useQueryClient();

  // Fetch all feature settings
  const { data: settingsData, isLoading, error } = useQuery<FeatureSetting[]>({
    queryKey: ['feature-settings'],
    queryFn: fetchFeatureSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime renamed to gcTime in v5)
  });

  // Parse settings into a more usable format
  const settings: FeatureSettings = settingsData?.reduce((acc, setting) => {
    (acc as any)[setting.setting_key as FeatureSettingKey] = setting.setting_value;
    return acc;
  }, {} as FeatureSettings) || DEFAULT_FEATURE_SETTINGS;

  // Mutation for updating a single setting
  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) => 
      updateFeatureSetting(key, value),
    onSuccess: () => {
      // Invalidate and refetch settings
      queryClient.invalidateQueries({ queryKey: ['feature-settings'] });
    },
  });

  // Mutation for upserting a setting
  const upsertSettingMutation = useMutation({
    mutationFn: ({ key, value, description }: { key: string; value: any; description?: string }) => 
      upsertFeatureSetting(key, value, description),
    onSuccess: () => {
      // Invalidate and refetch settings
      queryClient.invalidateQueries({ queryKey: ['feature-settings'] });
    },
  });

  // Function to update a setting
  const updateSetting = useCallback((key: FeatureSettingKey, value: any) => {
    updateSettingMutation.mutate({ key, value });
  }, [updateSettingMutation]);

  // Function to upsert a setting
  const upsertSetting = useCallback((key: string, value: any, description?: string) => {
    upsertSettingMutation.mutate({ key, value, description });
  }, [upsertSettingMutation]);

  return {
    settings,
    isLoading,
    error,
    updateSetting,
    upsertSetting,
    isUpdating: updateSettingMutation.isPending || upsertSettingMutation.isPending,
  };
}

// Hook for a single setting
export function useFeatureSetting(key: FeatureSettingKey) {
  const queryClient = useQueryClient();

  const { data: setting, isLoading, error } = useQuery<FeatureSetting>({
    queryKey: ['feature-setting', key],
    queryFn: () => fetchFeatureSetting(key),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime renamed to gcTime in v5)
  });

  const updateSettingMutation = useMutation({
    mutationFn: (value: any) => updateFeatureSetting(key, value),
    onSuccess: () => {
      // Invalidate both single setting and all settings
      queryClient.invalidateQueries({ queryKey: ['feature-setting', key] });
      queryClient.invalidateQueries({ queryKey: ['feature-settings'] });
    },
  });

  const updateSetting = useCallback((value: any) => {
    updateSettingMutation.mutate(value);
  }, [updateSettingMutation]);

  return {
    setting: setting?.setting_value,
    isLoading,
    error,
    updateSetting,
    isUpdating: updateSettingMutation.isPending,
  };
} 