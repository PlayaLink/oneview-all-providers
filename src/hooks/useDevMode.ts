import { useState, useEffect } from 'react';

const ANNOTATION_MODE_KEY = 'oneview_annotation_mode';

export function useAnnotationMode() {
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);

  // Initialize annotation mode from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(ANNOTATION_MODE_KEY);
    if (stored) {
      setIsAnnotationMode(JSON.parse(stored));
    }
  }, []);

  // Function to toggle annotation mode
  const toggleAnnotationMode = () => {
    const newValue = !isAnnotationMode;
    setIsAnnotationMode(newValue);
    sessionStorage.setItem(ANNOTATION_MODE_KEY, JSON.stringify(newValue));
    console.log(`📝 Annotation mode ${newValue ? 'enabled' : 'disabled'}`);
  };

  // Function to set annotation mode explicitly
  const setAnnotationMode = (value: boolean) => {
    setIsAnnotationMode(value);
    sessionStorage.setItem(ANNOTATION_MODE_KEY, JSON.stringify(value));
  };

  // Function to clear annotation mode
  const clearAnnotationMode = () => {
    setIsAnnotationMode(false);
    sessionStorage.removeItem(ANNOTATION_MODE_KEY);
  };

  return {
    isAnnotationMode,
    toggleAnnotationMode,
    setAnnotationMode,
    clearAnnotationMode,
  };
}
