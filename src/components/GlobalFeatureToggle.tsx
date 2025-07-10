import React from 'react';
import { useFeatureSettings } from '@/hooks/useFeatureSettings';
import { FeatureSettingKey } from '@/types/featureSettings';

interface GlobalFeatureToggleProps {
  settingKey: FeatureSettingKey;
  label: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
  disabled?: boolean;
}

const GlobalFeatureToggle: React.FC<GlobalFeatureToggleProps> = ({
  settingKey,
  label,
  options,
  className = '',
  disabled = false,
}) => {
  const { settings, updateSetting, isLoading } = useFeatureSettings();
  
  const currentValue = settings[settingKey];
  
  const handleChange = (value: string) => {
    updateSetting(settingKey, value);
  };

  if (isLoading) {
    return (
      <div className={`space-y-2 ${className}`} role="feature-settings">
        <label className="text-xs font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <select
            disabled
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`${label} setting`}
            data-testid={`${settingKey}-select`}
          >
            <option>Loading...</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`} role="feature-settings">
      <label className="text-xs font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`${label} setting`}
          data-testid={`${settingKey}-select`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default GlobalFeatureToggle; 