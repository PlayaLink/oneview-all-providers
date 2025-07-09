import React from 'react';
import { MultiSelectInput } from '../inputs/MultiSelectInput';
import { SingleSelect } from '../SingleSelect';
import TextInputField from '../inputs/TextInputField';

export function getInputType(field: { options?: any[]; type?: string }) {
  if (Array.isArray(field.options) && field.options.length > 0) {
    return field.type === 'multi-select' ? 'multi-select' : 'single-select';
  }
  return 'text';
}

interface FieldComponentProps {
  field: {
    label: string;
    rowKey?: string;
    options?: any[];
    placeholder?: string;
    type?: string;
  };
  formValues: Record<string, any>;
  handleChange: (key: string, value: any) => void;
  className?: string;
}

export function renderFieldComponent({ field, formValues, handleChange, className = "flex-1 min-w-0" }: FieldComponentProps): React.ReactElement {
  const inputType = getInputType(field);
  const fieldKey = field.rowKey || field.label;

  if (inputType === 'multi-select') {
    return (
      <MultiSelectInput
        label={field.label}
        labelPosition="left"
        value={formValues[fieldKey] || []}
        options={field.options?.map((opt) => ({ id: opt, label: opt })) || []}
        onChange={(val) => handleChange(fieldKey, Array.isArray(val) ? val.map((v) => v.id) : [])}
        placeholder={field.placeholder}
        className={className}
      />
    );
  } else if (inputType === 'single-select') {
    const options = field.options?.map((opt) => ({ id: opt, label: opt })) || [];
    const selectedValue = options.find((opt) => opt.id === formValues[fieldKey]) || null;
    return (
      <SingleSelect
        label={field.label}
        labelPosition="left"
        value={selectedValue}
        options={options}
        onChange={(val) => handleChange(fieldKey, val?.id ?? val)}
        placeholder={field.placeholder}
        className={className}
      />
    );
  } else {
    return (
      <TextInputField
        label={field.label}
        labelPosition="left"
        value={formValues[fieldKey] || ''}
        onChange={(val) => handleChange(fieldKey, val)}
        placeholder={field.placeholder}
        className={className}
      />
    );
  }
} 