-- Migration: Migrate to Boolean Feature Flags
-- This migration updates the feature_settings table to use boolean values
-- and replaces the old string-based navigation with boolean flags

-- First, drop the old grid_section_navigation setting if it exists
DELETE FROM feature_settings WHERE setting_key = 'grid_section_navigation';

-- Insert the new boolean-based feature flags
INSERT INTO feature_settings (setting_key, setting_value, label, description) VALUES
('left_nav', 'true', 'Left Navigation', 'Enable left sidebar navigation'),
('footer', 'true', 'Footer', 'Show application footer')
ON CONFLICT (setting_key) DO NOTHING;

-- Update the table structure to ensure setting_value is properly typed as JSONB
-- (This is already the case, but we're documenting it here)

-- Add a comment to the table for documentation
COMMENT ON TABLE feature_settings IS 'Global feature flags stored as boolean values in JSONB format';

-- Add comments to the columns
COMMENT ON COLUMN feature_settings.setting_key IS 'Unique identifier for the feature flag';
COMMENT ON COLUMN feature_settings.setting_value IS 'Boolean value stored as JSONB (true/false)';
COMMENT ON COLUMN feature_settings.label IS 'Human-readable label for the feature flag';
COMMENT ON COLUMN feature_settings.description IS 'Detailed description of what the feature flag controls'; 