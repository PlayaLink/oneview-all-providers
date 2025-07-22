import { stateLicenseTemplate } from '../components/sidepanel-details/StateLicenseDetails';
import { birthInfoTemplate } from '../components/sidepanel-details/BirthInfoDetails';
import { providerInfoTemplate } from '../components/sidepanel-details/ProviderInfoDetails';
import React from 'react';
import AddressDetails from '../components/sidepanel-details/AddressDetails';
import FacilityAffiliationsDetails, { facilityAffiliationsFieldGroups } from '../components/sidepanel-details/FacilityAffiliationsDetails';

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

// Mapping from grid table names to template IDs - Updated to match all grids
export const gridToTemplateMap: Record<string, string> = {
  // Core provider grids
  "provider_info": "provider_info",
  "state_licenses": "state_licenses",
  "birth_info": "birth_info",
  "addresses": "addresses",
  
  // Facility system grids
  "facility_affiliations": "facility_affiliations",
  "facility_properties": "facility_properties",
  "facility_property_values": "facility_property_values",
  "facility_requirements": "facility_requirements",
  "facility_requirement_values": "facility_requirement_values",
  "facilities": "facilities",
  
  // Requirements system grids
  "requirements": "requirements",
  "requirement_data": "requirement_data",
  "requirement_data_fields": "requirement_data_fields",
  
  // Contact system grids
  "contacts": "contacts",
  
  // Document and notes grids
  "notes": "notes",
  "documents": "documents",
  
  // Grid system grids
  "grid_definitions": "grid_definitions",
  "grid_columns": "grid_columns",
  "grid_field_groups": "grid_field_groups",
  "grid_sections": "grid_sections",
  
  // Feature settings
  "feature_settings": "feature_settings"
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
      id: 'address_info',
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

export const facilityAffiliationsTemplate: TemplateConfig = {
  id: 'facility_affiliations',
  name: 'Facility Affiliations',
  description: 'Template for editing provider facility affiliations',
  tabs: [
    { id: 'details', label: 'Details', icon: 'hospital', enabled: true },
    { id: 'notes', label: 'Notes', icon: 'note-sticky', enabled: true },
    { id: 'documents', label: 'Documents', icon: 'folder', enabled: true },
  ],
  fieldGroups: facilityAffiliationsFieldGroups,
  header: ({ row }) => `Facility Affiliation for ${row.provider_name || ''}`,
  DetailsComponent: FacilityAffiliationsDetails,
};

// Main function to get the template config for a grid - Updated to handle all grids
export function getTemplateConfigByGrid(gridKey: string): TemplateConfig | null {
  // Normalize the grid key to lowercase for case-insensitive matching
  const normalizedKey = gridKey.toLowerCase();
  
  switch (normalizedKey) {
    // Core provider grids
    case "provider_info": return providerInfoTemplate;
    case "state_licenses": return stateLicenseTemplate;
    case "birth_info": return birthInfoTemplate;
    case "addresses": return addressTemplate;
    case "facility_affiliations": return facilityAffiliationsTemplate;
    
    // For grids without specific templates, return a default template
    default: {
      console.warn(`No specific template found for grid: ${gridKey} (normalized: ${normalizedKey}), using default template`);
      return {
        id: gridKey,
        name: gridKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: `Default template for ${gridKey}`,
        tabs: [
          { id: 'details', label: 'Details', icon: 'bars-staggered', enabled: true },
          { id: 'notes', label: 'Notes', icon: 'note-sticky', enabled: true },
          { id: 'documents', label: 'Documents', icon: 'folder', enabled: true },
        ],
        fieldGroups: [],
        header: ({ gridName, row }) => `${gridName} for ${row.id || 'Record'}`,
      };
    }
  }
} 