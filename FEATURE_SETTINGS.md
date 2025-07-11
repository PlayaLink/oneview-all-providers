# Feature Settings System

This application uses a global feature settings system that persists settings across sessions and users. Settings are stored in a Supabase `feature_settings` table and are automatically synchronized across all users of the application.

## Table Structure

The `feature_settings` table has the following structure:

```sql
CREATE TABLE feature_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    label TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Current Settings

| Setting Key | Type | Default | Description |
|-------------|------|---------|-------------|
| `left_nav` | `boolean` | `true` | Controls whether to show left sidebar navigation |
| `footer` | `boolean` | `true` | Controls whether to show the footer |

## Usage

### Using Feature Flag Context (Recommended)

```typescript
import { useFeatureFlag } from '@/contexts/FeatureFlagContext';

function MyComponent() {
  const { value: isLeftNav, isLoading } = useFeatureFlag('left_nav');
  const { value: showFooter } = useFeatureFlag('footer');
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isLeftNav && <Sidebar />}
      {showFooter && <Footer />}
    </div>
  );
}
```

### Using Feature Settings Hook (Legacy)

```typescript
import { useFeatureSettings } from '@/hooks/useFeatureSettings';

function MyComponent() {
  const { settings, updateSetting } = useFeatureSettings();
  
  // Read a setting
  const isLeftNav = settings.left_nav;
  const showFooter = settings.footer;
  
  // Update a setting
  const handleToggleLeftNav = () => {
    updateSetting('left_nav', !isLeftNav);
  };
  
  return (
    <div>
      <p>Left navigation: {isLeftNav ? 'Enabled' : 'Disabled'}</p>
      <button onClick={handleToggleLeftNav}>
        Toggle Left Navigation
      </button>
    </div>
  );
}
```

### For a Single Setting

```typescript
import { useFeatureSetting } from '@/hooks/useFeatureSettings';

function MyComponent() {
  const { setting, updateSetting, isLoading } = useFeatureSetting('left_nav');
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <p>Left navigation: {setting ? 'Enabled' : 'Disabled'}</p>
      <button onClick={() => updateSetting(!setting)}>
        Toggle Left Navigation
      </button>
    </div>
  );
}
```

## Migration from String-Based Navigation

The navigation system has been migrated from a string-based approach (`'left-nav' | 'horizontal'`) to a boolean-based approach (`left_nav: boolean`). 

- `left_nav: true` = Left sidebar navigation enabled
- `left_nav: false` = Horizontal navigation enabled

## Setup Instructions

1. Ensure the `feature_settings` table exists in your Supabase database
2. Insert default settings:

```sql
INSERT INTO feature_settings (setting_key, setting_value, label, description) VALUES
('left_nav', 'true', 'Left Navigation', 'Enable left sidebar navigation'),
('footer', 'true', 'Footer', 'Show application footer')
ON CONFLICT (setting_key) DO NOTHING;
```

3. Import and use the `FeatureFlagProvider` in your app root:

```typescript
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext';

function App() {
  return (
    <FeatureFlagProvider>
      {/* Your app components */}
    </FeatureFlagProvider>
  );
}
```

## Best Practices

1. **Use Feature Flag Context**: Prefer `useFeatureFlag()` over `useFeatureSettings()` for better performance and type safety
2. **Handle Loading States**: Always check `isLoading` before using feature flag values
3. **Boolean Values Only**: All feature flags should be boolean values for simplicity and consistency
4. **Descriptive Labels**: Use clear, descriptive labels for feature flags in the database
5. **Default Values**: Always provide sensible default values for new feature flags 