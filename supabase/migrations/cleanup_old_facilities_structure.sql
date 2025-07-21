-- =====================================================
-- CLEANUP OLD FACILITIES STRUCTURE
-- This migration removes old array-based columns and tables after restructure
-- =====================================================

-- Step 1: Remove old array columns from facilities table
-- =====================================================

-- Remove the old array columns that are no longer needed
ALTER TABLE facilities 
DROP COLUMN IF EXISTS facility_properties,
DROP COLUMN IF EXISTS requirements,
DROP COLUMN IF EXISTS providers;

-- Step 2: Remove old array-based indexes
-- =====================================================

DROP INDEX IF EXISTS idx_facilities_facility_properties;
DROP INDEX IF EXISTS idx_facilities_requirements;
DROP INDEX IF EXISTS idx_facilities_providers;

-- Step 3: Remove old data column from requirements table
-- =====================================================

-- The data column is no longer needed since we have proper foreign key relationships
ALTER TABLE requirements 
DROP COLUMN IF EXISTS data;

-- Step 4: Remove old indexes that are no longer needed
-- =====================================================

DROP INDEX IF EXISTS idx_requirements_data;

-- Step 5: Update any remaining references to old structure
-- =====================================================

-- Update any views or functions that might reference the old structure
-- This will be handled by the new views created in the restructure migration

-- Step 6: Verify cleanup
-- =====================================================

-- Check that all old columns are removed
DO $$
BEGIN
  -- Check facilities table structure
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'facilities' 
    AND column_name IN ('facility_properties', 'requirements', 'providers')
  ) THEN
    RAISE EXCEPTION 'Old array columns still exist in facilities table';
  END IF;
  
  -- Check requirements table structure
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'requirements' 
    AND column_name = 'data'
  ) THEN
    RAISE EXCEPTION 'Old data column still exists in requirements table';
  END IF;
  
  RAISE NOTICE 'Cleanup completed successfully';
END $$;

-- =====================================================
-- CLEANUP COMPLETE
-- ===================================================== 