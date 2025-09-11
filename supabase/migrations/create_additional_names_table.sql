-- Create additional_names table
-- This table stores additional names for providers

CREATE TABLE IF NOT EXISTS additional_names (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    title TEXT,
    start_date DATE,
    end_date DATE,
    tags TEXT[] DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_additional_names_provider_id ON additional_names(provider_id);
CREATE INDEX IF NOT EXISTS idx_additional_names_type ON additional_names(type);
CREATE INDEX IF NOT EXISTS idx_additional_names_last_name ON additional_names(last_name);
CREATE INDEX IF NOT EXISTS idx_additional_names_start_date ON additional_names(start_date);
CREATE INDEX IF NOT EXISTS idx_additional_names_end_date ON additional_names(end_date);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_additional_names_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_additional_names_updated_at
    BEFORE UPDATE ON additional_names
    FOR EACH ROW
    EXECUTE FUNCTION update_additional_names_updated_at();

-- Disable RLS for development
ALTER TABLE additional_names DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON additional_names TO public;

-- Add comments
COMMENT ON TABLE additional_names IS 'Additional names for providers including alternate names, authorized signers, etc.';
COMMENT ON COLUMN additional_names.type IS 'Type of additional name (Alternate Supervisor Name, Authorized Signer, etc.)';
COMMENT ON COLUMN additional_names.first_name IS 'First name';
COMMENT ON COLUMN additional_names.middle_name IS 'Middle name (optional)';
COMMENT ON COLUMN additional_names.last_name IS 'Last name';
COMMENT ON COLUMN additional_names.title IS 'Professional title (optional)';
COMMENT ON COLUMN additional_names.start_date IS 'Start date for this name (optional)';
COMMENT ON COLUMN additional_names.end_date IS 'End date for this name (optional)';
COMMENT ON COLUMN additional_names.tags IS 'Tags for categorization';
COMMENT ON COLUMN additional_names.last_updated IS 'Last updated timestamp for tracking changes';
