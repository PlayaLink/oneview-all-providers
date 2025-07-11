# Grid Configuration System

This document describes the grid configuration system used in the application for managing data grids and their display.

## Overview

The grid system is built around a configuration-driven approach where grids are defined in `gridDefinitions.ts` and their behavior is controlled by feature flags.

## Feature Flags

The application uses a boolean-based feature flag system:

- `left_nav`: Controls whether to show left sidebar navigation (default: `true`)
- `footer`: Controls whether to show the footer (default: `true`)

### Using Feature Flags

```typescript
import { useFeatureFlag } from '@/contexts/FeatureFlagContext';

function MyComponent() {
  const { value: isLeftNav, isLoading } = useFeatureFlag('left_nav');
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isLeftNav ? <SidebarNavigation /> : <HorizontalNavigation />}
    </div>
  );
}
```

## Grid Definitions

Grids are defined in `src/lib/gridDefinitions.ts` with the following structure:

```typescript
interface GridDefinition {
  tableName: string;
  icon: string;
  group: string;
  // ... other properties
}
```

## Navigation Modes

The application supports two navigation modes controlled by the `left_nav` feature flag:

1. **Left Navigation** (`left_nav: true`): Shows a collapsible sidebar with grid sections
2. **Horizontal Navigation** (`left_nav: false`): Shows a horizontal navigation bar

## Adding New Grids

1. Add the grid definition to `gridDefinitions.ts`
2. Create the corresponding data grid component
3. Add any necessary feature flags if the grid should be conditionally shown

## Best Practices

1. Use the `useFeatureFlag` hook for conditional rendering
2. Always handle loading states when using feature flags
3. Keep grid definitions in a single source of truth
4. Use semantic HTML and ARIA attributes for accessibility
