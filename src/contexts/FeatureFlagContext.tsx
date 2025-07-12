import React, { createContext, useContext, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFeatureSettings, updateFeatureSetting } from "@/lib/supabaseClient";
import { FeatureSetting, FeatureSettings, FeatureSettingKey, DEFAULT_FEATURE_SETTINGS } from "@/types/featureSettings";

// Context type
type FeatureFlagContextType = {
  flags: FeatureSettings;
  allSettings: FeatureSetting[];
  isLoading: boolean;
  updateFlag: (key: FeatureSettingKey, value: boolean) => void;
};

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: settingsData = [], isLoading } = useQuery<FeatureSetting[]>({
    queryKey: ["feature-settings"],
    queryFn: fetchFeatureSettings,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const flags: FeatureSettings = useMemo(() => {
    return (
      settingsData.reduce((acc, setting) => {
        (acc as any)[setting.setting_key as FeatureSettingKey] = setting.setting_value;
        return acc;
      }, { ...DEFAULT_FEATURE_SETTINGS })
    );
  }, [settingsData]);

  const mutation = useMutation({
    mutationFn: ({ key, value }: { key: FeatureSettingKey; value: boolean }) =>
      updateFeatureSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-settings"] });
    },
  });

  const updateFlag = (key: FeatureSettingKey, value: boolean) => {
    mutation.mutate({ key, value });
  };

  return (
    <FeatureFlagContext.Provider value={{ flags, allSettings: settingsData, isLoading, updateFlag }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export function useFeatureFlags() {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) throw new Error("useFeatureFlags must be used within a FeatureFlagProvider");
  return ctx;
}

export function useFeatureFlag(key: FeatureSettingKey) {
  const { flags, isLoading, updateFlag } = useFeatureFlags();
  console.log("flags", flags);
  return {
    value: flags[key],
    isLoading,
    setValue: (value: boolean) => updateFlag(key, value),
  };
} 