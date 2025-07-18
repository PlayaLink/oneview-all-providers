import React, { useState, useEffect } from 'react';
import { 
  getFacilityPropertiesGrouped, 
  updateFacilityPropertyValueByKey,
  convertPropertyValue 
} from '../lib/supabaseClient';

interface FacilityPropertiesProps {
  facilityId: string;
  onUpdate?: () => void;
}

interface PropertyValue {
  id: string;
  key: string;
  label: string;
  type: string;
  value: any;
  raw_value: any;
}

export const FacilityProperties: React.FC<FacilityPropertiesProps> = ({ 
  facilityId, 
  onUpdate 
}) => {
  const [properties, setProperties] = useState<Record<string, PropertyValue[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProperties();
  }, [facilityId]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const groupedProperties = await getFacilityPropertiesGrouped(facilityId);
      setProperties(groupedProperties);
    } catch (error) {
      console.error('Error loading facility properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property: PropertyValue) => {
    setEditingKey(property.key);
    setEditValue(property.value);
  };

  const handleSave = async (property: PropertyValue) => {
    try {
      setSaving(true);
      await updateFacilityPropertyValueByKey(facilityId, property.key, editValue);
      setEditingKey(null);
      setEditValue('');
      await loadProperties();
      onUpdate?.();
    } catch (error) {
      console.error('Error updating property:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const renderPropertyValue = (property: PropertyValue) => {
    if (editingKey === property.key) {
      return (
        <div className="flex gap-2 items-center" data-testid={`edit-${property.key}`}>
          {renderEditInput(property)}
          <button
            onClick={() => handleSave(property)}
            disabled={saving}
            className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
            data-testid={`save-${property.key}`}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            data-testid={`cancel-${property.key}`}
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <div className="flex gap-2 items-center" data-testid={`display-${property.key}`}>
        <span className="text-gray-700">
          {renderValueDisplay(property.value, property.type)}
        </span>
        <button
          onClick={() => handleEdit(property)}
          className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          data-testid={`edit-btn-${property.key}`}
        >
          Edit
        </button>
      </div>
    );
  };

  const renderEditInput = (property: PropertyValue) => {
    switch (property.type) {
      case 'boolean':
        return (
          <select
            value={editValue ? 'true' : 'false'}
            onChange={(e) => setEditValue(e.target.value === 'true')}
            className="border rounded px-2 py-1"
            data-testid={`input-${property.key}`}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
            className="border rounded px-2 py-1 w-32"
            data-testid={`input-${property.key}`}
          />
        );
      
      case 'multi-select':
        const options = Array.isArray(editValue) ? editValue : [];
        return (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={options.join(', ')}
              onChange={(e) => setEditValue(e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0))}
              placeholder="Enter options separated by commas"
              className="border rounded px-2 py-1"
              data-testid={`input-${property.key}`}
            />
            <span className="text-xs text-gray-500">Separate multiple values with commas</span>
          </div>
        );
      
      case 'email':
        return (
          <input
            type="email"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="border rounded px-2 py-1 w-64"
            data-testid={`input-${property.key}`}
          />
        );
      
      case 'url':
        return (
          <input
            type="url"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="border rounded px-2 py-1 w-64"
            data-testid={`input-${property.key}`}
          />
        );
      
      case 'phone':
        return (
          <input
            type="tel"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="border rounded px-2 py-1 w-48"
            data-testid={`input-${property.key}`}
          />
        );
      
      default:
        return (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="border rounded px-2 py-1 w-64"
            data-testid={`input-${property.key}`}
          />
        );
    }
  };

  const renderValueDisplay = (value: any, type: string) => {
    switch (type) {
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'number':
        return value?.toString() || '0';
      case 'multi-select':
        return Array.isArray(value) ? value.join(', ') : value?.toString() || '';
      case 'email':
        return value ? <a href={`mailto:${value}`} className="text-blue-600 hover:underline">{value}</a> : '';
      case 'url':
        return value ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{value}</a> : '';
      default:
        return value?.toString() || '';
    }
  };

  if (loading) {
    return (
      <div className="p-4" data-testid="facility-properties-loading">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4" data-testid="facility-properties">
      <h2 className="text-xl font-semibold mb-4" data-testid="facility-properties-title">
        Facility Properties
      </h2>
      
      {Object.entries(properties).map(([group, groupProperties]) => (
        <div key={group} className="mb-6" data-testid={`property-group-${group}`}>
          <h3 className="text-lg font-medium text-gray-800 mb-3 capitalize" data-testid={`group-title-${group}`}>
            {group.replace('_', ' ')}
          </h3>
          
          <div className="space-y-3">
            {groupProperties.map((property) => (
              <div 
                key={property.id} 
                className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                data-testid={`property-item-${property.key}`}
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-testid={`property-label-${property.key}`}>
                    {property.label}
                  </label>
                  {renderPropertyValue(property)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {Object.keys(properties).length === 0 && (
        <div className="text-center text-gray-500 py-8" data-testid="no-properties">
          No properties found for this facility.
        </div>
      )}
    </div>
  );
}; 