import React from 'react';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../inputs/SingleSelect';
import TextInputField from '../inputs/TextInputField';

export function getInputType(field: { options?: any[]; type?: string }) {
  // Check if the field has a specific type defined
  if (field.type) {
    return field.type;
  }
  
  // Fallback: check if field has options to determine type
  if (Array.isArray(field.options) && field.options.length > 0) {
    return 'single-select'; // Default to single-select if options exist but no type specified
  }
  
  return 'text';
}

interface FieldComponentProps {
  field: {
    label: string;
    key?: string;
    options?: any[];
    placeholder?: string;
    type?: string;
  };
  formValues: Record<string, any>;
  handleChange: (key: string, value: any) => void;
  className?: string;
  labelPosition?: 'left' | 'above';
}

export function renderFieldComponent({ field, formValues, handleChange, className = "flex-1 min-w-0", labelPosition = 'left' }: FieldComponentProps): React.ReactElement {
  const inputType = getInputType(field);
  const fieldKey = field.key || field.label;

  if (inputType === 'multi-select') {
    // Handle both string arrays and object arrays
    const options = field.options?.map((opt) => {
      if (typeof opt === 'string') {
        return { id: opt, label: opt };
      } else if (typeof opt === 'object' && opt !== null && 'id' in opt && 'label' in opt) {
        return opt; // Already in correct format
      } else {
        return { id: String(opt), label: String(opt) };
      }
    }) || [];
    
    const stored = formValues[fieldKey] || [];
    const value = Array.isArray(stored)
      ? stored.map((v) => (typeof v === 'object' && v !== null ? v : options.find((opt) => opt.id === v))).filter(Boolean)
      : [];


    return (
      <MultiSelectInput
        label={field.label}
        labelPosition={labelPosition}
        value={value}
        options={options}
        onChange={(val) => handleChange(fieldKey, val)}
        placeholder={field.placeholder}
        className={className}
      />
    );
  } else if (inputType === 'single-select') {
    // Handle both string arrays and object arrays
    const options = field.options?.map((opt) => {
      if (typeof opt === 'string') {
        return { id: opt, label: opt };
      } else if (typeof opt === 'object' && opt !== null && 'id' in opt && 'label' in opt) {
        return opt; // Already in correct format
      } else {
        return { id: String(opt), label: String(opt) };
      }
    }) || [];
    
    // Handle both string values and object values from formValues
    const formValue = formValues[fieldKey];
    const selectedValue = typeof formValue === 'string' 
      ? options.find((opt) => opt.id === formValue) || null
      : formValue || null;
    

    return (
      <SingleSelect
        label={field.label}
        labelPosition={labelPosition}
        value={selectedValue}
        options={options}
        onChange={(val) => {
      
          // Store the id value, not the full object
          handleChange(fieldKey, val?.id || null);
        }}
        placeholder={field.placeholder}
        className={className}
      />
    );
  } else {
    return (
      <TextInputField
        label={field.label}
        labelPosition={labelPosition}
        value={formValues[fieldKey] || ''}
        onChange={(val) => handleChange(fieldKey, val)}
        placeholder={field.placeholder}
        className={className}
      />
    );
  }
} 