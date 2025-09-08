import React from 'react';
import TextInputField from '../inputs/TextInputField';
import { renderFieldComponent } from './getInputType';

interface SearchCriteriaSectionProps {
  title: string;
  fields: any[];
  formValues: any;
  handleChange: (field: string, value: any) => void;
  provider?: any;
  className?: string;
  layout?: 'vertical' | 'horizontal';
  labelPosition?: 'left' | 'above';
}

const SearchCriteriaSection: React.FC<SearchCriteriaSectionProps> = ({
  title,
  fields,
  formValues,
  handleChange,
  provider,
  className = "p-6 rounded-2xl border border-gray-200 bg-gray-50",
  layout = 'vertical',
  labelPosition = 'left'
}) => {
  const containerClass = layout === 'horizontal' ? "flex flex-row gap-4 w-full" : "flex flex-col gap-4";
  const fieldClass = layout === 'horizontal' ? "flex-1" : "flex-1";
  const providerContainerClass = layout === 'horizontal' ? "flex flex-row gap-4 w-full mt-4" : "flex flex-col gap-4";

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-4">
        <h2 
          className="text-xs font-semibold text-[#008BC9] uppercase tracking-wide"
          data-testid={`${title.toLowerCase().replace(/\s+/g, '-')}-section-header`}
          role="heading"
          aria-level={2}
        >
          {title}
        </h2>
      </div>

      {/* Form Grid */}
      <div className={containerClass}>
        {fields.map((field) => (
          <div key={field.key || field.label} className={fieldClass}>
            {renderFieldComponent({ field, formValues, handleChange, labelPosition })}
          </div>
        ))}
        
        {/* Provider fields */}
        {provider && (
          <div className={providerContainerClass}>
            <div className="flex-1">
              <TextInputField
                label="First Name"
                labelPosition={labelPosition}
                value={provider.first_name || ''}
                onChange={() => {}} // Read-only field
                disabled={true}
                data-testid="provider-first-name"
                aria-label="Provider first name"
              />
            </div>
            <div className="flex-1">
              <TextInputField
                label="Last Name"
                labelPosition={labelPosition}
                value={provider.last_name || ''}
                onChange={() => {}} // Read-only field
                disabled={true}
                data-testid="provider-last-name"
                aria-label="Provider last name"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCriteriaSection;
