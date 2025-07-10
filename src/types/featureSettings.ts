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
  dark_mode: boolean;
  compact_view: boolean;
  auto_save: boolean;
}

export type FeatureSettingKey = keyof FeatureSettings;

// Default settings
export const DEFAULT_FEATURE_SETTINGS: FeatureSettings = {
  grid_section_navigation: 'left-nav',
  dark_mode: false,
  compact_view: false,
  auto_save: true
}; 