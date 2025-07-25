-- Reverse/Undo the grid actions setup
-- Run this SQL to clean up the changes made by setup-grid-actions.sql

-- First, remove all the grid actions that were inserted
DELETE FROM public.grid_actions 
WHERE grid_id IN (
  SELECT id FROM public.grid_definitions 
  WHERE display_name IN (
    'ready-only',
    '...',
    'Verifications',
    'Provider Info',
    'Birth Info',
    'Addresses',
    'Additional Names',
    'CAQH',
    'Health Info',
    'State Licenses',
    'DEA Licenses',
    'Controlled Substance',
    'Event Log',
    'OIG',
    'Board Certifications',
    'Other Certifications',
    'Education & Training',
    'Exams',
    'Practice/Employer',
    'Facility Affiliations',
    'Work History',
    'Peer References',
    'Military Experience',
    'Malpractice Insurance',
    'Documents'
  )
);

-- Remove the actions that were inserted
DELETE FROM public.actions 
WHERE name IN (
  'download',
  'attachment',
  'notification',
  'grid',
  'flag',
  'delete',
  'toggle',
  'star',
  'verified'
);

-- Remove the helper functions that were created
DROP FUNCTION IF EXISTS get_action_id(text);
DROP FUNCTION IF EXISTS get_grid_id(text);

-- Verify the cleanup
SELECT 'Actions table count:' as info, COUNT(*) as count FROM public.actions
UNION ALL
SELECT 'Grid actions table count:', COUNT(*) FROM public.grid_actions; 