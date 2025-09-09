-- Add user_name column to annotations table
-- This migration adds user tracking to annotations

-- Add the user_name column
ALTER TABLE annotations 
ADD COLUMN user_name TEXT;

-- Add index for faster queries by user_name
CREATE INDEX IF NOT EXISTS idx_annotations_user_name ON annotations(user_name);

-- Add comment for documentation
COMMENT ON COLUMN annotations.user_name IS 'Name of the user who created the annotation';

-- Update existing annotations with a default value (optional)
-- You can customize this based on your needs
UPDATE annotations 
SET user_name = 'Unknown User' 
WHERE user_name IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE annotations 
ALTER COLUMN user_name SET NOT NULL;
