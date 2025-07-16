// Utility for DRY ordering/grouping of sections and grids
// Usage: import { getOrderedSectionsAndGrids } from './gridOrdering';

export function getOrderedSectionsAndGrids(gridSections, gridDefs, filterSet = null) {
  // 1. Sort sections by order
  const orderedSections = Array.isArray(gridSections)
    ? [...gridSections].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    : [];
  // 2. For each section, get and sort grids
  const grouped = orderedSections.map(section => {
    let grids = gridDefs.filter(g => g.group === section.key);
    if (filterSet && filterSet.size > 0) {
      grids = grids.filter(g => filterSet.has(g.table_name || g.key));
    }
    grids = grids.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
    return { section, grids };
  });
  // 3. Flatten for flat rendering (with section headers)
  const flat = [];
  grouped.forEach(({ section, grids }) => {
    if (grids.length > 0) {
      flat.push({ type: 'section', section });
      grids.forEach(grid => flat.push({ type: 'grid', grid, section }));
    }
  });
  return { grouped, flat };
} 