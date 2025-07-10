import React from 'react';
import GlobalFeatureToggle from '@/components/GlobalFeatureToggle';
import { useFeatureSettings } from '@/hooks/useFeatureSettings';

/**
 * Example component demonstrating how to use GlobalFeatureToggle
 * for different types of feature settings throughout the app.
 * 
 * This component shows:
 * 1. How to use GlobalFeatureToggle for select dropdowns
 * 2. How to use GlobalFeatureToggle for boolean toggles
 * 3. How to access feature settings directly in components
 * 4. How to create custom toggle components for specific use cases
 */
const FeatureSettingsExample: React.FC = () => {
  const { settings } = useFeatureSettings();

  return (
    <div className="p-6 space-y-6" role="main" aria-label="Feature settings example">
      <h2 className="text-xl font-semibold text-gray-900">Feature Settings Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example 1: Select dropdown (like grid navigation) */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Dropdown Example</h3>
          <GlobalFeatureToggle
            settingKey="grid_section_navigation"
            label="Grid Sections Navigation"
            options={[
              { value: "left-nav", label: "Left Hand Nav" },
              { value: "horizontal", label: "Horizontal" },
            ]}
          />
          <p className="text-sm text-gray-600 mt-2">
            Current value: <span className="font-mono">{settings.grid_section_navigation}</span>
          </p>
        </div>

        {/* Example 2: Boolean toggle for dark mode */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Boolean Toggle Example</h3>
          <GlobalFeatureToggle
            settingKey="dark_mode"
            label="Dark Mode"
            options={[
              { value: "true", label: "Enabled" },
              { value: "false", label: "Disabled" },
            ]}
          />
          <p className="text-sm text-gray-600 mt-2">
            Current value: <span className="font-mono">{settings.dark_mode ? 'true' : 'false'}</span>
          </p>
        </div>

        {/* Example 3: Compact view toggle */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compact View Toggle</h3>
          <GlobalFeatureToggle
            settingKey="compact_view"
            label="Compact View"
            options={[
              { value: "true", label: "Enabled" },
              { value: "false", label: "Disabled" },
            ]}
          />
          <p className="text-sm text-gray-600 mt-2">
            Current value: <span className="font-mono">{settings.compact_view ? 'true' : 'false'}</span>
          </p>
        </div>

        {/* Example 4: Auto save toggle */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Auto Save Toggle</h3>
          <GlobalFeatureToggle
            settingKey="auto_save"
            label="Auto Save"
            options={[
              { value: "true", label: "Enabled" },
              { value: "false", label: "Disabled" },
            ]}
          />
          <p className="text-sm text-gray-600 mt-2">
            Current value: <span className="font-mono">{settings.auto_save ? 'true' : 'false'}</span>
          </p>
        </div>
      </div>

      {/* Example 5: Using settings directly in components */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Using Settings Directly</h3>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Dark Mode:</strong> {settings.dark_mode ? '🌙 Enabled' : '☀️ Disabled'}
          </p>
          <p className="text-sm">
            <strong>Compact View:</strong> {settings.compact_view ? '📦 Enabled' : '📋 Disabled'}
          </p>
          <p className="text-sm">
            <strong>Auto Save:</strong> {settings.auto_save ? '💾 Enabled' : '💾 Disabled'}
          </p>
          <p className="text-sm">
            <strong>Navigation:</strong> {settings.grid_section_navigation === 'left-nav' ? '⬅️ Left Nav' : '➡️ Horizontal'}
          </p>
        </div>
      </div>

      {/* Example 6: Conditional rendering based on settings */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Conditional Rendering Example</h3>
        {settings.dark_mode && (
          <div className="p-3 bg-gray-800 text-white rounded">
            🌙 Dark mode is enabled! This content only shows when dark mode is on.
          </div>
        )}
        {settings.compact_view && (
          <div className="p-3 bg-blue-100 text-blue-800 rounded mt-2">
            📦 Compact view is enabled! This content only shows when compact view is on.
          </div>
        )}
        {!settings.dark_mode && !settings.compact_view && (
          <div className="p-3 bg-gray-100 text-gray-800 rounded">
            Default view - both dark mode and compact view are disabled.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureSettingsExample; 