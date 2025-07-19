import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIconByName } from '@/lib/iconMapping';

interface FacilityInformationProps {
  facility: {
    id: string;
    label: string;
    icon?: string;
    requirements: string[];
    providers: string[];
    created_at: string;
    updated_at: string;
  };
  requirementValues?: any[];
}

export const FacilityInformation: React.FC<FacilityInformationProps> = ({ facility, requirementValues = [] }) => {
  return (
    <div className="space-y-6" data-testid="facility-information">
      {/* Basic Information */}
      <Card data-testid="facility-basic-info">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {facility.icon && (
              <FontAwesomeIcon icon={getIconByName(facility.icon)} className="w-5 h-5" />
            )}
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Facility Name</Label>
              <p className="text-sm text-gray-900">{facility.label}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Facility ID</Label>
              <p className="text-sm text-gray-900 font-mono">{facility.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Created</Label>
              <p className="text-sm text-gray-900">
                {new Date(facility.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
              <p className="text-sm text-gray-900">
                {new Date(facility.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card data-testid="facility-requirements">
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          {requirementValues.length > 0 ? (
            <div className="space-y-4">
              {requirementValues.map((reqValue, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {reqValue.requirement_name || `Requirement ${index + 1}`}
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Type: </span>
                      <span className="text-sm text-gray-900">{reqValue.requirement_type || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Value: </span>
                      <span className="text-sm text-gray-900">{reqValue.value || 'N/A'}</span>
                    </div>
                    {reqValue.required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No requirements found for this facility.</p>
          )}
        </CardContent>
      </Card>

      {/* Requirements Summary */}
      <Card data-testid="facility-requirements-summary">
        <CardHeader>
          <CardTitle>Requirements Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" data-testid="requirements-count">
              {facility.requirements.length} Requirements
            </Badge>
            <span className="text-sm text-muted-foreground">
              This facility has {facility.requirements.length} eligibility requirements configured
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Providers Summary */}
      <Card data-testid="facility-providers-summary">
        <CardHeader>
          <CardTitle>Providers Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="outline" data-testid="providers-count">
              {facility.providers.length} Providers
            </Badge>
            <span className="text-sm text-muted-foreground">
              {facility.providers.length === 0 
                ? 'No providers currently affiliated with this facility'
                : `${facility.providers.length} provider${facility.providers.length === 1 ? '' : 's'} affiliated with this facility`
              }
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card data-testid="facility-quick-actions">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              data-testid="view-requirements-btn"
            >
              <span role="img" aria-label="Requirements icon">📋</span>
              View Requirements
            </button>
            <button 
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              data-testid="view-contacts-btn"
            >
              <span role="img" aria-label="Contacts icon">👥</span>
              View Contacts
            </button>
            <button 
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              data-testid="edit-facility-btn"
            >
              <span role="img" aria-label="Edit icon">✏️</span>
              Edit Facility
            </button>
            <button 
              className="flex items-center justify-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
              data-testid="manage-providers-btn"
            >
              <span role="img" aria-label="Providers icon">👨‍⚕️</span>
              Manage Providers
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 