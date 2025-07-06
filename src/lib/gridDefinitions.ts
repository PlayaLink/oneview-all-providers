import gridDefinitionsJson from "./gridDefinitions.json";

export interface GridDefinition {
  tableName: string;
  displayName: string;
  group: string;
  description?: string;
  icon?: string;
  color?: string;
  defaultVisible?: boolean;
  columns: string[];
}

export const gridDefinitions: GridDefinition[] = gridDefinitionsJson as GridDefinition[];

export function getGroups(): string[] {
  return Array.from(new Set(gridDefinitions.map((g) => g.group)));
}

export function getGridsByGroup(group: string): GridDefinition[] {
  return gridDefinitions.filter((g) => g.group === group);
}

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
