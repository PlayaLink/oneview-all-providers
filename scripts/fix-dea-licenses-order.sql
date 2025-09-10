-- Update the order of DEA Licenses in the Licensure group
-- Set DEA Licenses to come after State Licenses

-- First, check current order in Licensure group
SELECT 
    display_name,
    "order",
    "group"
FROM public.grid_definitions 
WHERE "group" = 'Licensure'
ORDER BY "order";

-- Update DEA Licenses order to come after State Licenses
-- Assuming State Licenses has order 1, set DEA Licenses to order 2
UPDATE public.grid_definitions 
SET "order" = 2
WHERE display_name = 'DEA Licenses' AND "group" = 'Licensure';

-- If there are other grids in Licensure group, we may need to adjust their order
-- Let's check what other grids are in the Licensure group
SELECT 
    display_name,
    "order",
    "group"
FROM public.grid_definitions 
WHERE "group" = 'Licensure'
ORDER BY "order";

-- If needed, adjust other grids' order to maintain proper sequence
-- For example, if there's a "Controlled Substance" grid, set it to order 3
-- UPDATE public.grid_definitions 
-- SET "order" = 3
-- WHERE display_name = 'Controlled Substance' AND "group" = 'Licensure';
