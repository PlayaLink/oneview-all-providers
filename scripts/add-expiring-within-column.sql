-- Add expiring_within column to grid_definitions table
-- This column will store the default number of days for expiring filters

ALTER TABLE grid_definitions 
ADD COLUMN expiring_within INTEGER DEFAULT 30;

-- Add a comment to document the column purpose
COMMENT ON COLUMN grid_definitions.expiring_within IS 'Default number of days to consider records as expiring (e.g., 30 for 30 days)';

-- Update existing grid definitions with default values if needed
-- You can customize these values based on your specific grid requirements
UPDATE grid_definitions 
SET expiring_within = 30 
WHERE expiring_within IS NULL; 