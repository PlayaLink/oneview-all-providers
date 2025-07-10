import { stateLicenseTemplate } from '../components/sidepanel-details/StateLicenseDetails';
import { birthInfoTemplate } from '../components/sidepanel-details/BirthInfoDetails';
import { providerInfoTemplate } from '../components/sidepanel-details/ProviderInfoDetails';
import React from 'react';
import AddressDetails from '../components/sidepanel-details/AddressDetails';

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
  "Birth_Info": "birth_info",
  "Addresses": "addresses"
};

export const addressTemplate: TemplateConfig = {
  id: 'addresses',
  name: 'Addresses',
  description: 'Template for editing provider addresses',
  tabs: [
    { id: 'details', label: 'Details', icon: 'house-chimney', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'note-sticky', enabled: true },
    { id: 'documents', label: 'Documents', icon: 'folder', enabled: true },
  ],
  fieldGroups: [
    {
      id: 'address-info',
      title: 'Address Information',
      fields: [
        { key: 'type', label: 'Type', type: 'text' },
        { key: 'address', label: 'Address', type: 'text' },
        { key: 'address_2', label: 'Address 2', type: 'text' },
        { key: 'city', label: 'City', type: 'text' },
        { key: 'state', label: 'State', type: 'text' },
        { key: 'zip_postal_code', label: 'Zip/Postal Code', type: 'text' },
        { key: 'tags', label: 'Tags', type: 'text' },
      ],
    },
  ],
  header: ({ row }) => `Address for ${row.provider_name || ''}`,
  DetailsComponent: AddressDetails,
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
  if (gridName === "Addresses") {
    return addressTemplate;
  }
  return null;
} 