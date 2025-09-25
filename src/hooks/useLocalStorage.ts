/**
 * Custom hook for localStorage with React state synchronization
 * Provides type-safe localStorage operations with automatic state updates
 */

import { useState, useEffect, useCallback } from 'react';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/lib/localStorageUtils';

/**
 * Hook for managing localStorage with React state
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns [value, setValue, removeValue] tuple
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state with value from localStorage or default
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = getLocalStorage<T>(key);
    return item !== null ? item : defaultValue;
  });

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to localStorage
        setLocalStorage(key, valueToStore);
      } catch (error) {
        console.error(`Error setting localStorage value for key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from localStorage and reset to default
  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      removeLocalStorage(key);
    } catch (error) {
      console.error(`Error removing localStorage value for key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Listen for changes to this key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue) as T;
          setStoredValue(newValue);
        } catch {
          // If parsing fails, treat as string
          setStoredValue(e.newValue as T);
        }
      } else if (e.key === key && e.newValue === null) {
        // Key was removed
        setStoredValue(defaultValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing localStorage with automatic JSON serialization
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns [value, setValue, removeValue] tuple
 */
export function useLocalStorageJSON<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = getLocalStorage<T>(key);
    return item !== null ? item : defaultValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        setLocalStorage(key, valueToStore);
      } catch (error) {
        console.error(`Error setting localStorage JSON value for key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      removeLocalStorage(key);
    } catch (error) {
      console.error(`Error removing localStorage JSON value for key "${key}":`, error);
    }
  }, [key, defaultValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue) as T;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing localStorage JSON value for key "${key}":`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(defaultValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing localStorage with custom serialization
 * @param key - The localStorage key
 * @param defaultValue - Default value if key doesn't exist
 * @param serializer - Custom serializer function
 * @param deserializer - Custom deserializer function
 * @returns [value, setValue, removeValue] tuple
 */
export function useLocalStorageCustom<T>(
  key: string,
  defaultValue: T,
  serializer: (value: T) => string,
  deserializer: (value: string) => T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = getLocalStorage<string>(key);
    if (item !== null) {
      try {
        return deserializer(item);
      } catch (error) {
        console.error(`Error deserializing localStorage value for key "${key}":`, error);
        return defaultValue;
      }
    }
    return defaultValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        const serializedValue = serializer(valueToStore);
        setLocalStorage(key, serializedValue);
      } catch (error) {
        console.error(`Error setting localStorage custom value for key "${key}":`, error);
      }
    },
    [key, storedValue, serializer]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      removeLocalStorage(key);
    } catch (error) {
      console.error(`Error removing localStorage custom value for key "${key}":`, error);
    }
  }, [key, defaultValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserializer(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error deserializing localStorage custom value for key "${key}":`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(defaultValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue, deserializer]);

  return [storedValue, setValue, removeValue];
}
