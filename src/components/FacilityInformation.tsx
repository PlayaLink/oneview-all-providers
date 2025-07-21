import React, { useMemo, useState, useEffect, useRef } from "react";
import CollapsibleSection from "./CollapsibleSection";
import TextInputField from "./inputs/TextInputField";
import { SingleSelect, SingleSelectOption } from "./inputs/SingleSelect";
import { MultiSelectInput, MultiSelectItem } from "./inputs/MultiSelectInput";
import { useFacilityPropertyValueMutation } from "@/hooks/useFacilityPropertyValueMutation";
import { useDebouncedCallback } from "use-debounce";

interface FacilityProperty {
  id?: string;
  key?: string;
  label?: string;
  type?: string;
  group?: string;
  value?: any;
  is_required?: boolean;
  validation_rules?: any;
  options?: SingleSelectOption[]; // Added for single-select and multi-select
}

interface FacilityInformationProps {
  facility: {
    id: string;
    label: string;
    icon?: string;
    properties?: FacilityProperty[];
    requirements?: any[];
    providers?: any[];
    created_at: string;
    updated_at: string;
  };
  requirementValues?: any[];
}

export const FacilityInformation: React.FC<FacilityInformationProps> = ({
  facility,
  requirementValues = [],
}) => {
  // Local state for all property values
  const [propertyValues, setPropertyValues] = useState<Record<string, any>>({});
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const { mutate: updatePropertyValue } = useFacilityPropertyValueMutation();
  const lastSentValues = useRef<Record<string, any>>({});

  // Sync local state from props when facility or its properties change, but only if backend value changed
  useEffect(() => {
    const initialValues: Record<string, any> = {};
    (facility.properties || []).forEach((property) => {
      const key = property.key!;
      const backendValue = property.value ?? "";
      // Only update if backend value changed
      if (lastSentValues.current[key] !== backendValue) {
        initialValues[key] = backendValue;
        lastSentValues.current[key] = backendValue;
      } else {
        initialValues[key] = propertyValues[key] ?? backendValue;
      }
    });
    setPropertyValues(initialValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facility.id, facility.properties]);

  // Group properties by their group field
  const groupedProperties = useMemo(() => {
    if (!facility.properties) return {};
    return facility.properties.reduce(
      (acc, property) => {
        const group = property.group || "General";
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(property);
        return acc;
      },
      {} as Record<string, FacilityProperty[]>,
    );
  }, [facility.properties]);

  // Debounced mutation for property value updates
  const debouncedUpdate = useDebouncedCallback((propertyKey: string, value: any) => {
    updatePropertyValue({ facilityId: facility.id, propertyKey, value });
    lastSentValues.current[propertyKey] = value;
  }, 400);

  const handlePropertyChange = (propertyKey: string, value: any) => {
    setPropertyValues((prev) => ({ ...prev, [propertyKey]: value }));
    setUpdatingKey(propertyKey);
    debouncedUpdate(propertyKey, value);
  };

  const renderProperty = (property: FacilityProperty) => {
    const value = propertyValues[property.key!] ?? "";
    const label = property.label || property.key || "";
    const type = property.type?.toLowerCase() || "text";

    if (type === "single-select" || type === "multi-select") {
      console.log("property **********", property);
      const options = property.options || [];
      if (options.length === 0) {
        return (
          <div key={property.id || property.key} className="px-2 flex-1">
            <div className="text-red-500 text-xs">No options configured for this field.</div>
          </div>
        );
      }
      if (type === "single-select") {
        return (
          <div key={property.id || property.key} className="px-2 flex-1">
            <SingleSelect
              label={label}
              labelPosition="top"
              value={value ? { id: value, label: value } : undefined}
              options={options}
              onChange={(option) => handlePropertyChange(property.key!, option?.id)}
              placeholder=""
              className="w-full"
              data-testid={`facility-property-${property.key}`}
            />
          </div>
        );
      }
      // multi-select
      return (
        <div key={property.id || property.key} className="px-2 flex-1">
          <MultiSelectInput
            label={label}
            labelPosition="top"
            value={Array.isArray(value) ? value : []}
            options={options}
            onChange={(newValue) => handlePropertyChange(property.key!, newValue)}
            placeholder=""
            className="w-full"
            data-testid={`facility-property-${property.key}`}
          />
        </div>
      );
    }

    // Default to text input
    return (
      <div key={property.id || property.key} className="px-2 flex-1">
        <TextInputField
          label={label}
          labelPosition="top"
          value={value?.toString() || ""}
          onChange={(newValue) => handlePropertyChange(property.key!, newValue)}
          placeholder=""
          className="w-full border-gray-300"
          data-testid={`facility-property-${property.key}`}
        />
      </div>
    );
  };

  const renderRow = (properties: FacilityProperty[], rowIndex: number) => {
    return (
      <div
        key={rowIndex}
        className="flex gap-2 w-full"
        data-testid={`facility-property-row-${rowIndex}`}
      >
        {properties.map(renderProperty)}
      </div>
    );
  };

  const renderGroup = (groupName: string, properties: FacilityProperty[]) => {
    // Organize properties into rows based on layout patterns from the design
    const rows: FacilityProperty[][] = [];
    let currentRow: FacilityProperty[] = [];

    properties.forEach((property, index) => {
      currentRow.push(property);
      // Create new row based on field types and layout requirements
      // For now, we'll use a simple 2-3 items per row approach
      if (
        currentRow.length >= 2 &&
        (property.label?.toLowerCase().includes("address") ||
          property.label?.toLowerCase().includes("phone") ||
          property.label?.toLowerCase().includes("zip") ||
          index === properties.length - 1)
      ) {
        rows.push([...currentRow]);
        currentRow = [];
      } else if (currentRow.length >= 4) {
        rows.push([...currentRow]);
        currentRow = [];
      }
    });
    // Add any remaining properties
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
    const collapsibleProps = {
      key: groupName,
      title: groupName,
      defaultExpanded: true,
      'data-testid': `facility-section-${groupName.toLowerCase().replace(/\s+/g, "-")}`
    };
    console.log(`CollapsibleSection for group: ${groupName}`, properties);
    return (
      <CollapsibleSection {...collapsibleProps}>
        <div className="flex flex-col gap-4 w-full px-2">
          {rows.map((rowProperties, rowIndex) =>
            renderRow(rowProperties, rowIndex),
          )}
        </div>
      </CollapsibleSection>
    );
  };

  return (
    <div
      className="flex flex-col gap-4 w-full"
      data-testid="facility-information"
    >
      {Object.entries(groupedProperties).map(([groupName, properties]) =>
        renderGroup(groupName, properties),
      )}
      {/* If no properties exist, show basic facility info */}
      {Object.keys(groupedProperties).length === 0 && (
        <CollapsibleSection
          title="General"
          defaultExpanded={true}
          data-testid="facility-section-general"
        >
          <div className="flex flex-col gap-4 w-full px-2">
            <div className="flex gap-2 w-full">
              <div className="px-2 flex-1">
                <TextInputField
                  label="Facility Name"
                  labelPosition="top"
                  value={facility.label || ""}
                  onChange={() => {}}
                  disabled={true}
                  className="w-full border-gray-300"
                  data-testid="facility-name"
                />
              </div>
              <div className="px-2 flex-1">
                <TextInputField
                  label="Facility ID"
                  labelPosition="top"
                  value={facility.id || ""}
                  onChange={() => {}}
                  disabled={true}
                  className="w-full border-gray-300"
                  data-testid="facility-id"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}; 
