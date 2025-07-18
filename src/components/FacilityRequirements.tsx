import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { CollapsibleSection } from './CollapsibleSection';
import { 
  getFacilityRequirementsGrouped, 
  updateFacilityRequirementValueByKeys,
  convertRequirementValue 
} from '../lib/supabaseClient';
import { toast } from 'sonner';

interface FacilityRequirementsProps {
  facilityId: string;
  facilityName: string;
}

interface RequirementData {
  id: string;
  key: string;
  label: string;
  data_type: string;
  value: any;
  raw_value: any;
}

interface GroupedRequirements {
  [requirementKey: string]: {
    requirement: any;
    data: RequirementData[];
  };
}

export function FacilityRequirements({ facilityId, facilityName }: FacilityRequirementsProps) {
  const [requirements, setRequirements] = useState<GroupedRequirements>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRequirements();
  }, [facilityId]);

  const loadRequirements = async () => {
    try {
      setLoading(true);
      const data = await getFacilityRequirementsGrouped(facilityId);
      setRequirements(data);
    } catch (error) {
      console.error('Error loading facility requirements:', error);
      toast.error('Failed to load facility requirements');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = async (
    requirementKey: string,
    dataKey: string,
    value: any,
    dataType: string
  ) => {
    try {
      setSaving(true);
      
      // Convert value based on data type
      const convertedValue = convertRequirementValue(value, dataType);
      
      // Update the value
      await updateFacilityRequirementValueByKeys(facilityId, requirementKey, dataKey, convertedValue);
      
      // Update local state
      setRequirements(prev => ({
        ...prev,
        [requirementKey]: {
          ...prev[requirementKey],
          data: prev[requirementKey].data.map(item => 
            item.key === dataKey 
              ? { ...item, value: convertedValue, raw_value: convertedValue }
              : item
          )
        }
      }));
      
      toast.success('Requirement value updated');
    } catch (error) {
      console.error('Error updating requirement value:', error);
      toast.error('Failed to update requirement value');
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (data: RequirementData, requirementKey: string) => {
    const { key, label, data_type, value } = data;

    switch (data_type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2" data-testid={`requirement-${key}`} data-referenceid={`requirement-${key}`}>
            <Switch
              id={`requirement-${key}`}
              checked={value === true}
              onCheckedChange={(checked) => handleValueChange(requirementKey, key, checked, data_type)}
              disabled={saving}
              role="switch"
              aria-label={`Toggle ${label}`}
            />
            <Label htmlFor={`requirement-${key}`} className="text-sm font-medium">
              {label}
            </Label>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2" data-testid={`requirement-${key}`} data-referenceid={`requirement-${key}`}>
            <Label htmlFor={`requirement-${key}`} className="text-sm font-medium">
              {label}
            </Label>
            <Input
              id={`requirement-${key}`}
              type="number"
              value={value || ''}
              onChange={(e) => handleValueChange(requirementKey, key, e.target.value, data_type)}
              disabled={saving}
              placeholder={`Enter ${label.toLowerCase()}`}
              aria-label={label}
            />
          </div>
        );

      case 'email':
        return (
          <div className="space-y-2" data-testid={`requirement-${key}`} data-referenceid={`requirement-${key}`}>
            <Label htmlFor={`requirement-${key}`} className="text-sm font-medium">
              {label}
            </Label>
            <Input
              id={`requirement-${key}`}
              type="email"
              value={value || ''}
              onChange={(e) => handleValueChange(requirementKey, key, e.target.value, data_type)}
              disabled={saving}
              placeholder={`Enter ${label.toLowerCase()}`}
              aria-label={label}
            />
          </div>
        );

      case 'url':
        return (
          <div className="space-y-2" data-testid={`requirement-${key}`} data-referenceid={`requirement-${key}`}>
            <Label htmlFor={`requirement-${key}`} className="text-sm font-medium">
              {label}
            </Label>
            <Input
              id={`requirement-${key}`}
              type="url"
              value={value || ''}
              onChange={(e) => handleValueChange(requirementKey, key, e.target.value, data_type)}
              disabled={saving}
              placeholder={`Enter ${label.toLowerCase()}`}
              aria-label={label}
            />
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-2" data-testid={`requirement-${key}`} data-referenceid={`requirement-${key}`}>
            <Label htmlFor={`requirement-${key}`} className="text-sm font-medium">
              {label}
            </Label>
            <Input
              id={`requirement-${key}`}
              type="tel"
              value={value || ''}
              onChange={(e) => handleValueChange(requirementKey, key, e.target.value, data_type)}
              disabled={saving}
              placeholder={`Enter ${label.toLowerCase()}`}
              aria-label={label}
            />
          </div>
        );

      case 'single-select':
        return (
          <div className="space-y-2" data-testid={`requirement-${key}`} data-referenceid={`requirement-${key}`}>
            <Label htmlFor={`requirement-${key}`} className="text-sm font-medium">
              {label}
            </Label>
            <Select
              value={value || ''}
              onValueChange={(newValue) => handleValueChange(requirementKey, key, newValue, data_type)}
              disabled={saving}
            >
              <SelectTrigger aria-label={label}>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="not_applicable">Not Applicable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 'multi-select':
        return (
          <div className="space-y-2" data-testid={`requirement-${key}`} data-referenceid={`requirement-${key}`}>
            <Label htmlFor={`requirement-${key}`} className="text-sm font-medium">
              {label}
            </Label>
            <Textarea
              id={`requirement-${key}`}
              value={Array.isArray(value) ? value.join(', ') : value || ''}
              onChange={(e) => {
                const values = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                handleValueChange(requirementKey, key, values, data_type);
              }}
              disabled={saving}
              placeholder={`Enter ${label.toLowerCase()} (comma-separated)`}
              aria-label={label}
            />
          </div>
        );

      case 'oneview_record':
        return (
          <div className="space-y-2" data-testid={`requirement-${key}`} data-referenceid={`requirement-${key}`}>
            <Label htmlFor={`requirement-${key}`} className="text-sm font-medium">
              {label}
            </Label>
            <Input
              id={`requirement-${key}`}
              value={value || ''}
              onChange={(e) => handleValueChange(requirementKey, key, e.target.value, data_type)}
              disabled={saving}
              placeholder={`Enter ${label.toLowerCase()}`}
              aria-label={label}
            />
          </div>
        );

      default: // text
        return (
          <div className="space-y-2" data-testid={`requirement-${key}`} data-referenceid={`requirement-${key}`}>
            <Label htmlFor={`requirement-${key}`} className="text-sm font-medium">
              {label}
            </Label>
            <Input
              id={`requirement-${key}`}
              value={value || ''}
              onChange={(e) => handleValueChange(requirementKey, key, e.target.value, data_type)}
              disabled={saving}
              placeholder={`Enter ${label.toLowerCase()}`}
              aria-label={label}
            />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <Card data-testid="facility-requirements" data-referenceid="facility-requirements">
        <CardHeader>
          <CardTitle>Facility Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading requirements...</div>
        </CardContent>
      </Card>
    );
  }

  const requirementGroups = Object.entries(requirements);

  return (
    <Card data-testid="facility-requirements" data-referenceid="facility-requirements">
      <CardHeader>
        <CardTitle>Facility Requirements - {facilityName}</CardTitle>
      </CardHeader>
      <CardContent>
        {requirementGroups.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No requirements configured for this facility.
          </div>
        ) : (
          <div className="space-y-6">
            {requirementGroups.map(([requirementKey, { requirement, data }]) => (
              <CollapsibleSection
                key={requirementKey}
                title={requirement.label}
                defaultOpen={true}
                data-testid={`requirement-section-${requirementKey}`}
                data-referenceid={`requirement-section-${requirementKey}`}
              >
                <div className="space-y-4 p-4">
                  {requirement.note && (
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {requirement.note}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.map((dataItem) => (
                      <div key={dataItem.id} className="space-y-2">
                        {renderInput(dataItem, requirementKey)}
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleSection>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 