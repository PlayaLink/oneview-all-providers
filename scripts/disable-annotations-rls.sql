-- Disable RLS entirely for development (use with caution)
-- This will allow all operations without authentication

-- Disable RLS on annotations table
ALTER TABLE annotations DISABLE ROW LEVEL SECURITY;

-- Note: This is for development only. For production, you should:
-- 1. Re-enable RLS: ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;
-- 2. Create proper policies based on your authentication requirements
-- 3. Consider using user-specific policies if needed
