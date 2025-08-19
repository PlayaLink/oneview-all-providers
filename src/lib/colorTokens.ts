/**
 * OneView Design System Color Tokens
 * 
 * This file serves as the single source of truth for all colors in the design system.
 * Colors are organized by semantic meaning and follow a consistent 50-900 scale.
 * 
 * Generated missing shades for green, orange, and red following the same progression
 * as the provided blue and gray palettes.
 */

export const colorTokens = {
  // Brand Blue Palette (from designer)
  blue: {
    50: '#EAF6FA',
    100: '#D6EDF5',
    200: '#ACDBEC',
    300: '#83C9E2',
    400: '#5AB7D8',
    500: '#3BA8D1',
    600: '#2784A5',
    700: '#1F6984',
    800: '#174F63',
    900: '#113B4A',
  },

  // Neutral Gray Palette (from designer)
  gray: {
    '00': '#FFFFFF', // Pure white
    50: '#F9FAFC',
    100: '#F3F4F6',
    200: '#E6E7EB',
    300: '#D2D5DC',
    400: '#9CA2AE',
    500: '#6B7380',
    600: '#4C5564',
    700: '#384152',
    800: '#202938',
    900: '#111828',
  },

  // Semantic Green Palette (generated from #79AC48)
  green: {
    50: '#F2F8ED',
    100: '#E6F1DB',
    200: '#CCE3B7',
    300: '#B3D593',
    400: '#99C76F',
    500: '#79AC48', // Base color from designer
    600: '#6B9A3F',
    700: '#5D8836',
    800: '#4F762D',
    900: '#416424',
  },

  // Semantic Orange Palette (generated from #F48100)
  orange: {
    50: '#FEF6E7',
    100: '#FDEDCF',
    200: '#FBDB9F',
    300: '#F9C96F',
    400: '#F7B73F',
    500: '#F48100', // Base color from designer
    600: '#E67300',
    700: '#D86500',
    800: '#CA5700',
    900: '#BC4900',
  },

  // Semantic Red Palette (generated from #DB0D00)
  red: {
    50: '#FFEBE7',
    100: '#FFD7CF',
    200: '#FFAF9F',
    300: '#FF876F',
    400: '#FF5F3F',
    500: '#DB0D00', // Base color from designer
    600: '#C50C00',
    700: '#AF0B00',
    800: '#990A00',
    900: '#830900',
  },
} as const;

/**
 * Semantic color mappings based on design system standards
 */
export const semanticColors = {
  // Text colors
  text: {
    body: colorTokens.gray[800],
    bodyReversed: colorTokens.gray['00'],
    secondary: colorTokens.gray[600],
    secondaryReversed: colorTokens.gray[300],
    disabled: colorTokens.gray[400],
    hyperlink: colorTokens.blue[600],
    linkHover: colorTokens.blue[700],
    linkReversed: colorTokens.blue[100],
    reversedLinkHover: colorTokens.blue[200],
    notice: colorTokens.blue[800],
    warning: colorTokens.orange[800],
    alert: colorTokens.red[800],
  },

  // Icon colors
  icon: {
    default: colorTokens.gray[800],
    hover: colorTokens.blue[700],
    selected: colorTokens.blue[600],
    disabled: colorTokens.gray[400],
    reversed: colorTokens.gray['00'],
    reversedHover: colorTokens.blue[200],
    reversedSelected: colorTokens.blue[300],
    activeReversed: colorTokens.blue[100],
    accentReversed: colorTokens.blue[100],
  },

  // Button colors
  button: {
    primary: colorTokens.blue[600],
    primaryHover: colorTokens.blue[700],
    secondary: colorTokens.gray[100],
    secondaryHover: colorTokens.blue[100],
    secondaryReversed: colorTokens.blue[100],
    secondaryReversedHover: colorTokens.blue[100],
    add: colorTokens.green[600],
    addHover: colorTokens.green[700],
    disabled: colorTokens.gray[200],
    reversed: colorTokens.gray['00'],
    warning: colorTokens.orange[50],
    alert: colorTokens.red[100],
    light: colorTokens.gray[50],
    lightBlue: colorTokens.blue[50],
  },

  // Background colors
  background: {
    default: colorTokens.gray['00'],
    light: colorTokens.gray[50],
    lightBlue: colorTokens.blue[50],
    med: colorTokens.gray[100],
    medBlue: colorTokens.blue[100],
    dark: colorTokens.gray[700],
    darkest: colorTokens.gray[900],
    notice: colorTokens.blue[700],
    success: colorTokens.green[700],
    error: colorTokens.red[700],
    divItemHover: colorTokens.blue[50],
    divItemSelected: colorTokens.blue[100],
  },

  // Stroke/Border colors
  stroke: {
    dark: colorTokens.gray[300],
    med: colorTokens.gray[200],
    focused: colorTokens.blue[400],
    error: colorTokens.red[500],
  },

  // Status colors
  status: {
    success: colorTokens.green[500],
    warning: colorTokens.orange[500],
    error: colorTokens.red[500],
    info: colorTokens.blue[500],
  },
} as const;

/**
 * CSS custom property definitions for use in CSS files
 */
export const cssCustomProperties = {
  // Blue scale
  '--blue-50': colorTokens.blue[50],
  '--blue-100': colorTokens.blue[100],
  '--blue-200': colorTokens.blue[200],
  '--blue-300': colorTokens.blue[300],
  '--blue-400': colorTokens.blue[400],
  '--blue-500': colorTokens.blue[500],
  '--blue-600': colorTokens.blue[600],
  '--blue-700': colorTokens.blue[700],
  '--blue-800': colorTokens.blue[800],
  '--blue-900': colorTokens.blue[900],

  // Gray scale
  '--gray-00': colorTokens.gray['00'],
  '--gray-50': colorTokens.gray[50],
  '--gray-100': colorTokens.gray[100],
  '--gray-200': colorTokens.gray[200],
  '--gray-300': colorTokens.gray[300],
  '--gray-400': colorTokens.gray[400],
  '--gray-500': colorTokens.gray[500],
  '--gray-600': colorTokens.gray[600],
  '--gray-700': colorTokens.gray[700],
  '--gray-800': colorTokens.gray[800],
  '--gray-900': colorTokens.gray[900],

  // Green scale
  '--green-50': colorTokens.green[50],
  '--green-100': colorTokens.green[100],
  '--green-200': colorTokens.green[200],
  '--green-300': colorTokens.green[300],
  '--green-400': colorTokens.green[400],
  '--green-500': colorTokens.green[500],
  '--green-600': colorTokens.green[600],
  '--green-700': colorTokens.green[700],
  '--green-800': colorTokens.green[800],
  '--green-900': colorTokens.green[900],

  // Orange scale
  '--orange-50': colorTokens.orange[50],
  '--orange-100': colorTokens.orange[100],
  '--orange-200': colorTokens.orange[200],
  '--orange-300': colorTokens.orange[300],
  '--orange-400': colorTokens.orange[400],
  '--orange-500': colorTokens.orange[500],
  '--orange-600': colorTokens.orange[600],
  '--orange-700': colorTokens.orange[700],
  '--orange-800': colorTokens.orange[800],
  '--orange-900': colorTokens.orange[900],

  // Red scale
  '--red-50': colorTokens.red[50],
  '--red-100': colorTokens.red[100],
  '--red-200': colorTokens.red[200],
  '--red-300': colorTokens.red[300],
  '--red-400': colorTokens.red[400],
  '--red-500': colorTokens.red[500],
  '--red-600': colorTokens.red[600],
  '--red-700': colorTokens.red[700],
  '--red-800': colorTokens.red[800],
  '--red-900': colorTokens.red[900],
} as const;

export type ColorToken = typeof colorTokens;
export type SemanticColor = typeof semanticColors;
export type CSSCustomProperty = typeof cssCustomProperties;
