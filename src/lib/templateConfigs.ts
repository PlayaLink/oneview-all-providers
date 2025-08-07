import { stateLicenseTemplate } from '../components/sidepanel-details/StateLicenseDetails';
import { stateLicenseWideTemplate } from '../components/sidepanel-details/StateLicenseDetailsWide';
import { birthInfoTemplate } from '../components/sidepanel-details/BirthInfoDetails';
import { providerInfoTemplate } from '../components/sidepanel-details/ProviderInfoDetails';
import { providerInfoWideTemplate } from '../components/sidepanel-details/ProviderInfoDetailsWide';
import { addressTemplate } from '../components/sidepanel-details/AddressDetails';
import { facilityAffiliationsTemplate } from '../components/sidepanel-details/FacilityAffiliationsDetails';
import { generateDefaultHeaderText } from './utils';
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
  // Add support for context-specific components
  getDetailsComponent?: (context: 'sidepanel' | 'modal') => React.ComponentType<any>;
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



// Main function to get the template config for a grid - Updated to handle all grids
export function getTemplateConfigByGrid(gridKey: string, context?: 'sidepanel' | 'modal'): TemplateConfig | null {
  // Normalize the grid key to lowercase for case-insensitive matching
  const normalizedKey = gridKey.toLowerCase();
  
  switch (normalizedKey) {
    // Core provider grids
    case "provider_info": {
      // For provider_info, use different components based on context
      if (context === 'modal') {
        return {
          ...providerInfoWideTemplate,
          getDetailsComponent: (ctx: 'sidepanel' | 'modal') => {
            return ctx === 'modal' ? providerInfoWideTemplate.DetailsComponent : providerInfoTemplate.DetailsComponent;
          }
        };
      }
      return providerInfoTemplate;
    }
    case "state_licenses": {
      if (context === 'modal') {
        return {
          ...stateLicenseWideTemplate,
          getDetailsComponent: (ctx: 'sidepanel' | 'modal') => {
            return ctx === 'modal' ? stateLicenseWideTemplate.DetailsComponent : stateLicenseTemplate.DetailsComponent;
          }
        };
      }
      return stateLicenseTemplate;
    }
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
          { id: 'notes', label: 'Notes', icon: 'comment', enabled: true },
          { id: 'documents', label: 'Documents', icon: 'file-lines', enabled: true },
        ],
        fieldGroups: [],
        header: ({ gridName, row, provider }) => generateDefaultHeaderText({ gridName, provider }) || `${gridName} for ${row.id || 'Record'}`,
      };
    }
  }
} 