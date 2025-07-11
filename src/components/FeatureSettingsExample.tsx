import React from 'react';
import GlobalFeatureToggle from '@/components/GlobalFeatureToggle';
import { useFeatureSettings } from '@/hooks/useFeatureSettings';

/**
 * Example component demonstrating how to use GlobalFeatureToggle
 * for different types of feature settings throughout the app.
 * 
 * This component shows:
 * 1. How to use GlobalFeatureToggle for boolean toggles
 * 2. How to access feature settings directly in components
 * 3. How to create custom toggle components for specific use cases
 */
const FeatureSettingsExample: React.FC = () => {
  const { settings } = useFeatureSettings();

  return (
    <div className="p-6 space-y-6" role="main" aria-label="Feature settings example">
      <h2 className="text-xl font-semibold text-gray-900">Feature Settings Examples</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example 1: Boolean toggle for left_nav */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Left Nav Toggle</h3>
          <GlobalFeatureToggle
            settingKey="left_nav"
            label="Left Navigation"
            options={[
              { value: "true", label: "Enabled" },
              { value: "false", label: "Disabled" },
            ]}
          />
          <p className="text-sm text-gray-600 mt-2">
            Current value: <span className="font-mono">{settings.left_nav ? 'true' : 'false'}</span>
          </p>
        </div>
        {/* Example 2: Boolean toggle for footer */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Footer Toggle</h3>
          <GlobalFeatureToggle
            settingKey="footer"
            label="Footer"
            options={[
              { value: "true", label: "Enabled" },
              { value: "false", label: "Disabled" },
            ]}
          />
          <p className="text-sm text-gray-600 mt-2">
            Current value: <span className="font-mono">{settings.footer ? 'true' : 'false'}</span>
          </p>
        </div>
      </div>
      {/* Example 3: Using settings directly in components */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Using Settings Directly</h3>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Left Nav:</strong> {settings.left_nav ? 'Enabled' : 'Disabled'}
          </p>
          <p className="text-sm">
            <strong>Footer:</strong> {settings.footer ? 'Enabled' : 'Disabled'}
          </p>
        </div>
      </div>
      {/* Example 4: Conditional rendering based on settings */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Conditional Rendering Example</h3>
        {settings.left_nav && (
          <div className="p-3 bg-blue-100 text-blue-800 rounded">
            Left navigation is enabled! This content only shows when left_nav is true.
          </div>
        )}
        {settings.footer && (
          <div className="p-3 bg-green-100 text-green-800 rounded mt-2">
            Footer is enabled! This content only shows when footer is true.
          </div>
        )}
        {!settings.left_nav && !settings.footer && (
          <div className="p-3 bg-gray-100 text-gray-800 rounded">
            Both left_nav and footer are disabled.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureSettingsExample; 