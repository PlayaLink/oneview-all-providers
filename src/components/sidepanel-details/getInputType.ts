export function getInputType(field: { options?: any[]; type?: string }) {
  if (Array.isArray(field.options) && field.options.length > 0) {
    return field.type === 'multi-select' ? 'multi-select' : 'single-select';
  }
  return 'text';
} 