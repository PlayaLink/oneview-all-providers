/**
 * Centralized localStorage management utilities
 * Provides type-safe, error-handled localStorage operations with fallbacks
 */

// TypeScript interfaces for localStorage keys
export interface LocalStorageKeys {
  // Grid state keys
  GRID_STATE_PREFIX: 'ag-grid-state-';
  DOCUMENTS_GRID_STATE: 'ag-grid-state-documents';
  
  // UI preference keys
  SIDE_PANEL_WIDTH: 'sidePanelWidth';
  SHOW_ROW_DETAILS_IN_MODAL: 'showRowDetailsInModal';
  
  // Add more keys as needed
  [key: string]: string;
}

// Default localStorage keys
export const LOCAL_STORAGE_KEYS: LocalStorageKeys = {
  GRID_STATE_PREFIX: 'ag-grid-state-',
  DOCUMENTS_GRID_STATE: 'ag-grid-state-documents',
  SIDE_PANEL_WIDTH: 'sidePanelWidth',
  SHOW_ROW_DETAILS_IN_MODAL: 'showRowDetailsInModal',
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Safely get item from localStorage with fallback
 */
export const getLocalStorage = <T = string>(
  key: string,
  defaultValue?: T
): T | null => {
  if (!isLocalStorageAvailable()) {
    console.warn(`localStorage not available, returning default value for key: ${key}`);
    return defaultValue ?? null;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue ?? null;
    }

    // Try to parse as JSON, fallback to string
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as T;
    }
  } catch (error) {
    console.error(`Error getting localStorage item for key "${key}":`, error);
    return defaultValue ?? null;
  }
};

/**
 * Safely set item in localStorage
 */
export const setLocalStorage = <T = any>(
  key: string,
  value: T
): boolean => {
  if (!isLocalStorageAvailable()) {
    console.warn(`localStorage not available, cannot set key: ${key}`);
    return false;
  }

  try {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error setting localStorage item for key "${key}":`, error);
    return false;
  }
};

/**
 * Safely remove item from localStorage
 */
export const removeLocalStorage = (key: string): boolean => {
  if (!isLocalStorageAvailable()) {
    console.warn(`localStorage not available, cannot remove key: ${key}`);
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage item for key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all localStorage items (use with caution)
 */
export const clearLocalStorage = (): boolean => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, cannot clear');
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Get all localStorage keys
 */
export const getLocalStorageKeys = (): string[] => {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage not available, cannot get keys');
    return [];
  }

  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
  }
};

/**
 * Get localStorage usage information
 */
export const getLocalStorageInfo = (): {
  available: boolean;
  keys: string[];
  size: number;
} => {
  const available = isLocalStorageAvailable();
  const keys = available ? getLocalStorageKeys() : [];
  
  let size = 0;
  if (available) {
    try {
      for (const key of keys) {
        const value = localStorage.getItem(key);
        if (value) {
          size += key.length + value.length;
        }
      }
    } catch (error) {
      console.error('Error calculating localStorage size:', error);
    }
  }

  return {
    available,
    keys,
    size,
  };
};
