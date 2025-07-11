export interface FeatureSetting {
  id: string;
  setting_key: string;
  setting_value: boolean;
  label?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureSettings {
  left_nav: boolean;
  footer: boolean;
  floating_filters: boolean; // Feature flag for floating filters
}

export type FeatureSettingKey = keyof FeatureSettings;

export const DEFAULT_FEATURE_SETTINGS: FeatureSettings = {
  left_nav: true,
  footer: true,
  floating_filters: false, // Default to false (off)
}; 