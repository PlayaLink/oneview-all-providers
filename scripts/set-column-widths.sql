-- SQL script to set all column widths to 250px
-- This script updates all columns in the grid_columns table

-- First, let's see the current state
SELECT 
  COUNT(*) as total_columns,
  COUNT(width) as columns_with_width,
  COUNT(*) - COUNT(width) as columns_without_width
FROM grid_columns;

-- Show current width distribution
SELECT 
  COALESCE(width::text, 'null') as width_px,
  COUNT(*) as column_count
FROM grid_columns 
GROUP BY width 
ORDER BY 
  CASE WHEN width IS NULL THEN 1 ELSE 0 END,
  width;

-- Update all columns to 250px width
UPDATE grid_columns 
SET width = 250 
WHERE width IS NULL OR width != 250;

-- Verify the update
SELECT 
  COUNT(*) as total_columns,
  COUNT(width) as columns_with_width,
  COUNT(*) - COUNT(width) as columns_without_width
FROM grid_columns;

-- Show final width distribution
SELECT 
  COALESCE(width::text, 'null') as width_px,
  COUNT(*) as column_count
FROM grid_columns 
GROUP BY width 
ORDER BY 
  CASE WHEN width IS NULL THEN 1 ELSE 0 END,
  width;

-- Show a sample of updated columns
SELECT 
  id,
  name,
  display_name,
  width
FROM grid_columns 
ORDER BY display_name 
LIMIT 10; 