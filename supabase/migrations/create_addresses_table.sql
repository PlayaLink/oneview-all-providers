-- Migration: Create addresses table
CREATE TABLE addresses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id uuid NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    type text,
    address text,
    address_2 text,
    city text,
    state text,
    zip_postal_code text,
    phone_number text,
    email text,
    start_date date,
    end_date date,
    county text,
    country text,
    tags text[],
    last_updated timestamptz DEFAULT now()
);

-- Index for faster lookups by provider
CREATE INDEX idx_addresses_provider_id ON addresses(provider_id); 