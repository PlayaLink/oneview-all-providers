# Global Feature Toggle System

This document explains how to use the global feature toggle system that allows you to control application features from anywhere in the app.

## Overview

The global feature toggle system provides:
- **Centralized feature management** - All feature settings are stored in Supabase and synchronized across all users
- **Type-safe settings** - TypeScript interfaces ensure settings are properly typed
- **Reusable components** - The `GlobalFeatureToggle` component can be used anywhere in the app
- **Real-time updates** - Changes are immediately reflected across all components

## Quick Start

### 1. Add a new feature setting

First, add your new setting to the `FeatureSettings` interface in `src/types/featureSettings.ts`:

```typescript
export interface FeatureSettings {
  grid_section_navigation: 'left-nav' | 'horizontal';
  dark_mode: boolean;
  compact_view: boolean;
  auto_save: boolean;
  // Add your new setting here
  my_new_feature: boolean;
}
```

Update the default settings:

```typescript
export const DEFAULT_FEATURE_SETTINGS: FeatureSettings = {
  grid_section_navigation: 'left-nav',
  dark_mode: false,
  compact_view: false,
  auto_save: true,
  my_new_feature: false, // Add default value
};
```

### 2. Use the GlobalFeatureToggle component

```tsx
import GlobalFeatureToggle from '@/components/GlobalFeatureToggle';

function MyComponent() {
  return (
    <GlobalFeatureToggle
      settingKey="my_new_feature"
      label="My New Feature"
      options={[
        { value: "true", label: "Enabled" },
        { value: "false", label: "Disabled" },
      ]}
    />
  );
}
```

### 3. Access settings directly in components

```tsx
import { useFeatureSettings } from '@/hooks/useFeatureSettings';

function MyComponent() {
  const { settings } = useFeatureSettings();
  
  return (
    <div>
      {settings.my_new_feature && (
        <div>My new feature is enabled!</div>
      )}
    </div>
  );
}
```

## Component API

### GlobalFeatureToggle Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `settingKey` | `FeatureSettingKey` | Yes | The key of the setting to control |
| `label` | `string` | Yes | Display label for the setting |
| `options` | `Array<{value: string, label: string}>` | Yes | Available options for the setting |
| `className` | `string` | No | Additional CSS classes |
| `disabled` | `boolean` | No | Whether the toggle is disabled |

### Example Usage

#### Boolean Toggle
```tsx
<GlobalFeatureToggle
  settingKey="dark_mode"
  label="Dark Mode"
  options={[
    { value: "true", label: "Enabled" },
    { value: "false", label: "Disabled" },
  ]}
/>
```

#### Select Dropdown
```tsx
<GlobalFeatureToggle
  settingKey="grid_section_navigation"
  label="Navigation Mode"
  options={[
    { value: "left-nav", label: "Left Navigation" },
    { value: "horizontal", label: "Horizontal Tabs" },
  ]}
/>
```

## Hooks

### useFeatureSettings()

Returns all feature settings and update functions.

```tsx
const { settings, updateSetting, isLoading, error } = useFeatureSettings();

// Access a setting
const darkMode = settings.dark_mode;

// Update a setting
updateSetting('dark_mode', true);
```

### useFeatureSetting(key)

Returns a single setting and its update function.

```tsx
const { setting, updateSetting, isLoading } = useFeatureSetting('dark_mode');

// Access the setting
const darkMode = setting;

// Update the setting
updateSetting(true);
```

## Database Schema

Feature settings are stored in the `feature_settings` table:

```sql
CREATE TABLE feature_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Best Practices

### 1. Type Safety
Always define your settings in the `FeatureSettings` interface to ensure type safety.

### 2. Default Values
Provide sensible default values in `DEFAULT_FEATURE_SETTINGS`.

### 3. Loading States
Handle loading states when settings are being fetched:

```tsx
const { settings, isLoading } = useFeatureSettings();

if (isLoading) {
  return <div>Loading settings...</div>;
}
```

### 4. Error Handling
Handle errors gracefully:

```tsx
const { settings, error } = useFeatureSettings();

if (error) {
  console.error('Failed to load settings:', error);
  // Use default settings or show error message
}
```

### 5. Conditional Rendering
Use settings for conditional rendering:

```tsx
const { settings } = useFeatureSettings();

return (
  <div>
    {settings.dark_mode ? (
      <DarkTheme />
    ) : (
      <LightTheme />
    )}
  </div>
);
```

## Migration Guide

### From Local State to Global Settings

**Before (local state):**
```tsx
const [darkMode, setDarkMode] = useState(false);

return (
  <select value={darkMode} onChange={(e) => setDarkMode(e.target.value === 'true')}>
    <option value="false">Disabled</option>
    <option value="true">Enabled</option>
  </select>
);
```

**After (global settings):**
```tsx
<GlobalFeatureToggle
  settingKey="dark_mode"
  label="Dark Mode"
  options={[
    { value: "false", label: "Disabled" },
    { value: "true", label: "Enabled" },
  ]}
/>
```

## Examples

See `src/components/FeatureSettingsExample.tsx` for comprehensive examples of how to use the global feature toggle system.

## Troubleshooting

### Settings not updating
- Check that the setting key matches the one defined in `FeatureSettings`
- Ensure the database has the correct setting value
- Verify that the component is wrapped in a React Query provider

### Type errors
- Make sure the setting is defined in the `FeatureSettings` interface
- Check that the setting key is included in `FeatureSettingKey` type
- Verify that default values are provided in `DEFAULT_FEATURE_SETTINGS`

### Database issues
- Run the migration script to create the `feature_settings` table
- Check that the user has proper permissions to read/write settings
- Verify that the Supabase client is properly configured 