/**
 * OneView Design System Color Utilities
 * 
 * This file provides utility functions for working with the design system colors,
 * including semantic mappings and common color operations.
 */

import { colorTokens, semanticColors } from './colorTokens';

/**
 * Get a color token by scale and shade
 * @param color - The color name (blue, gray, green, orange, red)
 * @param shade - The shade number (50, 100, 200, etc.)
 * @returns The hex color value
 */
export function getColor(color: keyof typeof colorTokens, shade: keyof (typeof colorTokens)['blue']): string {
  return colorTokens[color][shade];
}

/**
 * Get a semantic color by category and variant
 * @param category - The semantic category (text, icon, button, etc.)
 * @param variant - The specific variant within that category
 * @returns The hex color value
 */
export function getSemanticColor<T extends keyof typeof semanticColors>(
  category: T,
  variant: keyof (typeof semanticColors)[T]
): string {
  return semanticColors[category][variant];
}

/**
 * Get all shades for a specific color
 * @param color - The color name
 * @returns Object with all shades for that color
 */
export function getColorShades(color: keyof typeof colorTokens) {
  return colorTokens[color];
}

/**
 * Get all semantic colors for a specific category
 * @param category - The semantic category
 * @returns Object with all variants for that category
 */
export function getSemanticCategory<T extends keyof typeof semanticColors>(category: T) {
  return semanticColors[category];
}

/**
 * Common color combinations for accessibility
 */
export const accessibleColorPairs = {
  // Text on backgrounds
  'text-on-white': {
    background: colorTokens.gray[00],
    text: colorTokens.gray[800],
    contrast: 'high',
  },
  'text-on-light': {
    background: colorTokens.gray[50],
    text: colorTokens.gray[800],
    contrast: 'high',
  },
  'text-on-blue': {
    background: colorTokens.blue[600],
    text: colorTokens.gray[00],
    contrast: 'high',
  },
  'text-on-dark': {
    background: colorTokens.gray[900],
    text: colorTokens.gray[00],
    contrast: 'high',
  },
  'text-on-success': {
    background: colorTokens.green[600],
    text: colorTokens.gray[00],
    contrast: 'high',
  },
  'text-on-warning': {
    background: colorTokens.orange[500],
    text: colorTokens.gray[00],
    contrast: 'high',
  },
  'text-on-error': {
    background: colorTokens.red[600],
    text: colorTokens.gray[00],
    contrast: 'high',
  },
} as const;

/**
 * Get accessible color pair for a specific background
 * @param backgroundType - The type of background
 * @returns Object with background, text, and contrast information
 */
export function getAccessibleColorPair<T extends keyof typeof accessibleColorPairs>(
  backgroundType: T
) {
  return accessibleColorPairs[backgroundType];
}

/**
 * Common button color schemes
 */
export const buttonColorSchemes = {
  primary: {
    background: colorTokens.blue[600],
    backgroundHover: colorTokens.blue[700],
    text: colorTokens.gray[00],
    border: colorTokens.blue[600],
  },
  secondary: {
    background: colorTokens.gray[100],
    backgroundHover: colorTokens.blue[100],
    text: colorTokens.gray[800],
    border: colorTokens.gray[300],
  },
  success: {
    background: colorTokens.green[600],
    backgroundHover: colorTokens.green[700],
    text: colorTokens.gray[00],
    border: colorTokens.green[600],
  },
  warning: {
    background: colorTokens.orange[500],
    backgroundHover: colorTokens.orange[600],
    text: colorTokens.gray[00],
    border: colorTokens.orange[500],
  },
  error: {
    background: colorTokens.red[600],
    backgroundHover: colorTokens.red[700],
    text: colorTokens.gray[00],
    border: colorTokens.red[600],
  },
  disabled: {
    background: colorTokens.gray[200],
    backgroundHover: colorTokens.gray[200],
    text: colorTokens.gray[400],
    border: colorTokens.gray[300],
  },
} as const;

/**
 * Get button color scheme by type
 * @param type - The button type
 * @returns Object with background, text, and border colors
 */
export function getButtonColorScheme<T extends keyof typeof buttonColorSchemes>(type: T) {
  return buttonColorSchemes[type];
}

/**
 * Status color mappings
 */
export const statusColors = {
  success: {
    light: colorTokens.green[50],
    main: colorTokens.green[500],
    dark: colorTokens.green[700],
    text: colorTokens.green[800],
  },
  warning: {
    light: colorTokens.orange[50],
    main: colorTokens.orange[500],
    dark: colorTokens.orange[700],
    text: colorTokens.orange[800],
  },
  error: {
    light: colorTokens.red[50],
    main: colorTokens.red[500],
    dark: colorTokens.red[700],
    text: colorTokens.red[800],
  },
  info: {
    light: colorTokens.blue[50],
    main: colorTokens.blue[500],
    dark: colorTokens.blue[700],
    text: colorTokens.blue[800],
  },
} as const;

/**
 * Get status colors by type
 * @param type - The status type
 * @returns Object with light, main, dark, and text colors
 */
export function getStatusColors<T extends keyof typeof statusColors>(type: T) {
  return statusColors[type];
}

/**
 * Export all colors for direct access
 */
export { colorTokens, semanticColors };
