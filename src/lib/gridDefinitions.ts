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

export function getGridByTableName(tableName: string): GridDefinition | undefined {
  return gridDefinitions.find((g) => g.tableName === tableName);
}

export function getAllGrids(): GridDefinition[] {
  return gridDefinitions;
}
