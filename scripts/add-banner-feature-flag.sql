-- Add Banner feature flag to feature_settings table
-- This script adds a new feature flag to control the Banner component visibility

-- Insert the Banner feature flag
INSERT INTO feature_settings (setting_key, setting_value, label, description)
VALUES (
  'banner',
  false, -- Default to false (disabled)
  'Banner Component',
  'Controls the visibility of the Banner component at the top of the application, above the global navigation'
)
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Verify the insertion
SELECT 
  setting_key,
  setting_value,
  label,
  description,
  created_at,
  updated_at
FROM feature_settings 
WHERE setting_key = 'banner';

-- Show all feature settings for reference
SELECT 
  setting_key,
  setting_value,
  label,
  description
FROM feature_settings 
ORDER BY setting_key;
