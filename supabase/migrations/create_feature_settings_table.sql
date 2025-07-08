-- Create feature_settings table for global application settings
CREATE TABLE IF NOT EXISTS feature_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on setting_key for fast lookups
CREATE INDEX IF NOT EXISTS idx_feature_settings_key ON feature_settings(setting_key);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feature_settings_updated_at 
    BEFORE UPDATE ON feature_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO feature_settings (setting_key, setting_value, description) VALUES
    ('grid_section_navigation', '"left-nav"', 'Navigation mode for grid sections: left-nav or horizontal')
ON CONFLICT (setting_key) DO NOTHING;

-- Grant permissions (adjust based on your RLS policies)
ALTER TABLE feature_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read settings
CREATE POLICY "Allow authenticated users to read feature settings" ON feature_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow only specific users or roles to update settings (you can modify this)
CREATE POLICY "Allow authenticated users to update feature settings" ON feature_settings
    FOR UPDATE USING (auth.role() = 'authenticated'); 