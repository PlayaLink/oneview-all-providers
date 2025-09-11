// Utility for DRY ordering/grouping of sections and grids
// Usage: import { getOrderedSectionsAndGrids } from './gridOrdering';

export function getOrderedSectionsAndGrids(gridSections, gridDefs, filterSet = null) {
  console.log('🔍 getOrderedSectionsAndGrids Debug:', {
    gridSections: gridSections?.length || 0,
    gridDefs: gridDefs?.length || 0,
    filterSet: filterSet?.size || 0,
    gridSectionsData: gridSections?.map(s => ({ key: s.key, name: s.name, order: s.order })),
    gridDefsData: gridDefs?.map(g => ({ key: g.key, display_name: g.display_name, group: g.group, order: g.order }))
  });

  // 1. Sort sections by order
  const orderedSections = Array.isArray(gridSections)
    ? [...gridSections].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    : [];
  
  console.log('📊 Ordered sections:', orderedSections.map(s => ({ key: s.key, name: s.name, order: s.order })));
  
  // 2. For each section, get and sort grids
  const grouped = orderedSections.map(section => {
    let grids = gridDefs.filter(g => g.group === section.key);
    console.log(`📊 Section "${section.key}" grids before filter:`, grids.map(g => g.display_name));
    
    if (filterSet && filterSet.size > 0) {
      grids = grids.filter(g => filterSet.has(g.table_name || g.key));
      console.log(`📊 Section "${section.key}" grids after filter:`, grids.map(g => g.display_name));
    }
    grids = grids.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
    return { section, grids };
  });
  
  console.log('📊 Grouped result:', grouped.map(g => ({ 
    sectionKey: g.section.key, 
    sectionName: g.section.name, 
    gridCount: g.grids.length,
    grids: g.grids.map(grid => grid.display_name)
  })));
  
  // 3. Flatten for flat rendering (with section headers)
  const flat = [];
  grouped.forEach(({ section, grids }) => {
    if (grids.length > 0) {
      flat.push({ type: 'section', section });
      grids.forEach(grid => flat.push({ type: 'grid', grid, section }));
    }
  });
  
  console.log('📊 Flat result:', flat.map(item => ({
    type: item.type,
    gridKey: item.grid?.key,
    gridDisplayName: item.grid?.display_name,
    sectionKey: item.section?.key
  })));
  
  return { grouped, flat };
} 