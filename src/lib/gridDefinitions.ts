import gridDefinitionsJson from "./gridDefinitions.json";

export interface GridDefinition {
  group: string;
  tableName: string;
  icon: string;
  columns: string[];
  actions?: string[];
}

// Import the complete grid definitions from JSON
export const gridDefinitions: GridDefinition[] = gridDefinitionsJson.map(
  (grid) => ({
    group: grid.group,
    tableName: grid.tableName,
    icon: grid.icon,
    columns: grid.columns,
    actions: [],
  }),
);

// Utility functions for working with grid definitions
export const getGroups = (): string[] => {
  const groups: string[] = [];
  const seenGroups = new Set<string>();
  
  // Preserve order as they appear in the JSON
  gridDefinitions.forEach((grid) => {
    if (!seenGroups.has(grid.group)) {
      groups.push(grid.group);
      seenGroups.add(grid.group);
    }
  });
  
  return groups;
};

export const getGridsByGroup = (group: string): GridDefinition[] => {
  // Preserve order as they appear in the JSON
  return gridDefinitions.filter((grid) => grid.group === group);
};

export const getVisibleGroups = (visibleSections: Set<string>): string[] => {
  if (visibleSections.size === 0) {
    return getGroups();
  }

  const groups: string[] = [];
  const seenGroups = new Set<string>();
  
  // Preserve order as they appear in the JSON
  gridDefinitions.forEach((grid) => {
    if (visibleSections.has(grid.tableName) && !seenGroups.has(grid.group)) {
      groups.push(grid.group);
      seenGroups.add(grid.group);
    }
  });

  return groups;
};
