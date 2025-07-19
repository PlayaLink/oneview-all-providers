import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIconByName } from '@/lib/iconMapping';

interface FacilityProperty {
  id?: string;
  key?: string;
  label?: string;
  type?: string;
  group?: string;
  value?: any;
  is_required?: boolean;
  validation_rules?: any;
}

interface FacilityPropertiesProps {
  facility: {
    id: string;
    label: string;
    icon?: string;
    properties?: FacilityProperty[];
  };
}

export const FacilityProperties: React.FC<FacilityPropertiesProps> = ({ facility }) => {
  const properties = facility.properties || [];

  // Group properties by their group
  const groupedProperties = properties.reduce((acc, property) => {
    const group = property.group || 'general';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(property);
    return acc;
  }, {} as Record<string, FacilityProperty[]>);

  const formatValue = (value: any, type: string) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">Not set</span>;
    }

    switch (type) {
      case 'boolean':
        return (
          <Badge variant={value ? "default" : "secondary"}>
            {value ? "Yes" : "No"}
          </Badge>
        );
      case 'number':
        return <span className="font-mono">{value}</span>;
      case 'single-select':
        return <Badge variant="outline">{value}</Badge>;
      case 'multi-select':
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          );
        }
        return <span>{value}</span>;
      case 'text':
      default:
        return <span>{value}</span>;
    }
  };

  const getGroupIcon = (group: string) => {
    const iconMap: Record<string, string> = {
      'general': '🏢',
      'capacity': '📊',
      'contact': '📞',
      'location': '📍',
      'settings': '⚙️',
      'credentials': '🔐',
      'billing': '💰',
      'compliance': '✅',
      'equipment': '🔧',
      'staffing': '👥'
    };
    return iconMap[group] || '📋';
  };

  const getGroupTitle = (group: string) => {
    return group.charAt(0).toUpperCase() + group.slice(1).replace(/_/g, ' ');
  };

  return (
    <div className="space-y-6" data-testid="facility-properties">
      {/* Header */}
      <Card data-testid="facility-properties-header">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {facility.icon && (
              <FontAwesomeIcon icon={getIconByName(facility.icon)} className="w-5 h-5" />
            )}
            {facility.label} - Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" data-testid="properties-count">
              {properties.length} Properties
            </Badge>
            <span className="text-sm text-muted-foreground">
              Organized into {Object.keys(groupedProperties).length} groups
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Properties by Group */}
      {Object.keys(groupedProperties).length > 0 ? (
        Object.entries(groupedProperties).map(([group, groupProperties]) => (
          <Card key={group} data-testid={`properties-group-${group}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span role="img" aria-label={`${group} icon`}>
                  {getGroupIcon(group)}
                </span>
                {getGroupTitle(group)}
                <Badge variant="outline" className="ml-auto">
                  {groupProperties.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupProperties.map((property) => (
                  <div 
                    key={property.id} 
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    data-testid={`property-${property.key}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-900">
                          {property.label}
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {property.type}
                          </Badge>
                          {property.is_required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Label className="text-xs text-gray-600">Value</Label>
                      <div className="mt-1">
                        {formatValue(property.value, property.type)}
                      </div>
                    </div>

                    {property.validation_rules && (
                      <div className="mt-3">
                        <Label className="text-xs text-gray-600">Validation Rules</Label>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {JSON.stringify(property.validation_rules)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card data-testid="no-properties">
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-4xl mb-2" role="img" aria-label="No properties icon">
                📭
              </div>
              <p className="text-muted-foreground">No properties found for this facility.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card data-testid="facility-properties-actions">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              data-testid="add-property-btn"
            >
              <span role="img" aria-label="Add icon">➕</span>
              Add Property
            </button>
            <button 
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              data-testid="edit-properties-btn"
            >
              <span role="img" aria-label="Edit icon">✏️</span>
              Edit Properties
            </button>
            <button 
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              data-testid="export-properties-btn"
            >
              <span role="img" aria-label="Export icon">📤</span>
              Export Properties
            </button>
            <button 
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              data-testid="import-properties-btn"
            >
              <span role="img" aria-label="Import icon">📥</span>
              Import Properties
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 