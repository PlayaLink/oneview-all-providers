import { stateLicenseTemplate } from '../components/sidepanel-details/StateLicenseDetails';
import { birthInfoTemplate } from '../components/sidepanel-details/BirthInfoDetails';
import { providerInfoTemplate } from '../components/sidepanel-details/ProviderInfoDetails';
import React from 'react';

// Interfaces (keep if used elsewhere)
export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  tabs: TabConfig[];
  fieldGroups: FieldGroup[];
  header?: (args: { gridName: string; row: any; provider?: any }) => string;
  DetailsComponent?: React.ComponentType<any>;
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  component?: string;
  enabled: boolean;
  fullLabel?: string;
  iconLabel?: string;
}

export interface FieldGroup {
  id: string;
  title: string;
  fields: any[];
}

// Mapping from grid table names to template IDs
export const gridToTemplateMap: Record<string, string> = {
  "Provider_Info": "provider_info",
  "State_Licenses": "state_licenses",
  "Birth_Info": "birth_info"
};

// Main function to get the template config for a grid
export function getTemplateConfigByGrid(gridName: string): TemplateConfig | null {
  if (gridName === "State_Licenses") {
    return stateLicenseTemplate;
  }
  if (gridName === "Birth_Info") {
    return birthInfoTemplate;
  }
  if (gridName === "Provider_Info") {
    return providerInfoTemplate;
  }
  return null;
} 