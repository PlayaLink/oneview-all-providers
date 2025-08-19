# OneView Design System - Color System

## Overview

This document outlines the OneView Design System color system, which provides a comprehensive, accessible, and maintainable approach to color usage across the application.

## Color Architecture

The color system is built on three layers:

1. **Base Color Tokens** - Raw color values (50-900 scale)
2. **Semantic Color Mappings** - Meaningful color assignments
3. **Tailwind CSS Integration** - Utility classes for rapid development

## Color Palettes

### Brand Blue Scale
- **50**: #EAF6FA (Lightest)
- **100**: #D6EDF5
- **200**: #ACDBEC
- **300**: #83C9E2
- **400**: #5AB7D8
- **500**: #3BA8D1 (Base)
- **600**: #2784A5
- **700**: #1F6984
- **800**: #174F63
- **900**: #113B4A (Darkest)

### Neutral Gray Scale
- **00**: #FFFFFF (Pure White)
- **50**: #F9FAFC
- **100**: #F3F4F6
- **200**: #E6E7EB
- **300**: #D2D5DC
- **400**: #9CA2AE
- **500**: #6B7380
- **600**: #4C5564
- **700**: #384152
- **800**: #202938
- **900**: #111828 (Darkest)

### Semantic Green Scale
- **50**: #F2F8ED (Lightest)
- **500**: #79AC48 (Base - Verified, Save)
- **900**: #416424 (Darkest)

### Semantic Orange Scale
- **50**: #FEF6E7 (Lightest)
- **500**: #F48100 (Base - In Progress, Expiring)
- **900**: #BC4900 (Darkest)

### Semantic Red Scale
- **50**: #FFEBE7 (Lightest)
- **500**: #DB0D00 (Base - Not Started, Delete, Expiring)
- **900**: #830900 (Darkest)

## Usage Guidelines

### 1. Direct Color Usage

```tsx
// Using base color tokens
<div className="bg-blue-500 text-white">Primary Blue Background</div>
<div className="bg-gray-100 text-gray-800">Light Gray Background</div>
<div className="bg-green-500 text-white">Success Green</div>
```

### 2. Semantic Color Usage

```tsx
// Using semantic color mappings
<div className="bg-button-primary text-white">Primary Button</div>
<div className="bg-status-success text-white">Success Status</div>
<div className="text-text-hyperlink">Hyperlink Text</div>
```

### 3. Utility Functions

```tsx
import { getColor, getSemanticColor, getButtonColorScheme } from '@/lib/colorUtils';

// Get specific colors
const primaryBlue = getColor('blue', '500');
const buttonText = getSemanticColor('button', 'primary');

// Get complete color schemes
const primaryButtonScheme = getButtonColorScheme('primary');
```

## Accessibility Standards

### WCAG AA Compliance

The color system is designed to meet WCAG AA contrast requirements:

- **Text on White**: Use gray-500 or darker
- **Text on Light Gray**: Use gray-500 or darker  
- **Text on Blue**: Use white (gray-00)
- **Text on Dark**: Use white (gray-00)
- **Text on Success**: Use white (gray-00)
- **Text on Warning**: Use white (gray-00)
- **Text on Error**: Use white (gray-00)

### Contrast Thresholds

- **Light backgrounds**: Text must be gray-500 or darker
- **Dark backgrounds**: Text must be gray-400 or lighter
- **Colored backgrounds**: Text must provide sufficient contrast

## Component Examples

### Buttons

```tsx
// Primary Button
<button className="bg-button-primary hover:bg-button-primary-hover text-white px-4 py-2 rounded">
  Primary Action
</button>

// Success Button
<button className="bg-status-success hover:bg-green-700 text-white px-4 py-2 rounded">
  Save Changes
</button>

// Secondary Button
<button className="bg-button-secondary hover:bg-button-secondary-hover text-gray-800 px-4 py-2 rounded border border-gray-300">
  Cancel
</button>
```

### Status Indicators

```tsx
// Success Badge
<span className="bg-status-success text-white px-2 py-1 rounded-full text-sm">
  Verified
</span>

// Warning Badge
<span className="bg-status-warning text-white px-2 py-1 rounded-full text-sm">
  Expiring Soon
</span>

// Error Badge
<span className="bg-status-error text-white px-2 py-1 rounded-full text-sm">
  Not Started
</span>
```

### Text Elements

```tsx
// Body Text
<p className="text-text-body">Standard body text</p>

// Secondary Text
<p className="text-text-secondary">Less prominent information</p>

// Hyperlinks
<a href="#" className="text-text-hyperlink hover:text-text-link-hover">
  Click here
</a>

// Disabled Text
<span className="text-text-disabled">Unavailable option</span>
```

### Backgrounds

```tsx
// Page Background
<div className="bg-background-default">Page content</div>

// Card Background
<div className="bg-background-light border border-stroke-med">Card content</div>

// Hover States
<div className="bg-background-div-item-hover hover:bg-background-div-item-selected">
  Interactive item
</div>
```

## Migration Guide

### From Hex Codes to Semantic Classes

| Old Usage | New Usage | Semantic Meaning |
|-----------|-----------|------------------|
| `bg-[#3BA8D1]` | `bg-blue-500` | Brand blue |
| `bg-[#79AC48]` | `bg-green-500` | Success green |
| `bg-[#F48100]` | `bg-orange-500` | Warning orange |
| `bg-[#DB0D00]` | `bg-red-500` | Error red |
| `text-[#545454]` | `text-gray-600` | Secondary text |
| `bg-[#E6E7EB]` | `bg-gray-200` | Light background |

### From Hex Codes to Semantic Classes

| Old Usage | New Usage | Semantic Meaning |
|-----------|-----------|------------------|
| `bg-[#3BA8D1]` | `bg-button-primary` | Primary button |
| `bg-[#79AC48]` | `bg-status-success` | Success status |
| `bg-[#F48100]` | `bg-status-warning` | Warning status |
| `bg-[#DB0D00]` | `bg-status-error` | Error status |
| `text-[#545454]` | `text-text-body` | Body text |
| `bg-[#E6E7EB]` | `bg-background-light` | Light background |

## Best Practices

### 1. Use Semantic Colors When Possible
- Prefer `bg-button-primary` over `bg-blue-600`
- Use `text-text-body` instead of `text-gray-800`
- Choose `bg-status-success` over `bg-green-500`

### 2. Maintain Accessibility
- Always ensure sufficient contrast ratios
- Test color combinations with accessibility tools
- Use the provided accessible color pairs

### 3. Consistency
- Use the same color for the same semantic meaning
- Follow the established color hierarchy
- Avoid creating new color combinations without review

### 4. Responsive Design
- Colors work across all screen sizes
- No special handling needed for mobile vs desktop
- Maintain accessibility on all devices

## Adding New Colors

### 1. Update Color Tokens
Add new colors to `src/lib/colorTokens.ts`:

```typescript
export const colorTokens = {
  // ... existing colors
  purple: {
    50: '#F3E8FF',
    100: '#E9D5FF',
    // ... add all shades
    900: '#581C87',
  },
};
```

### 2. Update CSS Variables
Add to `src/index.css`:

```css
:root {
  /* ... existing variables */
  --purple-50: #F3E8FF;
  --purple-100: #E9D5FF;
  /* ... add all shades */
  --purple-900: #581C87;
}
```

### 3. Update Tailwind Config
Add to `tailwind.config.ts`:

```typescript
extend: {
  colors: {
    // ... existing colors
    purple: {
      50: "var(--purple-50)",
      100: "var(--purple-100)",
      // ... add all shades
      900: "var(--purple-900)",
    },
  },
}
```

### 4. Update Documentation
Add the new color to this documentation file.

## Troubleshooting

### Common Issues

1. **Colors not appearing**: Ensure Tailwind is rebuilding after config changes
2. **Type errors**: Check that color names match exactly in all files
3. **Accessibility issues**: Use the provided accessible color pairs
4. **Inconsistent appearance**: Verify CSS variables are properly defined

### Debug Tools

- Use browser dev tools to inspect CSS variables
- Check Tailwind CSS IntelliSense for available classes
- Verify color values in the color tokens file

## Support

For questions about the color system:
1. Check this documentation first
2. Review the color tokens file
3. Consult the utility functions
4. Contact the design system team

---

*Last updated: [Current Date]*
*Version: 1.0.0*
