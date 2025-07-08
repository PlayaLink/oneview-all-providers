export interface FeatureSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureSettings {
  grid_section_navigation: 'left-nav' | 'horizontal';
}

export type FeatureSettingKey = keyof FeatureSettings;

// Default settings
export const DEFAULT_FEATURE_SETTINGS: FeatureSettings = {
  grid_section_navigation: 'left-nav'
}; 