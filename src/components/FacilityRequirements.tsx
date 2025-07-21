import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIconByName } from '@/lib/iconMapping';

interface FacilityRequirement {
  id?: string;
  key?: string;
  label?: string;
  group?: string;
  type?: string;
  note?: string | null;
  visible?: boolean;
  required?: boolean;
}

interface RequirementValue {
  id: string;
  facility_id: string;
  requirement_id: string;
  requirement_data_id: string;
  value: any;
  facility?: { label: string };
  requirement?: { key: string; label: string };
  requirement_data?: { key: string; label: string; data_type: string };
}

interface FacilityRequirementsProps {
  facility: {
    id: string;
    label: string;
    icon?: string;
    requirements?: FacilityRequirement[];
  };
  requirementValues?: RequirementValue[];
}

export const FacilityRequirements: React.FC<FacilityRequirementsProps> = ({ 
  facility, 
  requirementValues = [] 
}) => {
  const requirements = facility.requirements || [];

  // Group requirements by their group
  const groupedRequirements = requirements.reduce((acc, requirement) => {
    const group = requirement.group || 'general';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(requirement);
    return acc;
  }, {} as Record<string, FacilityRequirement[]>);

  // Create a map of requirement values by requirement key and data key
  const requirementValuesMap = requirementValues.reduce((acc, value) => {
    const reqKey = value.requirement?.key || 'unknown';
    const dataKey = value.requirement_data?.key || 'unknown';
    if (!acc[reqKey]) {
      acc[reqKey] = {};
    }
    acc[reqKey][dataKey] = value;
    return acc;
  }, {} as Record<string, Record<string, RequirementValue>>);

  const formatValue = (value: any, dataType: string) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground italic">Not set</span>;
    }

    switch (dataType) {
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
      'facility': '🏢',
      'board': '🎓',
      'credentialing': '🔐',
      'compliance': '✅',
      'licensing': '📜',
      'certification': '🏆',
      'education': '📚',
      'experience': '💼',
      'background': '🔍',
      'health': '🏥'
    };
    return iconMap[group] || '📋';
  };

  const getGroupTitle = (group: string) => {
    return group.charAt(0).toUpperCase() + group.slice(1).replace(/_/g, ' ');
  };

  const getRequirementStatus = (requirement: FacilityRequirement) => {
    const values = requirementValuesMap[requirement.key];
    if (!values || Object.keys(values).length === 0) {
      return { status: 'pending', label: 'Pending', variant: 'secondary' as const };
    }
    
    // Check if all values are filled
    const allFilled = Object.values(values).every(v => 
      v.value !== null && v.value !== undefined && v.value !== ''
    );
    
    if (allFilled) {
      return { status: 'completed', label: 'Completed', variant: 'default' as const };
    } else {
      return { status: 'partial', label: 'Partial', variant: 'outline' as const };
    }
  };

  return (
    <div className="space-y-6" data-testid="facility-requirements">
      {/* Header */}
      <Card data-testid="facility-requirements-header">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {facility.icon && (
              <FontAwesomeIcon icon={getIconByName(facility.icon)} className="w-5 h-5" />
            )}
            {facility.label} - Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" data-testid="requirements-count">
              {requirements.length} Requirements
            </Badge>
            <span className="text-sm text-muted-foreground">
              Organized into {Object.keys(groupedRequirements).length} groups
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Requirements by Group */}
      {Object.keys(groupedRequirements).length > 0 ? (
        Object.entries(groupedRequirements).map(([group, groupRequirements]) => (
          <Card key={group} data-testid={`requirements-group-${group}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span role="img" aria-label={`${group} icon`}>
                  {getGroupIcon(group)}
                </span>
                {getGroupTitle(group)}
                <Badge variant="outline" className="ml-auto">
                  {groupRequirements.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupRequirements.map((requirement) => {
                  const status = getRequirementStatus(requirement);
                  const values = requirementValuesMap[requirement.key] || {};
                  
                  return (
                    <div 
                      key={requirement.id} 
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      data-testid={`requirement-${requirement.key}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-gray-900">
                            {requirement.label}
                          </Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {requirement.type}
                            </Badge>
                            {requirement.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                            <Badge variant={status.variant} className="text-xs">
                              {status.label}
                            </Badge>
                            {!requirement.visible && (
                              <Badge variant="secondary" className="text-xs">
                                Hidden
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {requirement.note && (
                        <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                          <Label className="text-xs font-medium text-blue-600">Note</Label>
                          <p className="mt-1">{requirement.note}</p>
                        </div>
                      )}

                      {/* Requirement Values */}
                      {Object.keys(values).length > 0 ? (
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Values</Label>
                          {Object.entries(values).map(([dataKey, value]) => (
                            <div 
                              key={dataKey} 
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              data-testid={`requirement-value-${dataKey}`}
                            >
                              <div className="flex-1">
                                <span className="text-xs font-medium text-gray-600">
                                  {value.requirement_data?.label || dataKey}:
                                </span>
                              </div>
                              <div className="ml-2">
                                {formatValue(value.value, value.requirement_data?.data_type || 'text')}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No values set for this requirement.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card data-testid="no-requirements">
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-4xl mb-2" role="img" aria-label="No requirements icon">
                📭
              </div>
              <p className="text-muted-foreground">No requirements found for this facility.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card data-testid="facility-requirements-actions">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              data-testid="add-requirement-btn"
            >
              <span role="img" aria-label="Add icon">➕</span>
              Add Requirement
            </button>
            <button 
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              data-testid="edit-requirements-btn"
            >
              <span role="img" aria-label="Edit icon">✏️</span>
              Edit Requirements
            </button>
            <button 
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              data-testid="export-requirements-btn"
            >
              <span role="img" aria-label="Export icon">📤</span>
              Export Requirements
            </button>
            <button 
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              data-testid="compliance-report-btn"
            >
              <span role="img" aria-label="Report icon">📊</span>
              Compliance Report
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 