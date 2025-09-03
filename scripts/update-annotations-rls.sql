-- Update RLS policies to be more permissive for development
-- Drop existing policies first
DROP POLICY IF EXISTS "Allow authenticated users to read annotations" ON annotations;
DROP POLICY IF EXISTS "Allow authenticated users to insert annotations" ON annotations;
DROP POLICY IF EXISTS "Allow authenticated users to update annotations" ON annotations;
DROP POLICY IF EXISTS "Allow authenticated users to delete annotations" ON annotations;

-- Create more permissive policies for development
-- Allow all operations for now (can be restricted later)
CREATE POLICY "Allow all operations for annotations" ON annotations
  FOR ALL USING (true);

-- Alternative: If you want to keep some security, use these policies instead:
-- CREATE POLICY "Allow read annotations" ON annotations
--   FOR SELECT USING (true);
-- 
-- CREATE POLICY "Allow insert annotations" ON annotations
--   FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Allow update annotations" ON annotations
--   FOR UPDATE USING (true);
-- 
-- CREATE POLICY "Allow delete annotations" ON annotations
--   FOR DELETE USING (true);
