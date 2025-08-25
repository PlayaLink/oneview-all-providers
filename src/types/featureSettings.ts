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
  grid_scroll_arrows_left: boolean; // Feature flag for grid scroll arrows direction
  user_authentication: boolean; // Feature flag for user authentication
  all_providers_tab: boolean; // Feature flag for all providers tab
  new_nav_option_1: boolean; // Feature flag for new navigation option
  new_sidepanel: boolean; // Feature flag for new side panel
  scroll_to_expires_within: boolean; // Feature flag for scrolling to Expires Within column
}

export type FeatureSettingKey = keyof FeatureSettings;

export const DEFAULT_FEATURE_SETTINGS: FeatureSettings = {
  left_nav: true,
  footer: true,
  floating_filters: false, // Default to false (off)
  grid_scroll_arrows_left: false, // Default to false (right direction)
  user_authentication: true, // Default to true (auth required)
  all_providers_tab: true, // Default to true (tab visible)
  new_nav_option_1: false, // Default to false (legacy nav)
  new_sidepanel: true, // Default to true (use new side panel)
  scroll_to_expires_within: false, // Default to false (scroll behavior off)
}; 