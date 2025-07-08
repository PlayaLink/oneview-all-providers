-- Migration: Create birth_info table
CREATE TABLE IF NOT EXISTS birth_info (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    date_of_birth date,
    country_of_citizenship text,
    citizenship_work_auth text,
    us_work_auth text,
    tags text[],
    last_updated timestamptz DEFAULT now()
);

-- Index for fast lookup by provider
CREATE INDEX IF NOT EXISTS idx_birth_info_provider_id ON birth_info(provider_id); 