# Feature Settings System

This application uses a global feature settings system that persists settings across sessions and users. Settings are stored in a Supabase `feature_settings` table and are automatically synchronized across all users of the application.

## Table Structure

The `feature_settings` table has the following structure:

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

## Current Settings

| Setting Key | Type | Default | Description |
|-------------|------|---------|-------------|
| `grid_section_navigation` | `'left-nav' \| 'horizontal'` | `'left-nav'` | Navigation mode for grid sections |

## Usage

### In React Components

```typescript
import { useFeatureSettings } from '@/hooks/useFeatureSettings';

function MyComponent() {
  const { settings, updateSetting } = useFeatureSettings();
  
  // Read a setting
  const navigationMode = settings.grid_section_navigation;
  
  // Update a setting
  const handleModeChange = (mode: 'left-nav' | 'horizontal') => {
    updateSetting('grid_section_navigation', mode);
  };
  
  return (
    <div>
      <p>Current navigation mode: {navigationMode}</p>
      <button onClick={() => handleModeChange('horizontal')}>
        Switch to Horizontal
      </button>
    </div>
  );
}
```

### For a Single Setting

```typescript
import { useFeatureSetting } from '@/hooks/useFeatureSettings';

function MyComponent() {
  const { setting, updateSetting, isLoading } = useFeatureSetting('grid_section_navigation');
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <p>Navigation mode: {setting}</p>
      <button onClick={() => updateSetting('horizontal')}>
        Switch to Horizontal
      </button>
    </div>
  );
}
```

## Setup Instructions

### 1. Create the Table

Run the SQL script in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of scripts/run-migration.sql
```

### 2. Verify Permissions

Ensure the RLS policies are correctly set up to allow authenticated users to read and update settings.

### 3. Test the System

1. Start your development server
2. Navigate to the application
3. Change the "Grid Sections Navigation" setting in the New Features dropdown
4. Refresh the page - the setting should persist
5. Log out and log back in - the setting should still be applied

## Adding New Settings

### 1. Update TypeScript Types

Add the new setting to `src/types/featureSettings.ts`:

```typescript
export interface FeatureSettings {
  // ... existing settings
  new_setting: string;
}

export const DEFAULT_FEATURE_SETTINGS: FeatureSettings = {
  // ... existing defaults
  new_setting: 'default_value',
};
```

### 2. Insert Default Value

Add the default value to the migration script or run manually:

```sql
INSERT INTO feature_settings (setting_key, setting_value, description) VALUES
    ('new_setting', '"default_value"', 'Description of the new setting')
ON CONFLICT (setting_key) DO NOTHING;
```

### 3. Use in Components

```typescript
const { settings, updateSetting } = useFeatureSettings();
const newSetting = settings.new_setting;
```

## Benefits

- **Global Persistence**: Settings persist across all users and sessions
- **Real-time Updates**: Changes are immediately reflected across all connected clients
- **Type Safety**: Full TypeScript support with proper typing
- **Caching**: Efficient caching with React Query
- **Automatic Sync**: Settings automatically sync when changed by any user

## Security

- Settings are protected by Row Level Security (RLS)
- Only authenticated users can read and update settings
- All settings are stored as JSONB for flexibility
- Audit trail with created_at and updated_at timestamps 