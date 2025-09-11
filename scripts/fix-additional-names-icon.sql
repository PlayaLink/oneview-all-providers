-- Fix Additional Names Grid Icon Format
-- Update the icon from FontAwesome format to kebab-case format

UPDATE grid_definitions 
SET icon = 'house-chimney-user'
WHERE key = 'additional_names' 
AND icon = 'faHouseChimneyUser';

-- Verify the update
SELECT 
    key,
    display_name,
    icon,
    CASE 
        WHEN icon = 'house-chimney-user' THEN '✅ CORRECT (kebab-case)'
        WHEN icon = 'faHouseChimneyUser' THEN '❌ INCORRECT (FontAwesome format)'
        ELSE '⚠️  UNKNOWN FORMAT'
    END as icon_status
FROM grid_definitions 
WHERE key = 'additional_names';
