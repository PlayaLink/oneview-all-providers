import React, { useMemo } from "react";
import CollapsibleSection from "./CollapsibleSection";
import TextInputField from "./inputs/TextInputField";
import { SingleSelect, SingleSelectOption } from "./inputs/SingleSelect";
import { MultiSelectInput, MultiSelectItem } from "./inputs/MultiSelectInput";

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
  // Console log the facility object received by this component
  console.log('FacilityInformation component received:', {
    facility,
    requirementValues,
    facilityId: facility?.id,
    facilityLabel: facility?.label,
    facilityIcon: facility?.icon,
    propertiesCount: facility?.properties?.length || 0,
    requirementsCount: facility?.requirements?.length || 0,
    providersCount: facility?.providers?.length || 0,
    facilityKeys: facility ? Object.keys(facility) : [],
    properties: facility?.properties,
    requirements: facility?.requirements,
    providers: facility?.providers
  });
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

  // Mock options for dropdown fields (in real implementation, these would come from your data source)
  const createOptions = (values: string[]): SingleSelectOption[] => {
    return values.map((value, index) => ({
      id: index,
      label: value,
    }));
  };

  const yesNoOptions = createOptions(["Yes", "No"]);
  const stateOptions = createOptions([
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ]);

  const renderProperty = (property: FacilityProperty) => {
    const value = property.value || "";
    const label = property.label || property.key || "";

    // Determine input type based on property type or field name
    const fieldType = property.type?.toLowerCase() || "";
    const fieldName = label.toLowerCase();

    if (
      fieldName.includes("transportation") ||
      fieldName.includes("handicap") ||
      fieldName.includes("access") ||
      fieldName.includes("directory")
    ) {
      return (
        <div key={property.id || property.key} className="px-2 flex-1">
          <SingleSelect
            label={label}
            labelPosition="top"
            value={value ? { id: value, label: value } : undefined}
            options={yesNoOptions}
            onChange={(option) => {
              // In real implementation, this would update the property value
              console.log("Property changed:", property.key, option?.label);
            }}
            placeholder=""
            className="w-full"
            data-testid={`facility-property-${property.key}`}
          />
        </div>
      );
    }

    if (fieldName.includes("state") || fieldName === "billing state") {
      return (
        <div key={property.id || property.key} className="px-2 flex-1">
          <SingleSelect
            label={label}
            labelPosition="top"
            value={value ? { id: value, label: value } : undefined}
            options={stateOptions}
            onChange={(option) => {
              console.log("Property changed:", property.key, option?.label);
            }}
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
          onChange={(newValue) => {
            console.log("Property changed:", property.key, newValue);
          }}
          placeholder=""
          // disabled={true} 
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

    return (
      <CollapsibleSection
        key={groupName}
        title={groupName}
        defaultExpanded={true}
        data-testid={`facility-section-${groupName.toLowerCase().replace(/\s+/g, "-")}`}
      >
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
